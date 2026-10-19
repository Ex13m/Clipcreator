"""ads/manifest.json: size, pad (transparent margin fractions l,t,r,b), dominant colours, product + source URLs."""
import json, os, glob
import numpy as np
from PIL import Image
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
D = f'{P}/assets_prep/activefishing/ads'
CDN = 'https://cdn.myshoptet.com/usr/www.activefishing.cz/user/shop/orig/'
WEB = 'https://www.activefishing.cz'
META = {
  'H1_timon_chibi_futten_fs_tropical_chart_pink': ('hero', 'Wobler Timon Chibi Futten FS Tropical Chart Pink 51mm', '/wobler-timon-chibi-futten-fs-tropical-chart-pink-51mm/', CDN + '23817_tropical-chart-pink.jpg', 'Higgsfield 4k upscale (800×600 → 4096×3072) + local ISNet trimap / white unmix', 'chip: Timon · Chibi Futten FS · 51 mm'),
  'H2_nories_sofia_1-2g_sk017_hot_mango_pair': ('hero', 'Plandavka Nories Sofia 1,2g SK017 Hot Mango 101', '/plandavka-nories-sofia-1-2g-sk017-hot-mango-101/', CDN + '23480_sk017.jpg', 'Higgsfield 4k upscale (800×600 → 4096×3072) + local cut; two spoons + hook (pair)', 'chip: Nories · Sofia · 1,2 g'),
  'H3_varivas_super_trout_area_es2_ester_natural': ('hero', 'Vlasec VARIVAS Super Trout Area ES2 Ester Natural (80 m)', '/vlasec-varivas-super-trout-area-es2-ester-natural--0-4-80m-0-104mm-1-04kg/', 'shop CDN orig 1500×1500 (ES2 Natural listing image; fetched 19 Oct 17:25)', 'local cut, label pockets filled, see-through lower flange kept transparent', 'chip: VARIVAS · ES2 Ester · 80 m'),
  'S1_timon_chibi_futten_fs_uv_cobalt_blue': ('secondary', 'Wobler Timon Chibi Futten FS UV Cobalt Blue 51mm', '/wobler-timon-chibi-futten-fs-uv-cobalt-blue-51mm/', CDN + '23790_uv-cobalt-blue.jpg', 'native 800×600, local cut', ''),
  'S2_timon_chibi_futten_fs_red_black_glitter': ('secondary', 'Wobler Timon Chibi Futten FS Red Black Glitter 51mm', '/wobler-timon-chibi-futten-fs-red-black-glitter-51mm/', CDN + '23787_red-black-glitter.jpg', 'native, local cut (black tail: needs a light/graphite bg, not pure black)', ''),
  'S3_timon_chibi_futten_fs_gold_shower': ('secondary', 'Wobler Timon Chibi Futten FS Gold Shower 51mm', '/wobler-timon-chibi-futten-fs-gold-shower-51mm/', CDN + '23814_gold-shower.jpg', 'native, local cut', ''),
  'S4_timon_chibi_futten_fs_hologram_bait': ('secondary', 'Wobler Timon Chibi Futten FS Hologram Bait 51mm', '/wobler-timon-chibi-futten-fs-hologram-bait-51mm/', CDN + '23784_hologram-bait.jpg (fetched 17:25)', 'native, local cut (clear lip kept milky-opaque)', ''),
  'S5_velvet_arts_forte_1-5g_no1': ('secondary', 'Plandavka Velvet Arts Forte 1,5g No.1', '/plandavka-velvet-arts-forte-1-5g-no-1/', CDN + '23826_15forte-1.png (600×450, fetched 17:25)', 'native, soft source → keep ≤ 500 px on screen', ''),
  'S6_timon_micro_panicra_mr-f_rattle_yazy_pellet_san': ('secondary', 'Wobler Timon Micro PaniCra MR-F Rattle Yazy Pellet San 20mm', '/wobler-timon-micro-panicra-mr-f-rattle-yazy-pellet-san-20mm/', 'assets/activefishing/p08 (shop transparent PNG)', 'shop alpha, trimmed + decontaminated', ''),
  'S7_mukai_upward_zanmu_35s_6ck': ('secondary', 'Wobler Mukai UpWard Zanmu 35 S 6CK 35mm', '/wobler-mukai-upward-zanmu-35-s-6ck-35mm/', CDN + '21785-1_upward-zanmu-6ck.png (2560×1878)', 'local cut from 2560 px source (hero-grade size)', ''),
  'S8_valkein_scheila_1-8g_no80_delicious_peach': ('secondary', 'Plandavka ValkeIN Scheila 1,8g No.80 Delicious Peach', '/plandavka-valkein-scheila-1-8g-no-80-delicious-peach/', CDN + '21945-1_plandavka-valkein-scheila-1-8g-no-80-delicious-peach.png (640×480)', 'native, front + back pair', ''),
}

def dominant(a, k=3):
    px = a[a[..., 3] > 200][:, :3].astype(np.float32)
    if len(px) > 40000:
        px = px[np.random.default_rng(0).choice(len(px), 40000, replace=False)]
    c = px[np.random.default_rng(1).choice(len(px), k, replace=False)]
    for _ in range(15):
        lab = np.argmin(((px[:, None] - c[None]) ** 2).sum(2), 1)
        c = np.array([px[lab == i].mean(0) if (lab == i).any() else c[i] for i in range(k)])
    share = np.bincount(lab, minlength=k) / len(lab)
    o = np.argsort(-share)
    return [{'hex': '#%02x%02x%02x' % tuple(int(v) for v in c[i]), 'share': round(float(share[i]), 3)} for i in o]

items = []
for name, (role, prod, url, src, method, chip) in META.items():
    f = f'{D}/{name}.png'
    a = np.asarray(Image.open(f).convert('RGBA'))
    ys, xs = np.where(a[..., 3] > 8)
    H, W = a.shape[:2]
    pad = [round(xs.min() / W, 3), round(ys.min() / H, 3), round((W - 1 - xs.max()) / W, 3), round((H - 1 - ys.max()) / H, 3)]
    it = dict(file=f'assets_prep/activefishing/ads/{name}.png', role=role, product=prod, product_url=WEB + url, source=src,
              method=method, size=[W, H], pad=pad, dominant=dominant(a))
    if os.path.exists(f'{D}/{name}_shadow.png'):
        it['shadow'] = f'assets_prep/activefishing/ads/{name}_shadow.png'
    if chip:
        it['onscreen'] = chip
    items.append(it)
out = dict(sponsor='activefishing', generated='2026-10-19', scripts='scripts/assets_prep/activefishing_ad/',
           hf_log='assets_prep/activefishing/hf_log.md', research='research/activefishing_ad.md',
           logo_variants={'on_dark': 'assets_prep/activefishing/logo_on_dark.png', 'white_knockout (derived, confirm with sponsor)': 'assets_prep/activefishing/ads/logo_white_knockout.png'},
           items=items)
json.dump(out, open(f'{D}/manifest.json', 'w'), ensure_ascii=False, indent=1)
for it in items:
    print(it['file'].split('/')[-1], it['size'], it['pad'], [d['hex'] for d in it['dominant']])
