#!/usr/bin/env node

/**
 * check_environment.js - Agent-Runner-Kit 一键环境诊断与连通性自检工具
 * 
 * 用法：
 *   node check_environment.js
 */

const os = require('os');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('\n======================================================');
console.log('  🏃 Agent-Runner-Kit 运动科学训练中枢环境诊断工具');
console.log('======================================================\n');

let allGood = true;

// 1. Node.js 版本检查
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
if (majorVersion >= 18) {
  console.log(`[✅ 通过] Node.js 运行时环境: ${nodeVersion} (满足 >= v18.0.0 要求)`);
} else {
  console.log(`[❌ 异常] Node.js 版本过低: ${nodeVersion}。请升级至 Node.js v18 或更高版本。`);
  allGood = false;
}

// 2. 本机物理网卡探测 (针对高驰大陆区直连)
function getPhysicalNet() {
  const interfaces = os.networkInterfaces();
  const candidates = ['WLAN', 'Wi-Fi', '以太网', 'Ethernet'];
  for (const name of candidates) {
    if (interfaces[name]) {
      for (const net of interfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return { name, ip: net.address };
        }
      }
    }
  }
  for (const name of Object.keys(interfaces)) {
    if (name.includes('Mihomo') || name.includes('Tunnel') || name.includes('vEthernet') || name.includes('VMware') || name.includes('Virtual')) {
      continue;
    }
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return { name, ip: net.address };
      }
    }
  }
  return null;
}

const physNet = getPhysicalNet();
if (physNet) {
  console.log(`[✅ 通过] 物理网卡探测成功: 接口 [${physNet.name}] -> IPv4: ${physNet.ip}`);
  console.log('         (直连脚本可安全绕过 VPN/代理工具绑定该网卡直达阿里云)');
} else {
  console.log('[⚠️ 警告] 未探测到常规物理网卡，直连脚本可能会回退到默认网络路由。');
}

// 3. 高驰大陆区凭证检查
const corosTokenPath = path.join(os.homedir(), '.coros-mcp-skill-gateway-ts', 'cn', 'token.json');
if (fs.existsSync(corosTokenPath)) {
  try {
    const tokenData = JSON.parse(fs.readFileSync(corosTokenPath, 'utf8'));
    if (tokenData.access_token) {
      console.log(`[✅ 通过] 高驰 (COROS) 大陆区凭证就绪: ${corosTokenPath}`);
    } else {
      console.log(`[⚠️ 警告] 找到高驰凭证文件，但未包含有效的 access_token: ${corosTokenPath}`);
    }
  } catch {
    console.log(`[❌ 异常] 高驰凭证文件损坏: ${corosTokenPath}`);
  }
} else {
  console.log(`[ℹ️ 待办] 未检测到高驰大陆区凭证: ${corosTokenPath}`);
  console.log('         若需同步高驰数据，请参考 02_MCP_Setup/coros_cn/SETUP_GUIDE.md 完成一次登录。');
}

// 4. Intervals.icu MCP 命令行工具检查
try {
  const intervalsVersion = execSync('intervals-mcp-server --version', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  console.log(`[✅ 通过] Intervals.icu MCP 工具已全局安装: v${intervalsVersion || 'installed'}`);
} catch {
  console.log('[ℹ️ 可选] intervals-mcp-server 未全局安装 (若使用智能骑行台/全平台聚合，可运行: npm install -g intervals-mcp-server)');
}

console.log('\n------------------------------------------------------');
if (allGood) {
  console.log('🎉 核心基础环境自检良好！');
  console.log('下一步：在你的 AI 工具中向 Agent 发送 AGENT_BOOTSTRAP.md 即可开始构建！');
} else {
  console.log('⚠️ 请先根据上方红叉提示解决环境依赖后再继续。');
}
console.log('======================================================\n');
