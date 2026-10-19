# Drone flyover data notes
- orto_scout.jpg: ČÚZK ORTOFOTO export, bbox=14.4515,50.4066,14.4685,50.4174 (bboxSR=4326), imageSR=5514 (S-JTSK Krovak — rotated vs true north!), 1600x1600.
- Venue (est. from scout): Velký Sporťák (big pond) center ≈ 50.4150 N, 14.4609 E; Malý Sporťáček (small trout pond, MČR venue) ≈ 50.4138 N, 14.4592 E (SW of big pond, next to "Fisheries Libechov" shop & hatchery buildings). Road I/9 runs SSW along the big pond's east side.
- user_map_arrow.jpg: user's Google Maps screenshot — red circle = Malý Sporťáček; red arrow = drone flight direction: from NORTH (village road north-west of the big pond) heading SSW along the big pond's west shore, ending over the small pond. Scale bar: 100 m ≈ 185 px.
- user_map_clean.png: same view without annotations.
- Services: ORTOFOTO MapServer https://ags.cuzk.cz/arcgis1/rest/services/ORTOFOTO/MapServer (export, max 4096 px, LOD to 0.125 m/px); DMP 1G (surface incl. trees/buildings, 2 m px) https://ags.cuzk.cz/arcgis2/rest/services/dmp1g/ImageServer (exportImage, F32); DMR 5G terrain likely https://ags.cuzk.cz/arcgis2/rest/services/dmr5g/ImageServer.

## Acquired data (2026-10-19) - see manifest.json for full details
- All rasters in EPSG:32633 (UTM 33N, north-up), heights in m Bpv. Core bbox 461150,5584450,461950,5585250 (800 m); context 460050,5583350,463050,5586350 (3 km).
- CORRECTION: the estimates above came from the Krovak-rotated scout. Measured from the 0.125 m ortho water mask:
  - Malý Sporťáček (hero) centroid 50.412996 N, 14.457456 E = UTM 461451.7 E / 5584691.8 N, ~1850 m2, ~58 x 42 m, water level ~167.2 m.
  - Velký Sporťák centroid 50.414473 N, 14.459255 E = UTM 461580.7 E / 5584855.1 N, ~1.96 ha, ~248 x 109 m, water ~169.9 m.
- DMP 1G is unreliable over water (interpolated; up to +6 m over the big pond) -> use dsm_core_1m_render.tif (ponds flattened).
- Proposed flight: flight_path.json (arrow_full = user's arrow, 95->55 m AGL, ~247 m in 4 s; compact_realistic = ~141 m). Preview: flight_path_preview.jpg. QA: check_overlay.jpg.
- pyproj: for 5514<->32633 use "S-JTSK to WGS 84 (1)"; PROJ's default op is ~10 m off here.
