"""Validate internal file references in this static GitHub Pages repository."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {".html", ".css", ".js", ".json"}
REFERENCE_PATTERNS = (
    re.compile(r'''(?:href|src)=["']([^"']+)["']'''),
    re.compile(r'''url\(["']?([^"')]+)'''),
)
IGNORED_PREFIXES = ("#", "mailto:", "tel:", "data:", "javascript:")


def text_files() -> list[Path]:
    """Return source files that may contain internal references."""
    return [path for path in ROOT.rglob("*") if path.suffix.lower() in TEXT_SUFFIXES]


def internal_target(source: Path, reference: str) -> Path | None:
    """Convert one local URL into a repository path, ignoring external URLs."""
    reference = reference.strip()
    if not reference or reference.startswith(IGNORED_PREFIXES):
        return None

    # Template-literal references are resolved at runtime from project data.
    if "${" in reference:
        return None

    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        return None

    path_text = unquote(parsed.path)
    if not path_text:
        return None

    if path_text.startswith("/"):
        target = ROOT / path_text.lstrip("/")
    else:
        target = source.parent / path_text

    if target.is_dir():
        target /= "index.html"

    return target.resolve()


def main() -> int:
    """Report missing local targets and return a shell-friendly status code."""
    missing: list[tuple[Path, str, Path]] = []

    for source in text_files():
        content = source.read_text(encoding="utf-8", errors="ignore")
        for pattern in REFERENCE_PATTERNS:
            for reference in pattern.findall(content):
                target = internal_target(source, reference)
                if target is not None and not target.exists():
                    missing.append((source, reference, target))

    if missing:
        print("Missing internal references:")
        for source, reference, target in missing:
            print(f"- {source.relative_to(ROOT)}: {reference} -> {target}")
        return 1

    print(f"Validated {len(text_files())} source files: no missing internal references.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
