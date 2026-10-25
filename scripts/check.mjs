import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];
for (const filename of ['index.html', 'cv.html']) {
  const html = await readFile(path.join(root, filename), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${filename}: duplicate element IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(ref)) continue;
    if (ref.startsWith('#')) {
      if (!ids.includes(ref.slice(1))) failures.push(`${filename}: missing anchor ${ref}`);
      continue;
    }
    const filenamePart = decodeURIComponent(ref.split(/[?#]/)[0]);
    const target = path.resolve(root, filenamePart);
    if (!target.startsWith(root)) { failures.push(`${filename}: invalid local path ${ref}`); continue; }
    try { await stat(target); } catch { failures.push(`${filename}: missing file ${ref}`); }
  }
  if (!html.includes('lang="zh-CN"')) failures.push(`${filename}: missing document language`);
  if (!html.includes('name="viewport"')) failures.push(`${filename}: missing viewport`);
  if (/href="\//.test(html)) failures.push(`${filename}: root-relative URL breaks project Pages`);
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Checked homepage and CV: local assets, anchors, unique IDs, language and GitHub Pages paths.');
