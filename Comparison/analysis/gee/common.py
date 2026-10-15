"""Shared definitions for the map comparison: assets, unit conversions and pairs.

Rules this file encodes (agreed with the maintainer, 15 Oct 2026):
  * Only products with the same quantity and the same depth/pool are paired.
  * Each pair is compared on the COARSER of its two native grids; the finer
    product is mean-aggregated up to it. Nothing is upsampled.
  * Units are converted only with documented provider factors, to one common
    unit per quantity. No other rescaling.
  * No map is treated as truth: differences are always A - B.
"""

import ee

ee.Initialize(project="northstarlabs")
# Fail (and retry) any single request that hangs instead of waiting forever.
ee.data.setDeadline(180_000)

OURS = "projects/northstarlabs/assets/carbon_state_of_data/soils/maps"
GENG = "projects/northstarlabs/assets/canada_carbon_collection"
INTERVALS = [(0, 5), (5, 15), (15, 30), (30, 60), (60, 100)]


def geng(prop, top, bot):
    return ee.Image(f"{GENG}/{prop}_{top}_{bot}_cm").select(0)


def soilgrids(prop, top, bot):
    return ee.Image(f"{OURS}/soilgrids_v2/{prop}_mean").select(f"{prop}_{top}-{bot}cm_mean")


# ---------------------------------------------------------------- products
# Each entry: image (native grid), multiplier to the common unit, label.
def products():
    p = {}
    for t, b in INTERVALS:
        # SOC concentration -> g/kg. Geng provider unit %, SoilGrids dg/kg.
        p[f"geng_soc_{t}_{b}"] = (geng("SOC", t, b), 10.0, f"Geng SOC {t}–{b} cm")
        p[f"sg_soc_{t}_{b}"] = (soilgrids("soc", t, b), 0.1, f"SoilGrids SOC {t}–{b} cm")
        # Bulk density -> g/cm3. Geng provider g/cm3, SoilGrids cg/cm3.
        p[f"geng_bd_{t}_{b}"] = (geng("BD", t, b), 1.0, f"Geng BD {t}–{b} cm")
        p[f"sg_bd_{t}_{b}"] = (soilgrids("bdod", t, b), 0.01, f"SoilGrids BD {t}–{b} cm")
    # SOC stock -> kg C/m2.
    p["sg_ocs_0_30"] = (soilgrids("ocs", 0, 30), 0.1, "SoilGrids OC stock 0–30 cm")
    p["ncscd_0_30"] = (ee.Image(f"{OURS}/ncscdv2/NCSCDv2_Canada_WGS84_SOCC30_0012deg").select(0), 0.1,
                       "NCSCDv2 SOC 0–30 cm")
    p["ncscd_0_100"] = (ee.Image(f"{OURS}/ncscdv2/NCSCDv2_Canada_WGS84_SOCC100_0012deg").select(0), 0.1,
                        "NCSCDv2 SOC 0–100 cm")
    # Sothe: study unit kg C/m2; stored encoding unverified, depth 0-1 m is a working assumption.
    p["sothe_0_100"] = (ee.Image(f"{OURS}/sothe_2022/sc_250m_v20").select(0), 1.0,
                        "Sothe SOC stock (0–1 m assumed)")
    # Peat column (variable modelled depth in both).
    p["li_depth"] = (ee.Image(f"{OURS}/li_2025_hbl/McMaster_PeatDepth_30m").select(0), 1.0, "Li peat depth")
    p["pg_depth"] = (ee.Image("projects/sat-io/open-datasets/PEATGRIDS/THICKNESS_CM").select("THICKNESS_CM_MEAN"),
                     1.0, "PEATGRIDS peat thickness")
    p["li_carbon"] = (ee.Image(f"{OURS}/li_2025_hbl/McMasterCarbon30mkgm2version1").select(0), 1.0,
                      "Li peat carbon")
    p["pg_carbon"] = (ee.Image("projects/sat-io/open-datasets/PEATGRIDS/C_STOCK_MGC_PER_M2")
                      .select("C_STOCK_MgC_per_m2_MEAN"), 1000.0, "PEATGRIDS peat carbon")
    # Aboveground biomass 2020 -> Mg/ha (t/ha = Mg/ha).
    p["scanfi_agb"] = (ee.Image("projects/gcpm041u-lemur/assets/scanfi_v12/SCANFI_v1_2").select("biomass"), 1.0,
                       "SCANFI v1.2 AGB 2020")
    p["esa_agb"] = (ee.Image("projects/sat-io/open-datasets/ESA/ESA_CCI_AGB/CCI_BIOMASS_100m_AGB_2020_V6")
                    .select("AGB"), 1.0, "ESA CCI v6 AGB 2020")
    return p


# ---------------------------------------------------------------- pairs
# id, A key(s), B key(s), quantity, unit, region, coarser side ("a" or "b"), note
def pairs():
    out = []
    for t, b in INTERVALS:
        out.append(dict(id=f"soc_{t}_{b}", a=f"geng_soc_{t}_{b}", b=f"sg_soc_{t}_{b}", family="soc",
                        quantity=f"SOC concentration {t}–{b} cm", unit="g/kg", region="canada", grid="b",
                        domain="soil", note="Geng % ×10; SoilGrids dg/kg ÷10"))
        out.append(dict(id=f"bd_{t}_{b}", a=f"geng_bd_{t}_{b}", b=f"sg_bd_{t}_{b}", family="bd",
                        quantity=f"Bulk density {t}–{b} cm", unit="g/cm³", region="canada", grid="b",
                        domain="soil", note="SoilGrids cg/cm³ ÷100"))
    out += [
        dict(id="ocs_0_30", a="sg_ocs_0_30", b="ncscd_0_30", family="stock30", quantity="SOC stock 0–30 cm",
             unit="kg C/m²", region="canada", grid="b", domain="soil",
             note="SoilGrids t/ha ÷10; NCSCDv2 hg C/m² ÷10"),
        dict(id="ocs_0_100", a="sothe_0_100", b="ncscd_0_100", family="stock100",
             quantity="SOC stock 0–100 cm (provisional)", unit="kg C/m²", region="canada", grid="b",
             domain="soil", note="Sothe depth assumed 0–1 m and stored units unverified; NCSCDv2 hg C/m² ÷10"),
        dict(id="peat_depth", a="li_depth", b="pg_depth", family="peat", quantity="Peat thickness",
             unit="cm", region="hbl", grid="b", domain="soil", note="Both are modelled full peat columns"),
        dict(id="peat_carbon", a="li_carbon", b="pg_carbon", family="peat", quantity="Peat carbon (full column)",
             unit="kg C/m²", region="hbl", grid="b", domain="soil", note="PEATGRIDS Mg C/m² ×1000"),
        dict(id="agb_2020", a="scanfi_agb", b="esa_agb", family="agb", quantity="Aboveground biomass 2020",
             unit="Mg/ha", region="canada", grid="b", domain="forest",
             note="Both aboveground biomass for 2020; compared where at least one product is above zero"),
    ]
    return out


def converted(key):
    img, mult, _ = products()[key]
    return img.multiply(mult), img.projection()


def pair_image(pair, max_pixels=4096):
    """Bands a, b on the pair's coarser native grid (finer side mean-aggregated)."""
    a, pa = converted(pair["a"])
    b, pb = converted(pair["b"])
    target = pb if pair["grid"] == "b" else pa
    if pair["grid"] == "b":
        a = a.reduceResolution(ee.Reducer.mean(), maxPixels=max_pixels).reproject(target)
    else:
        b = b.reduceResolution(ee.Reducer.mean(), maxPixels=max_pixels).reproject(target)
    return ee.Image.cat([a.rename("a"), b.rename("b")]), target
