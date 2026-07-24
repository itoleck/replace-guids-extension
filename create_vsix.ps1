# Packages the Replace Guids extension into replace-guids.vsix
# Usage: ./create_vsix.ps1

npx --yes @vscode/vsce package --allow-missing-repository --skip-license -o replace-guids.vsix
