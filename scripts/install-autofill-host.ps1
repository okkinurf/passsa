param(
  [Parameter(Mandatory = $true)][string]$ExtensionId,
  [string]$HostExecutable = ""
)

$ErrorActionPreference = 'Stop'
$hostName = 'com.passsa.native'
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $HostExecutable) { $HostExecutable = Join-Path $scriptRoot 'native-messaging-host.cmd' }
$hostExecutable = [IO.Path]::GetFullPath($HostExecutable)
$manifestDirectory = Join-Path $env:LOCALAPPDATA 'PassSa'
$manifestPath = Join-Path $manifestDirectory "$hostName.json"
New-Item -ItemType Directory -Force -Path $manifestDirectory | Out-Null

$manifest = [ordered]@{
  name = $hostName
  description = 'PassSa secure autofill bridge'
  path = $hostExecutable
  type = 'stdio'
  allowed_origins = @("chrome-extension://$ExtensionId/")
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

$chromeKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$hostName"
$edgeKey = "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\$hostName"
New-Item -Path $chromeKey -Force | Out-Null
New-Item -Path $edgeKey -Force | Out-Null
Set-ItemProperty -Path $chromeKey -Name '(default)' -Value $manifestPath
Set-ItemProperty -Path $edgeKey -Name '(default)' -Value $manifestPath
Write-Host "PassSa native autofill host terdaftar untuk Chrome dan Edge."
Write-Host "Manifest: $manifestPath"
Write-Host "Extension ID: $ExtensionId"
