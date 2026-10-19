"""ads/manifest.json for Bosset (sizes, pad [l,t,r,b], aspect, dominant colours, product facts verified 19 Oct 2026)."""
import json, numpy as np
from PIL import Image
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep'
S = 'https://www.bosset.cz'; C = 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/shop/orig/'
SR = {'claims_ok': ['až 6 hodin horké i studené (vakuová izolace)', 'nerezová ocel a ekologický plast bez BPA', 'DOUBLE LOCK – otevřeš jednou rukou',
                    'plastová tryska chrání rty před spálením', 'váží téměř stejně jako telefon'], 'volume': '0,6 l'}
SHE = {'claims_ok': ['až 6 hodin horké i studené (vakuová izolace)', 'nerezová ocel a ekologický plast bez BPA'],
       'claims_NOT_on_page': ['jednou rukou', 'jako telefon'], 'volume': '0,6 l'}
F = [
 ('H1_zojirushi_sm-vb_0-6l_black', 'hero', 'Termoska Zojirushi SM-VB 0,6l Black', 'SM-VB60BM', '1 485 Kč', '/termosky/termoska-zojirushi-sm-vb-0-6l-black/', '11298-1_termoska-zojirushi-sm-vb-0-6l-black.jpg', 'local darkness cut (paper-white 255) + rim decontamination', dict(SR, note='No. 1 of TERMOSKY sorted by "Nejprodávanější" (19 Oct)')),
 ('H2_zojirushi_sm-sr_0-6l_green', 'hero', 'Termoska Zojirushi SM-SR 0,6l Green', 'SM-SR60EGP', '1 200 Kč', '/termosky/termoska-zojirushi-sm-sr-0-6l-green/', '11283_termoska-zojirushi-sm-sr-0-6l-green.jpg', 'local darkness cut + rim decontamination', dict(SR, note='colour param "Zelená" (reads mint); call it "zelená", never "mint" on screen')),
 ('H2m_zojirushi_sm-sr_green_lid_open_macro', 'hero-macro', 'Termoska Zojirushi SM-SR 0,6l Green (gallery: lid open, DOUBLE LOCK)', 'SM-SR60EGP', '1 200 Kč', '/termosky/termoska-zojirushi-sm-sr-0-6l-green/', '11283-3_termoska-zojirushi-sm-sr-0-6l-green.jpg', 'ISNet trimap + white unmixing (cutout3); body is CROPPED at the bottom edge -> always let it bleed off the frame', SR),
 ('H3_keitech_easy_shiner_4in_ice_chartreuse_pal03t', 'hero', "Gumová Nástraha Keitech Easy Shiner 4'' 10cm Ice Chartreuse PAL03T (7ks)", 'PAL03T', '189 Kč', "/gumove-nastrahy-keitech-easy-shiner--4-10cm/gumova-nastraha-keitech-easy-shiner--4-10cm-ice-chartreuse-pal03t--7ks/", '2035-1_gumova-nastraha-keitech-easy-shiner.jpg', 'Higgsfield upscale 4k (bytedance, 2 cr) + smoothed ISNet∪darkness contour, rim colours from 6 px inside (upscaler leaves white dust on the rim); 2400 px', {'params': {'délka': '10 cm', 'hmotnost': '3–5 g', 'tvar': 'shadový ocásek', 'UV': 'UV gumové nástrahy'}, 'note': 'No. 1 of the WHOLE shop (/znacky/?order=bestseller): the 12 best-selling items are all Keitech Easy Shiner', 'quote': '„zřejmě tou nejznámější nástrahou z dílny Japonské značky Keitech“ (product page)'}),
 ('S1_zojirushi_sm-she_0-6l_orange', 'secondary', 'Termoska Zojirushi SM-SHE 0,6l Orange', 'SM-SHE60DV', '1 347 Kč', '/termosky/termoska-zojirushi-sm-she-0-6l-orange/', '11235_termoska-zojirushi-sm-she-0-6l-orange.jpg', 'local darkness cut (source 1200 px)', SHE),
 ('S1m_zojirushi_sm-she_orange_lid_open_macro', 'secondary-macro', 'Termoska Zojirushi SM-SHE 0,6l Orange (gallery: lid open)', 'SM-SHE60DV', '1 347 Kč', '/termosky/termoska-zojirushi-sm-she-0-6l-orange/', '11235-5_termoska-zojirushi-sm-she-0-6l-orange.jpg', 'cutout3; cropped at left + bottom -> bleed', SHE),
 ('S2_zojirushi_sm-sr_0-6l_pink', 'secondary', 'Termoska Zojirushi SM-SR 0,6l Pink', 'SM-SR60EVP', '1 200 Kč', '/termosky/termoska-zojirushi-sm-sr-0-6l-pink/', '11280_termoska-zojirushi-sm-sr-0-6l-pink.jpg', 'local darkness cut', SR),
 ('S2m_zojirushi_sm-sr_pink_lid_open_macro', 'secondary-macro', 'Termoska Zojirushi SM-SR 0,6l Pink (gallery: lid open)', 'SM-SR60EVP', '1 200 Kč', '/termosky/termoska-zojirushi-sm-sr-0-6l-pink/', '11280-3_termoska-zojirushi-sm-sr-0-6l-pink.jpg', 'cutout3; cropped at the bottom -> bleed', SR),
 ('S3_zojirushi_sm-sr_0-6l_white', 'secondary', 'Termoska Zojirushi SM-SR 0,6l White', 'SM-SR60EWA', '1 200 Kč', '/termosky/termoska-zojirushi-sm-sr-0-6l-white/', 'p03 (assets/bosset)', 'local darkness cut (thr 6, white on white) – use on dark / teal, not on the light-blue set', SR),
 ('S4_zojirushi_sm-vb_0-6l_green', 'secondary', 'Termoska Zojirushi SM-VB 0,6l Green', 'SM-VB60GM', '1 485 Kč', '/termosky/termoska-zojirushi-sm-vb-0-6l-green/', '11262-1_termoska-zojirushi-sm-vb-0-6l-green.jpg', 'local darkness cut', SR),
 ('S5_zojirushi_sm-vb_0-6l_beige', 'secondary', 'Termoska Zojirushi SM-VB 0,6l Beige', 'SM-VB60CM', '1 485 Kč', '/termosky/termoska-zojirushi-sm-vb-0-6l-beige/', 'p06 (assets/bosset)', 'local darkness cut', SR),
 ('S6_ygk_x-braid_upgrade_x8_150m', 'secondary', 'Pletená šňůra YGK X-Braid Upgrade X8 150m (line image)', '—', '759 Kč (#PE1,0)', '/pletene-snury-x-braid-ygk/', '46146_pletena-snura-ygk-x-braid-upgrade-x8.jpg', 'cutout3 (spool + box); 1200 px source, keep ≤ 1169 px', {'note': 'shop image shows the #1.5 / 30 lb box while the listing item is #PE1,0 10 kg -> never caption a strength; caption "YGK X-Braid Upgrade X8" only'}),
]
out = {'sponsor': 'bosset', 'generated': '2026-10-19', 'note': 'Bosset.cz is a retailer/distributor (official distributor of Keitech and YGK X-Braid for CZ). Zojirushi, Keitech, YGK are third-party brands: never imply Bosset makes them; say nothing about Zojirushi origin. Prices change - not for on-screen use.', 'files': []}
for name, role, prod, code, price, url, src, method, facts in F:
    im = Image.open(f'{P}/bosset/ads/{name}.png'); a = np.asarray(im)[..., 3]; Wd, Hd = im.size
    ys, xs = np.where(a > 128)
    pad = [round(xs.min() / Wd, 4), round(ys.min() / Hd, 4), round((Wd - 1 - xs.max()) / Wd, 4), round((Hd - 1 - ys.max()) / Hd, 4)]
    rgb = np.asarray(im.convert('RGB'))[a > 200]
    q = Image.fromarray(rgb[None, :, :]).quantize(3, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[:9]; cnt = sorted(q.getcolors(), reverse=True)
    dom = ['#%02x%02x%02x' % tuple(pal[i * 3:i * 3 + 3]) for _, i in cnt]
    e = dict(file=f'bosset/ads/{name}.png', role=role, product=prod, code=code, price_19_10=price, product_page=S + url,
             source_image=(C + src) if src.endswith('.jpg') else src, method=method, size=[Wd, Hd], pad=pad,
             aspect=round((xs.max() - xs.min()) / (ys.max() - ys.min()), 3), dominant=dom, facts=facts)
    import os
    if os.path.exists(f'{P}/bosset/ads/{name}_shadow.png'): e['shadow'] = f'bosset/ads/{name}_shadow.png'
    out['files'].append(e)
json.dump(out, open(f'{P}/bosset/ads/manifest.json', 'w'), ensure_ascii=False, indent=1)
for e in out['files']: print(e['file'].split('/')[-1], e['size'], e['pad'], e['dominant'])
