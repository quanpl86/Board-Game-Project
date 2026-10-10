#!/usr/bin/env python3
"""Basic tracked-source secret hygiene check, not a replacement for GitHub secret scanning."""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
tracked = subprocess.check_output(["git", "ls-files"], cwd=ROOT, text=True).splitlines()
TARGETS = ("apps/", "packages/", "games/", "tools/", "infra/", ".github/", "scripts/")
SKIP = {"scripts/check_secrets.py"}
PATTERNS = {
    "Private key": re.compile(r"-----BEGIN (?:RSA|EC|OPENSSH|DSA|PGP )?PRIVATE KEY-----"),
    "GitHub token": re.compile(r"gh[pousr]_[A-Za-z0-9_]{30,}"),
    "OpenAI API key": re.compile(r"sk-(?:proj-)?[A-Za-z0-9_-]{30,}"),
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
}
fails = []
for name in tracked:
    if name in SKIP or not name.startswith(TARGETS):
        continue
    file = ROOT / name
    if not file.is_file() or file.stat().st_size > 2_000_000:
        continue
    try:
        contents = file.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    for label, pattern in PATTERNS.items():
        if pattern.search(contents):
            fails.append(f"{name}: possible {label}")
if fails:
    print("\n".join(fails))
    sys.exit(1)
print(f"Basic tracked-source secret hygiene passed ({len(tracked)} tracked files inspected).")
