/**
 * coros-direct.js - 高驰 (COROS) 大陆区官方节点直连与全量 MCP 工具执行引擎
 * 
 * 机制原理：
 * 自动探测本机真实物理网卡 (WLAN/以太网)，规避 Clash / Mihomo / 虚拟网卡等代理工具截获，
 * 绑定物理 IP 直连高驰国内阿里云杭州机房节点 (8.141.27.17 / mcpcn.coros.com) 完成 TLS 握手。
 * 
 * 依赖：
 * 本机需已通过官方网关完成一次登录，生成 ~/.coros-mcp-skill-gateway-ts/cn/token.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const toolName = process.argv[2];
const arg3 = process.argv[3] || '';
const arg4 = process.argv[4] || '';

if (!toolName) {
  console.log(`
Usage:
  node coros-direct.js listTools
  node coros-direct.js <toolName> [jsonArgs | @file.json]

Examples:
  node coros-direct.js queryUserInfo
  node coros-direct.js queryDevices
  node coros-direct.js queryRecoveryStatus
  node coros-direct.js queryFitnessAssessmentOverview
  node coros-direct.js queryTrainingLoadAssessment
  node coros-direct.js querySportRecords 20261020 20261020
  node coros-direct.js queryTrainingSchedule 20261020 20261026
  node coros-direct.js getActivityDetail <labelId> [sportType]
  node coros-direct.js parseLaps <labelId> [sportType]
`);
  process.exit(1);
}

const tokenPath = path.join(os.homedir(), '.coros-mcp-skill-gateway-ts', 'cn', 'token.json');
if (!fs.existsSync(tokenPath)) {
  console.error('[Error] 未找到高驰国内 Token 缓存文件: ' + tokenPath);
  console.error('请先按照 SETUP_GUIDE.md 指引完成高驰大陆区登录初始化。');
  process.exit(1);
}

const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));

// 探测物理网卡 IPv4 (规避 Clash / Mihomo / 虚拟网卡代理截获)
function getLocalPhysicalIp() {
  const interfaces = os.networkInterfaces();
  if (interfaces['WLAN']) {
    for (const net of interfaces['WLAN']) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  if (interfaces['Wi-Fi']) {
    for (const net of interfaces['Wi-Fi']) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  if (interfaces['以太网']) {
    for (const net of interfaces['以太网']) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  if (interfaces['Ethernet']) {
    for (const net of interfaces['Ethernet']) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  for (const name of Object.keys(interfaces)) {
    if (name.includes('Mihomo') || name.includes('Tunnel') || name.includes('vEthernet') || name.includes('VMware') || name.includes('本地连接') || name.includes('Virtual') || name.includes('Loopback')) {
      continue;
    }
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return undefined;
}

const localIp = getLocalPhysicalIp();

let toolArgs = {};
const isListTools = (toolName === 'listTools' || toolName === 'tools/list');

if (!isListTools) {
  try {
    if ((toolName === 'querySportRecords' || toolName === 'queryTrainingSchedule' || toolName === 'querySleepData' || toolName === 'querySleepHrv') && /^\d{8}$/.test(arg3) && /^\d{8}$/.test(arg4)) {
      toolArgs = { startDate: arg3, endDate: arg4 };
    } else if ((toolName === 'getActivityDetail' || toolName === 'analyzeActivityDetail' || toolName === 'queryActivityLapData' || toolName === 'parseBillat' || toolName === 'parseLaps') && /^\d{15,}$/.test(arg3)) {
      toolArgs = { labelId: arg3, sportType: arg4 ? parseInt(arg4, 10) : 100 };
    } else if (arg3.startsWith('@') || arg3.endsWith('.json')) {
      const filePath = arg3.startsWith('@') ? arg3.slice(1) : arg3;
      const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
      toolArgs = JSON.parse(content);
    } else if (arg3) {
      toolArgs = JSON.parse(arg3.replace(/^\uFEFF/, '').trim());
    }
  } catch (e) {
    console.error('[Error] 参数解析失败:', e.message);
    process.exit(1);
  }
}

const postData = JSON.stringify({
  jsonrpc: '2.0',
  id: Math.floor(Math.random() * 10000),
  method: isListTools ? 'tools/list' : 'tools/call',
  params: isListTools ? {} : {
    name: (toolName === 'parseBillat' || toolName === 'parseLaps') ? 'queryActivityLapData' : toolName,
    arguments: toolArgs
  }
});

const reqOptions = {
  host: '8.141.27.17', // 国内阿里云杭州机房节点
  port: 443,
  path: '/mcp',
  method: 'POST',
  servername: 'mcpcn.coros.com',
  headers: {
    'Host': 'mcpcn.coros.com',
    'Authorization': 'Bearer ' + token.access_token,
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
    'Content-Length': Buffer.byteLength(postData)
  }
};

if (localIp) {
  reqOptions.localAddress = localIp;
}

const req = https.request(reqOptions, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);

      // 处理 tools/list
      if (parsed.result && parsed.result.tools) {
        console.log(`\n=== 🌟 COROS 官方 MCP 注册工具全量列表 (${parsed.result.tools.length} 项) ===\n`);
        parsed.result.tools.forEach((t, i) => {
          console.log(`${(i+1).toString().padStart(2, ' ')}. [${t.name}]`);
          console.log(`    功能说明: ${t.description.split('\n')[0]}`);
          const props = t.inputSchema && t.inputSchema.properties ? Object.keys(t.inputSchema.properties).join(', ') : '无';
          console.log(`    支持参数: ${props}`);
          console.log(`    必填字段: ${JSON.stringify(t.inputSchema ? (t.inputSchema.required || []) : [])}\n`);
        });
        return;
      }

      // 处理 tools/call 返回的内容
      if (parsed.result && parsed.result.content) {
        for (const item of parsed.result.content) {
          if (item.type === 'text') {
            try {
              const parsedText = JSON.parse(item.text);

              if (toolName === 'parseLaps') {
                console.log('=== 🏃 官方圈速分段详细解析 (Official Laps) ===');
                parsedText.lapGroups.forEach((g, gIdx) => {
                  console.log(`\nGroup ${gIdx} (Type: ${g.type}, LapDist: ${g.lapDistance}, Count: ${g.laps.length}):`);
                  g.laps.forEach(l => {
                    const paceM = Math.floor(l.avgPace / 60);
                    const paceS = (l.avgPace % 60).toFixed(1).padStart(4, '0');
                    const distM = (l.distance / 100).toFixed(1);
                    console.log(`  Lap ${l.lapIndex.toString().padStart(2, ' ')}: Dist: ${distM}m | Time: ${l.time.toFixed(1)}s | Pace: ${paceM}:${paceS}/km | HR: ${l.avgHr}/${l.maxHr} | Power: ${l.avgPower}W | Cad: ${l.avgCadence}spm | GCT: ${l.groundTime}ms | SL: ${(l.avgStrideLength/100).toFixed(2)}m`);
                  });
                });
              } else {
                console.log(JSON.stringify(parsedText, null, 2));
              }
            } catch {
              console.log(item.text);
            }
          }
        }
      } else {
        console.log(JSON.stringify(parsed, null, 2));
      }
    } catch {
      console.log(body);
    }
  });
});

req.on('error', err => {
  console.error('[Network Error]:', err.message);
  process.exit(1);
});

req.write(postData);
req.end();
