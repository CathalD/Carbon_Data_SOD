# Verified sharing and public access

Checked 15 October 2026. [Machine-readable audit](../data/catalogue/public_access_verified_20261015.json).

| Resource | Verified result | Meaning |
|---|---|---|
| GitHub repository | Public; unsigned metadata, raw README and downloads return HTTP 200 | No GitHub account needed for catalogue downloads |
| 41 hosted Earth Engine references | 41/41 public-read grants; metadata reads succeed | `all_users_can_read=true` at asset or parent ImageCollection scope |
| Geng collection | Public; ten images present | Sharing was enabled by the maintainer during this check; member ACL calls are unsupported, so the collection ACL is the correct scope |
| SCANFI v2 collection | Public, **0 images** | Sharing is correct; hosted biomass is not ready |
| Working Google Sheet | Restricted; unsigned CSV export returns HTTP 401 | Public users should use DOWNLOADS.md; original sharing preserved |
| Maintainer-uploaded workbook | Anonymous download succeeds; older 10-tab snapshot | Kept as supplied, not overwritten by this release |

The Earth Engine audit used the existing authorized account to inspect ACLs and metadata. It verifies public-read grants, not an anonymous pixel computation or data-licence compliance. Earth Engine’s API still requires authentication and an enabled quota project. Principal identities were omitted from the published report. The assistant made no persistent permission changes; the maintainer completed Geng’s sharing change and it was read back successfully.

Only the 41 project-hosted references are covered by this ACL audit. Provider-owned references and discovery resources keep separate status. The working examples also successfully read the external ESA CCI collection; that does not certify every external link or release.

Circumpolar thermokarst work remains deferred. NCSCDv2 remains reference-only for extraction. Existing source-copy pixel checks are sampled checks, not full-raster or source-unit validation. Detailed pilot locations/rows remain outside this new public package pending separate publication approval.
