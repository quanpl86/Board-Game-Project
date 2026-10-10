# GitHub publishing / maintenance
The repository is already initialized; future changes must use feature branches and PRs.

## Local workflow
1. Clone https://github.com/quanpl86/Board-Game-Project.git
2. Create a branch: git switch -c docs/my-change
3. Edit documents or application code, run: python scripts/validate_docs.py
4. Commit and push your branch; open a Pull Request with evidence.
5. Do not force-push protected main, and never commit credentials or student data.

## AI Agent workflow
Agents must use scoped GitHub/MCP tools, open a PR, run checks and seek review. No default autonomous production deploy/merge; release approvals are separate from draft content generation.

## Local initial import (if needed)
This repository's historical baseline can be compared with the archive provided in the project context; use manual diffs and PRs for any remaining material. Treat current canonical documents as source of truth.
