# Contributing

To suggest an addition or correction, include the dataset name, original source link or DOI, release/version and a short explanation. Where known, provide the quantity and units, coverage, dates, spatial support, depth datum or carbon pool, source terms and exact asset/band.

Preserve catalogue IDs and original observations. Record unresolved definitions rather than guessing a conversion. Keep maps, observations and covariates distinct; map agreement alone is not accuracy. Avoid adding credentials or signed download links to the repository.

Edit the catalogue CSVs under `data/downloads/` and regenerate their JSON with `scripts/build_catalogue_json.py`. Keep the historical analysis snapshot unchanged unless replacing it with an explicitly versioned update. Follow the company's normal review process.

[Sources](SOURCES.md) · [Downloads](docs/downloads.md) · [Analysis](analysis/README.md)
