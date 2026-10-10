#!/usr/bin/env python3
"""Check internal relative links in documentation, avoiding external URLs."""
import pathlib
import re
import sys
from urllib.parse import unquote

ROOT = pathlib.Path(__file__).resolve().parents[1]
MD_LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
errors = []
docs = list(ROOT.rglob("*.md"))
for doc in docs:
    if any(p in {"node_modules", ".git", ".next"} for p in doc.relative_to(ROOT).parts):
        continue
    text = doc.read_text(encoding="utf-8")
    for line_no, line in enumerate(text.splitlines(), 1):
        for raw in MD_LINK.findall(line):
            href = raw.strip().split(" ", 1)[0].strip("<>")
            if not href or href.startswith(("#", "mailto:", "http:", "https:", "data:", "tel:")):
                continue
            target = unquote(href.split("#", 1)[0].split("?", 1)[0])
            if not target:
                continue
            resolved = ((ROOT / target.lstrip("/")) if target.startswith("/") else (doc.parent / target)).resolve()
            if not resolved.is_relative_to(ROOT.resolve()) or not resolved.exists():
                errors.append(f"{doc.relative_to(ROOT)}:{line_no}: missing '{href}'")
for msg in errors:
    print(msg)
print(f"Scanned {len(docs)} Markdown documents; broken links: {len(errors)}")
sys.exit(1 if errors else 0)
