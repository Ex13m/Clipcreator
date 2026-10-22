#!/bin/bash
# Vyřeže krátké němé smyčky z Reels: 540×960 H.264 (web), VP9 (jen QA v Playwright – chromium bez H.264), 1080p VP9 (záznam MP4), JPG poster.
set -e
P=$(cd "$(dirname "$0")/.." && pwd); R=$P/../mcr-2026-sponzori/renders; O=$P/_work/clips; mkdir -p $O
DUR=${DUR:-4.4}; CRF=${CRF:-26}
grep -v '^#' $P/scripts/clips.txt | while read k s; do
  [ -z "$k" ] && continue
  ffmpeg -nostdin -v error -y -ss $s -t $DUR -i $R/reel_${k}_v8.mp4 -an -vf "scale=540:960:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset veryslow -profile:v main -level 3.1 -crf $CRF -g 60 -movflags +faststart $O/$k.mp4
  ffmpeg -nostdin -v error -y -ss $s -t $DUR -i $R/reel_${k}_v8.mp4 -an -vf "scale=540:960:flags=lanczos" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 -deadline good -cpu-used 4 $O/$k.webm
  ffmpeg -nostdin -v error -y -ss $s -t $DUR -i $R/reel_${k}_v8.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 22 -row-mt 1 -deadline good -cpu-used 4 -g 1 $O/${k}_1080.webm
  ffmpeg -nostdin -v error -y -ss $s -i $R/reel_${k}_v8.mp4 -frames:v 1 -vf "scale=540:960:flags=lanczos" -q:v 6 $O/$k.jpg
  echo "$k $(stat -c%s $O/$k.mp4) mp4, $(stat -c%s $O/$k.jpg) jpg"
done
