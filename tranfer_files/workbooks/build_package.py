"""Build the small standalone R workbook ZIP. Run from any working directory."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent / 'r'
names = ['README.md', '01_map_comparisons.R', '02_profile_comparisons.R',
         'helpers.R', 'CarbonComparisons.Rproj', '.gitignore', 'pairs.json',
         'products.csv', 'snapshot.json', 'input_checksums.json', 'VALIDATION.md']
archive = root / 'r-comparison-workbook.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as z:
    for name in names:
        z.write(root / name, name)
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert set(z.namelist()) == set(names)
print(f'{archive}: {len(names)} files, {archive.stat().st_size:,} bytes')
