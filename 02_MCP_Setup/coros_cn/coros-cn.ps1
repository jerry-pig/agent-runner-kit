# coros-cn.ps1: PowerShell 快捷执行高驰命令
param(
    [Parameter(Position=0, Mandatory=$true)]
    [string]$Command,

    [Parameter(Position=1, Mandatory=$false)]
    [string]$Arg1 = "",

    [Parameter(Position=2, Mandatory=$false)]
    [string]$Arg2 = ""
)

$scriptPath = Join-Path $PSScriptRoot "coros-direct.js"

if ($Arg2 -ne "") {
    node $scriptPath $Command $Arg1 $Arg2
} elseif ($Arg1 -ne "") {
    node $scriptPath $Command $Arg1
} else {
    node $scriptPath $Command
}
