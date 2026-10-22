# MČR 2026 · bannery + texty FB/IG · finální review (22. 10. 2026)

Rozsah: 10 klíčů × (4 statiky + 4 karusel PNG + 2 MP4 + _qa.json) + `texty/FB_IG_texty.md`.
Metoda: každé PNG otevřeno v plné velikosti; MP4 přes ffprobe + snímky 0/45/105/165/225/285/298/299,
PSNR prvního vs posledního snímku (šev smyčky), rotace prstence GH změřena polárním korelačním posunem.
Zdroje nebyly upraveny.

**Souhrn: 2 BLOCKER · 8 MAJOR · 17 MINOR.**

## Co je v pořádku (napříč sadou)
- Logo TA CZ (bílé TROUT + červené AREA, průhledné, měkký stín) je na všech 80 PNG i ve všech MP4 vlevo nahoře, ve stejné pozici a velikosti. Nikde ho nic nepřekrývá a logo sponzora nikde není větší.
- Řádek akce „MČR v Trout Area 2026 · 24.–25. 10. 2026 · Líheň Liběchov“ a URL vpravo nahoře jsou na všech formátech totožné.
- Chipy odpovídají rolím: „Věnuje ceny · MČR 2026“ u 7 sponzorů, „Hlavní cena pro vítěze MČR · Revolut 8“ u GH, „Místo konání MČR 2026“ u venue (bez cenového chipu), „Děkujeme za dlouholetou podporu“ u ČRS (bez cenového chipu).
- U 9:16 jsou safe zóny dodržené: chrome začíná na y ≈ 250 a řádek akce končí na y ≈ 1540 (1920 − 380).
- MP4: 20/20 je H.264 yuv420p, 300 snímků / 10 s, bez audio stopy. Rozměry 1080×1080 a 1080×1350.
- GH: před URL je jen ikona ozubeného kola. Vnější prstenec se točí **po směru hodin**: +6° za 5 snímků, tj. 360° za 10 s, takže smyčka je čistá (šev 44–46 dB).
- Fakta na bannerech sedí s `research/*.md`: 770+ woblerů, 0,4–3 g, 145 g · 5,1 : 1, 46 mm · 2,12 g, 1934 / Stutzig, 164 m n. m. „donedávna“, 50 × 40 m · 0,2 ha · 1,5 m, „Areál vlastní ČRS, MO Mělník“, termosky bez objemu, žádné konkrétní ceny.
- Texty: 311 NBSP, žádná jednopísmenná předložka s běžnou mezerou. Datum „24.–25. 10. 2026“ je jednotné. Meta primary text je všude ≤ 111/125 znaků.

---

## BLOCKER

### B1 · Texty §7 Troutshop: v sekci zůstal rozbitý zbytek staré verze
`texty/FB_IG_texty.md`, ř. ~452–466: za novým Karuselem Troutshopu následuje osiřelý řádek `---|---|`, **druhá (stará) Meta tabulka** („Specialista na pstruhy od roku 1999…“, headline „Troutshop.eu – specialista na pstruhy“) a **druhý Karusel (4 karty)**. Kdo bude texty kopírovat do Ads Manageru, vezme omylem starou verzi. Markdown se navíc rozbije, protože tabulka nemá hlavičku.
**Oprava:** smazat vše od `---|---|` až po druhý blok „### Karusel (4 karty)“ včetně (končí „4. Věnuje ceny · MČR 2026“ před `---` a `## 8. Velká ryba`).

### B2 · Troutshop karusel 1 slibuje dodací lhůtu, kterou sponzor ve svém textu neuvádí
`renders/troutshop/troutshop_carousel_1.png`: odrážka „**Do Česka za pár dní**“. Rozhodnutí z 22. 10. zní, že Troutshop prezentujeme podle textu, který sám poslal: „zboží posílají i do ČR“. Texty proto „do pár dní“ vědomě vypustily (K ověření #10). Banner by tak sponzorovým jménem sliboval dodací lhůtu.
**Oprava:** odrážku nahradit „Zboží posílají i do Česka“ a přerenderovat `node scripts/build.mjs troutshop`.

---

## MAJOR

### M1 · Gausse Holler: v serifovém písmu se rozpadají háčky (č, ě)
`gausseholler_static_4x5.png`, `_9x16.png`, `_191.png`, `_1x1.png`, `gausseholler_carousel_1.png`, `_carousel_4.png` („Revolut 8 pro vítěze mistrovství“) a obě MP4. Ve třídě `.gh-s` (Cormorant Garamond 600) se malé **č / ě** skládají z písmene a samostatného háčku. Háček pak visí vysoko nad písmenem jako „ˇ“ ve výšce verzálek („Rucˇneˇ staveˇno“). Velké Č je v pořádku. Na hlavním sponzorovi a na ceně je to první věc, které si český čtenář všimne.
**Oprava:** do registru enginu načíst Cormorant Garamond s latin-ext (předkomponované č/ě, `unicode-range` U+0100-017F), případně text normalizovat na NFC. Ověřit zoomem na „Ručně stavěno v Česku“ a přerenderovat GH.

### M2 · GH 4:5 a 9:16: rukojeť stojanu zakrývá „EDITION“
`gausseholler_static_4x5.png` (y ≈ 380–440), `gausseholler_static_9x16.png` (y ≈ 610–690): oranžové logo na rukojeti leží přes poslední písmena „BLACK STANDARD EDITI**ON**“. Produkt je tu nad textem, což porušuje pravidlo „text vždy nad produktem“.
**Oprava:** stojan na podiu posunout o ~60 px níž nebo text přesunout nad produkt (z-index). Nejjednodušší je dát podtitulek nad „REVOLUT 8“.

### M3 · Venue MP4: šev smyčky skáče
`venue_anim_1x1.mp4` (PSNR 1. vs 300. snímek **20,8 dB**) a `venue_anim_4x5.mp4` (**21,3 dB**). U ostatních klíčů je to 35–46 dB. Rozdíl je soustředěný do plochy rybníka a okolí letecké scény (shimmer / kaustika vody nebo pomalý zoom se do 10 s nevrátí do výchozího stavu). Při autoplay smyčce na FB/IG je to viditelný cuknutí.
**Oprava:** fázi kaustiky a zoomu navázat na `t/10 s × 2π` (periodicky) nebo poslední 0,3 s zprolínat do posteru. Ověřit PSNR ≥ 35 dB.

### M4 · ČRS 4:5 MP4: šev smyčky skáče
`crs_anim_4x5.mp4` (**22,3 dB**; 1:1 má 43 dB, je OK). Rozdíl je v dolní polovině, ve fotce stolu s poháry (Ken Burns / posun fotky se nevrací).
**Oprava:** stejně jako M3, tedy periodický pohyb fotky, aby poslední snímek byl roven posteru.

### M5 · Venue statiky: schéma míst bez poznámky „orientační“ a nečitelná čísla
`venue_static_1x1.png`, `_4x5.png`, `_9x16.png` a scéna v MP4: letecký snímek nese špendlíky 1–40, ale chybí „Schéma · čísla míst orientační“. Poznámka je jen na `venue_carousel_3.png` a `crs_carousel_3.png`. Podle rozhodnutí 22. 10. musí být všude, kde jsou čísla míst. Čísla jsou navíc ~10 px, takže na telefonu jsou to jen červené tečky.
**Oprava:** buď na leteckém snímku čísla vypustit (nechat jen obrys + „Malý Sporťáček“), nebo přidat stejný popisek jako na karuselu 3. Doporučuji vypustit, protože čitelná schémata jsou na karuselech.

### M6 · Troutshop: obraz neodpovídá vlastnímu textu sponzora
Všechny statiky `troutshop_static_*.png` mají headline „**Specialista na pstruhy**“. Na žádném banneru nejsou bratři Jaro a Stano Petríčkovi („závodníci a nadšenci Trout Area“), na kterých stojí nové texty i Meta headline „Troutshop.eu – od závodníků Trout Area“. Reklama by tak měla obraz se starým sdělením a text s novým.
**Oprava:** na statikách vyměnit kicker / podtitul za „Od závodníků Trout Area · Jaro a Stano Petríčkovi“ (headline může zůstat). Do `troutshop_carousel_1.png` přidat odrážku „Za obchodem stojí bratři Petríčkovi“ (viz i B2).

### M7 · Velká ryba 9:16: naviják přes text
`velkaryba_static_9x16.png`: oblouk a rameno navijáku Vanquish vedou přes „Speciálka z Olo**mouce**“ (y ≈ 760–810) a vrch navijáku zasahuje do červeného pásu „PŘÍVLAČ“. Produkt je nad textem.
**Oprava:** naviják zmenšit o ~10 % a posunout o ~120 px níž (pod y 880), případně textový blok nad produkt (z-index).

### M8 · Troutshop 4:5 a 9:16: háčky plandavek přes řádek s čísly
`troutshop_static_4x5.png` (y ≈ 560–600) a `troutshop_static_9x16.png` (y ≈ 780–820): háčky vějíře protínají řádek „3 100+ plandavek · 990+ woblerů v nabídce“ (zasažené „woblerů“, „nabídce“).
**Oprava:** vějíř posunout o ~60 px níž nebo text dát nad produkt (z-index) s jemným tmavým podkladem.

---

## MINOR

### Venue (Líheň Liběchov)
1. `venue_carousel_2.png` a statiky: podklad je ortofoto ČÚZK. Licence vyžaduje uvedení zdroje, proto přidat drobné „Ortofoto © ČÚZK“ (jako „FOTO: MČR 2025“ u ČRS).
2. `venue_carousel_4.png` je téměř čistě textová karta. Organicky v pořádku, v placené reklamě ji Meta může znevýhodnit.

### Gausse Holler
3. `gausseholler_carousel_4.png`: chip „HLAVNÍ CENA PRO VÍTĚZE MČR · REVOLUT 8“ opakuje headline „HLAVNÍ CENA“ i podtitul. Jde o záměr enginu, ale karta je redundantní. Lze nechat.

### FT Fishing
4. `ftfishing_static_191.png` má kicker „FT FISHING · OD ROKU 2016“, ostatní formáty „E-SHOP OD ROKU 2016“. Sjednotit na „E-shop od roku 2016“.
5. Logo Crazy Fish v pásu značek (všechny formáty) je malé a rozmazané, na telefonu nečitelné. Použít ostřejší zdroj nebo ho zvětšit o ~20 %.
6. `ftfishing_static_4x5.png` / `_9x16.png`: mezi pásem značek a logem FT zůstává prázdná plocha ~250 px. Logo FT posunout výš nebo zvětšit pás značek.
7. `ftfishing_carousel_1.png`: „Polský Spinmad přivezl do Čech majitel František Čáha“ je osobní jméno na reklamě a parafráze článku z roku 2018. Doporučuji potvrdit s FT Fishing (nebo napsat „Spinmad do Čech přivezl majitel FT Fishing“).

### Activefishing
8. Bannery mají „PŘES 1 300 PLANDAVEK“ / „1 300+“, texty „přes 1 350“. Obojí je pravda, ale pro konzistenci sjednotit (doporučuji v textech „přes 1 300“, protože živé číslo kolísá).

### Bosset
9. `bosset_carousel_3.png`: chip „DOUBLE LOCK · JEDNOU RUKOU“ stojí nad řadou šesti termosek. Podle researche platí jen pro SM-SR / SM-VB. Ověřit, že v řadě není SM-SHE / SM-SF, nebo chip posunout těsně k černé SM-VB.

### Jigovky
10. `jigovky_carousel_1.png`: makro hlavička je upscalovaná a měkká a dřík je useknutý gradientem. Na telefonu je to přijatelné, při zvětšení vypadá levněji. Případně zmenšit o 15 %.

### Moonky
11. `moonky_static_191.png`: „Pro Trout Area ·vyvíjené“ nemá mezeru za středovou tečkou, slovo „reprezentací“ zůstalo osamocené na druhém řádku a pod „z“ sedí hvězdička z pozadí, která vypadá jako diakritika. Zkrátit na „Vyvíjené s českou reprezentací“ v jednom řádku.
12. Texty §6 FB: „s aromaty banana, cheese i oliheň“ míchá angličtinu a češtinu. Navrhuji „s příchutěmi Banana, Cheese a Oliheň“ (názvy příchutí podle e-shopu), případně „banán, sýr a oliheň“.

### Velká ryba
13. `velkaryba_carousel_2.png`: dlaždice 3Stan je malý tmavý čtverec bez čitelného textu. Použít světlou variantu loga nebo ji nahradit textem „3STAN“.
14. Na statikách je plandavka Shimano s vyraženým „CE4.5g“, zatímco research uvádí v listingu 2,5 g. Bez popisku gramáže je to v pořádku, jen hmotnost nikde nepsat.

### ČRS
15. `crs_static_1x1.png`, `crs_carousel_4.png`: „Děkujeme / za dlouholetou podporu“ je na jedné kartě 2× (headline + chip). Chip je pravidlo, takže headline lze zkrátit (např. „DĚKUJEME“ + logo + „rybsvaz.cz“). Karty jsou téměř čistě textové, takže publikovat jen organicky (jak už texty doporučují).

### Texty (`texty/FB_IG_texty.md`)
16. Typografie: v §7 Troutshop chybí v řádku akce NBSP (ř. 408: „24.–25. 10. 2026“ s obyčejnými mezerami). Doporučené NBSP chybí i v „MČR 2026“, „Revolut 8“, „Snap 8“, „Praha 9“, „H 360“.
17. Konzistence názvů: v 0a/0b se Velká ryba jmenuje „Velka-ryba.cz“, v nadpisech a jinde „Velká ryba“. Sjednotit na „Velká ryba (velka-ryba.cz)“ nebo všude „Velká ryba“. Meta headliny Activefishing (38), Troutshop (38), Jigovky (33) a Líheň (33 znaků) přesahují doporučených ~27–30 znaků, takže je mobil může zkrátit. Klíčové slovo dát na začátek (už tam je), případně je zkrátit.

---

## Pořadí oprav (na 1 průchod renderem)
1. Texty: B1 (smazat starou Troutshop tabulku), M6 copy, MINOR 12, 16, 17. Jde jen o text, bez renderu.
2. Troutshop: B2 + M6 + M8, pak `node scripts/build.mjs troutshop`.
3. GH: M1 font + M2 rozložení, pak `build gausseholler`.
4. Venue: M3 šev + M5 čísla míst + MINOR 1, pak `build venue`. ČRS: M4, pak `build crs`.
5. Velká ryba M7. Zbytek MINOR podle času.
6. Po renderu znovu změřit šev: `ffmpeg -i X.mp4 -vf "select='eq(n\,0)+eq(n\,299)'"` + PSNR ≥ 35 dB.
