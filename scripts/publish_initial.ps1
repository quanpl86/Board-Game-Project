# Documentation-only local import helper. Use only on a fresh branch.
param([string]$Remote = "origin", [string]$Branch = "docs/initial-platform-architecture")
$ErrorActionPreference = "Stop"
if (-not (Test-Path ".git")) { throw "Not a Git checkout. Clone the repository first." }
git status --short
Write-Output "Review changes, run docs validation, then commit and push manually:"
Write-Output "  python scripts/validate_docs.py"
Write-Output "  git switch -c $Branch"
Write-Output "  git add docs/ README.md AGENTS.md CONTRIBUTING.md SECURITY.md .github/"
Write-Output "  git commit -m 'docs: update platform architecture baseline'"
Write-Output "  git push -u $Remote $Branch"
Write-Output "Create a PR; do not merge without review."
