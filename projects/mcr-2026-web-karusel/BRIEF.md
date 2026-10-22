# MČR 2026 — webový karusel partnerů (brief)

Zadání operátora (22. 10.): „сделай мне карусель в формате веб-пейдж с эффектом листания красивым 9:16 для сайта, повешу как баннер;
можешь сделать прям как в видео — кусок видео в веб-пейдж; главное чтобы прошло через загрузку“.

## Rozhodnutí
- Jeden samostatný HTML soubor (vše inline, bez CDN a externích fontů, média base64) → projde nahráním do CMS, funguje přímo i v `<iframe>`.
- Poměr 9:16 v libovolném kontejneru; mobil i desktop; bez horizontálního scrollu.
- Snímky: úvod „Partneři · Mistrovství ČR v Trout Area 2026 · 24.–25. 10. 2026 · Líheň Liběchov“ + partneři v pořadí:
  FT Fishing · Líheň Liběchov (místo konání) · Gausse Holler Custom Lab (Hlavní cena · Revolut 8) · Activefishing.cz · Bosset.cz ·
  Jigovky.cz · Troutshop.eu · Velká ryba · Český rybářský svaz (poděkování).
- **Moonky z webového karuselu vyřazen** (operátor 22. 10.) — ve všech výstupech (HTML, MP4, GIF).
- Každý partner = 4,4 s němá smyčka vyříznutá z jeho Reels v8 (hero moment, bez VO); ČRS = statický banner (vlastní logo TA a spodní chip
  zamalovány, aby se nezdvojovaly s překryvem karuselu) s pomalým Ken Burns.
- Překryv: chip role, jméno, tlačítko „URL ↗“ (target=_blank rel=noopener). Logo TA (bílé TROUT + červené AREA) trvale vlevo nahoře —
  přesně na pozici a ve velikosti loga z Reels (left 6,806 %, top 13,385 %, šířka 26,02 %), takže s logem ve videu splývá. Na úvodu je logo velké.
- Přechod: 3D kostka (CSS 3D, stínování hran, odlesk), táhnutí prstem/myší sleduje prst; autoplay 4 s (přechod 0,75 s), pauza při hoveru/dotyku,
  šipky ←/→, tečky s průběhem; `prefers-reduced-motion` → prolínačka.
- Konkrétní ceny neuvádět (jen „Věnuje ceny“), u GH „Hlavní cena · Revolut 8“.
