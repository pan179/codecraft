# CodeCraft · 安装到桌面
# 把单文件应用复制到 %LOCALAPPDATA%\Programs\CodeCraft，并在桌面创建带图标的快捷方式
# 用 Chrome / Edge 的 --app 模式打开：没有地址栏、没有标签栏，像一个独立应用
#
# 用法：右键「使用 PowerShell 运行」，或双击 安装到桌面.cmd

param(
  [switch]$DryRun,
  [switch]$Uninstall
)

$ErrorActionPreference = 'Stop'

$appName   = 'CodeCraft 学习站'
$sourceDir = $PSScriptRoot
$destDir   = Join-Path $env:USERPROFILE 'Apps\CodeCraft'
$srcHtml   = Join-Path $sourceDir 'CodeCraft.html'
$srcIcon   = Join-Path $sourceDir 'icon.ico'
$destHtml  = Join-Path $destDir 'CodeCraft.html'
$destIcon  = Join-Path $destDir 'icon.ico'
$desktop   = [Environment]::GetFolderPath('Desktop')
$lnkPath   = Join-Path $desktop ($appName + '.lnk')

function Fail($msg) {
  Write-Host ''
  Write-Host "x $msg" -ForegroundColor Red
  exit 1
}

if ($Uninstall) {
  if (Test-Path $lnkPath) { Remove-Item $lnkPath -Force; Write-Host "已删除桌面快捷方式" }
  if (Test-Path $destDir) { Remove-Item $destDir -Recurse -Force; Write-Host "已删除 $destDir" }
  Write-Host "卸载完成。浏览器里的学习进度不会被删除。" -ForegroundColor Green
  exit 0
}

if (-not (Test-Path $srcHtml)) { Fail "找不到 CodeCraft.html，请确认它和本脚本在同一个文件夹里" }

# ---------- 1. 找浏览器 ----------
$candidates = @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe')
) | Where-Object { $_ -and (Test-Path $_) }

$browser = $candidates | Select-Object -First 1
if ($browser) {
  Write-Host "浏览器：$browser"
} else {
  Write-Host "没找到 Chrome/Edge，将用系统默认浏览器打开（会带地址栏）" -ForegroundColor Yellow
}

# ---------- 2. 复制应用 ----------
if (-not $DryRun) {
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  Copy-Item $srcHtml $destHtml -Force
  if (Test-Path $srcIcon) { Copy-Item $srcIcon $destIcon -Force }
}
Write-Host "应用目录：$destDir"

# ---------- 3. 组装启动参数 ----------
$uri = ([System.Uri]$destHtml).AbsoluteUri
Write-Host "应用地址：$uri"

$arguments = ''
if ($browser) { $arguments = "--app=$uri --window-size=1400,900" }

if ($DryRun) {
  Write-Host ''
  Write-Host 'DryRun：目标' $browser
  Write-Host 'DryRun：参数' $arguments
  Write-Host 'DryRun：快捷方式' $lnkPath
  exit 0
}

# ---------- 4. 建快捷方式 ----------
$shell = New-Object -ComObject WScript.Shell
$sc = $shell.CreateShortcut($lnkPath)
if ($browser) {
  $sc.TargetPath = $browser
  $sc.Arguments = $arguments
  $sc.WorkingDirectory = $destDir
} else {
  $sc.TargetPath = $destHtml
  $sc.WorkingDirectory = $destDir
}
if (Test-Path $destIcon) { $sc.IconLocation = "$destIcon,0" }
$sc.Description = 'CodeCraft · 多语言编程训练场'
$sc.Save()

Write-Host ''
Write-Host "完成。桌面已创建「$appName」，双击即可打开。" -ForegroundColor Green
Write-Host "想卸载：在本脚本上带 -Uninstall 运行一次即可。"
