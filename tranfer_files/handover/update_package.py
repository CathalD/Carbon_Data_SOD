"""Refresh the copy-ready ZIP and transfer manifest after editing this folder.

Run: python handover/update_package.py
This changes local package files only; it never commits or uploads to GitHub.
"""

from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
HANDOVER = ROOT / 'handover'
EXCLUDED_PARTS = {'handover', '.git', '.venv', '__pycache__', '.quarto', '_site'}


def eligible(path):
    parts = path.relative_to(ROOT).parts
    return (path.is_file() and not EXCLUDED_PARTS.intersection(parts)
            and path.name not in {'START_HERE.md', '.DS_Store'}
            and path.suffix != '.pyc')


def main():
    files = sorted(p for p in ROOT.rglob('*') if eligible(p))
    archive = HANDOVER / 'company-repository.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in files:
            z.write(p, p.relative_to(ROOT))
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(files)

    manifest = HANDOVER / 'transfer_manifest.json'
    hashes = {
        str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest()
        for p in sorted(ROOT.rglob('*'))
        if p.is_file() and p != manifest and '.DS_Store' != p.name
        and '__pycache__' not in p.parts and p.suffix != '.pyc'
    }
    source = json.loads((ROOT / 'analysis/source_snapshot/SNAPSHOT.json').read_text())
    manifest.write_text(json.dumps({
        'description': 'SHA-256 of all transfer files, excluding this manifest itself.',
        'source_snapshot': source['commit'],
        'company_zip_files': len(files),
        'files': hashes,
    }, indent=2) + '\n')
    print(f'Company ZIP: {len(files)} files; transfer folder: {len(hashes) + 1} files.')


if __name__ == '__main__':
    main()
