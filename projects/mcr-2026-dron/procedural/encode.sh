#!/usr/bin/env bash
# Crop the square master frames into the two deliverables and encode (H.264, yuv420p, CRF 16, BT.709).
set -euo pipefail
cd "$(dirname "$0")"
IN=frames/master/f%03d.png
mkdir -p out
VF709="scale=out_color_matrix=bt709:out_range=tv,format=yuv420p"
TAGS="-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv"
ffmpeg -y -loglevel error -framerate 30 -i "$IN" -vf "crop=1920:1080:0:420,$VF709" -c:v libx264 -preset slow -crf 16 -profile:v high -g 30 $TAGS -movflags +faststart out/flyover_16x9.mp4
ffmpeg -y -loglevel error -framerate 30 -i "$IN" -vf "crop=1080:1920:420:0,$VF709" -c:v libx264 -preset slow -crf 16 -profile:v high -g 30 $TAGS -movflags +faststart out/flyover_9x16.mp4
python3 - <<'PY'
from PIL import Image
for f in (0,40,80,119):
    im=Image.open('frames/master/f%03d.png'%f)
    im.crop((0,420,1920,1500)).save('out/still_16x9_f%03d.png'%f)
    im.crop((420,0,1500,1920)).save('out/still_9x16_f%03d.png'%f)
PY
ls -la out
