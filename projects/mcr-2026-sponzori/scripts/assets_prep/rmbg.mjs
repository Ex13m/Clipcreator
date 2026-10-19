// usage: node rmbg.mjs model in1 out1 [in2 out2 ...]
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs';
import path from 'node:path';
const [model, ...rest] = process.argv.slice(2);
for (let i = 0; i < rest.length; i += 2) {
  const inp = rest[i], out = rest[i + 1];
  const t = Date.now();
  const buf = fs.readFileSync(inp);
  const ext = path.extname(inp).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  const blob = new Blob([buf], { type: mime });
  const res = await removeBackground(blob, { model, output: { format: 'image/png', quality: 1, type: 'foreground' } });
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log('ok', out, Date.now() - t, 'ms');
}
