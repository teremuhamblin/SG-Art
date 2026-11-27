#!/usr/bin/env python3
"""Create a portable ZIP archive of the SG@Art project (Python standard library only)."""

from __future__ import annotations

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / "sg-art.zip"
EXCLUDED_DIRS = {".git", "__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache"}
EXCLUDED_FILES = {".DS_Store", "Thumbs.db"}


def main() -> None:
    files = sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and path != ARCHIVE
        and not any(part in EXCLUDED_DIRS for part in path.relative_to(ROOT).parts)
        and path.name not in EXCLUDED_FILES
    )

    with ZipFile(ARCHIVE, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            archive.write(path, Path("SG-Art") / path.relative_to(ROOT))

    print(f"Archive créée : {ARCHIVE} ({len(files)} fichiers)")


if __name__ == "__main__":
    main()
