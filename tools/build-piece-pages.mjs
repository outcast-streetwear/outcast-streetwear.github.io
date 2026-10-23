/* Builds a link preview for every piece, so a shared piece link shows that piece on WhatsApp and Instagram:
     p/<name>/index.html    tags the preview reads, then opens the piece on the shop
     images/og/<name>.jpg   the 1200x630 picture
   Run it after adding, renaming or re-photographing pieces, then commit the results:
     npm install && npx playwright install chromium   (first time only)
     npm run pages
   Pieces come from the brand's Google Sheet, or from the built-in list in index.html if the sheet can't be reached. */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const site = /<meta property="og:url" content="([^"]+)"/.exec(html)[1].replace(/\/$/, "");
const sheetId = (/sheetId:\s*"([^"]*)"/.exec(html) || [])[1] || "";
const noindex = /<meta name="robots" content="noindex/.test(html);

/* same rules as slugify() and prepare() in index.html */
const TAKEN = new Set(["top", "shop", "custom", "how"]);
function slugify(name) { return (name || "").toLowerCase().replace(/&/g, " and ").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "piece"; }
function withSlugs(list) {
  const seen = new Set();
  return list.map((p) => {
    const base = slugify(p.name); let s = TAKEN.has(base) ? base + "-piece" : base, k = 2;
    while (seen.has(s)) s = base + "-" + k++;
    seen.add(s); return { ...p, slug: s };
  });
}

/* same as parseCSV(), photoURL() and fromSheet() in index.html */
function parseCSV(t) {
  const rows = []; let row = [], f = "", q = false;
  for (let k = 0; k < t.length; k++) {
    const c = t[k];
    if (q) { if (c === '"') { if (t[k + 1] === '"') { f += '"'; k++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && t[k + 1] === "\n") k++; row.push(f); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}
function photoURL(v) {
  v = (v || "").trim();
  const d = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/.exec(v);
  if (d) return "https://drive.google.com/thumbnail?id=" + d[1] + "&sz=w1000";
  if (/^https:\/\//.test(v)) return v;
  if (/^[\w-]+$/.test(v)) return "images/" + v + ".webp";
  return "";
}
function fromSheet(rows) {
  const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
  const col = (r, n) => { const k = head.indexOf(n); return k < 0 ? "" : (r[k] || "").trim(); };
  return rows.filter((r) => col(r, "name") && !/^(no|n|hide|hidden|false|0)$/i.test(col(r, "show")))
    .map((r) => ({ name: col(r, "name"), type: col(r, "type") || "Tee", photo: photoURL(col(r, "photo")), headline: col(r, "headline") }));
}
function builtIn() {
  const re = /piece\("([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)"(?:,\s*"([^"]*)")?\)/g, out = []; let m;
  while ((m = re.exec(html))) out.push({ name: m[1], type: m[2], photo: "images/" + m[3] + ".webp", headline: "" });
  return out;
}
async function pieces() {
  if (sheetId) {
    try {
      const r = await fetch("https://docs.google.com/spreadsheets/d/" + encodeURIComponent(sheetId) + "/gviz/tq?tqx=out:csv&headers=1", { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error("sheet " + r.status);
      const list = fromSheet(parseCSV(await r.text()));
      if (list.length) { console.log("Pieces from the Google Sheet: " + list.length); return list; }
    } catch (e) { console.log("Sheet not reachable (" + e.message + "), using the built-in list in index.html"); }
  }
  const list = builtIn(); console.log("Pieces from the built-in list: " + list.length); return list;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const STAR = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 9l6.5 15.5 16.8 1.3-12.8 10.9 4 16.3L32 44.2 17.5 53l4-16.3L8.7 25.8l16.8-1.3z" fill="#E0261D"/></svg>';
function imgSrc(photo) {
  if (!photo) return "";
  if (/^https:\/\//.test(photo)) return photo;
  try { return "data:image/webp;base64," + readFileSync(join(root, photo)).toString("base64"); } catch { return ""; }
}
function card(p) {
  const src = imgSrc(p.photo), size = p.name.length > 22 ? 54 : 66;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@500;600&display=block">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; width: 1200px; height: 630px; background: #F4F3EF; color: #0E0E0E; font-family: "Archivo", sans-serif; display: grid; grid-template-columns: 630px 1fr; }
  .ph { background: #ECEAE3; display: grid; place-items: center; }
  .ph img { width: 82%; height: 82%; object-fit: contain; filter: drop-shadow(0 14px 10px rgba(0,0,0,.14)); }
  .ph svg { width: 46%; }
  .tx { padding: 60px 56px; display: flex; flex-direction: column; justify-content: space-between; }
  .logo { font: 400 50px/1 "Archivo Black", sans-serif; letter-spacing: -0.02em; display: flex; align-items: center; }
  .logo svg { width: 46px; height: 46px; margin: 0 1px; }
  .type { font-weight: 600; font-size: 19px; letter-spacing: .14em; text-transform: uppercase; color: #6B6963; }
  h1 { font: 400 ${size}px/.95 "Archivo Black", sans-serif; text-transform: uppercase; margin: 14px 0 0; letter-spacing: -0.01em; }
  .foot { font-size: 23px; font-weight: 500; color: #6B6963; border-top: 3px solid #0E0E0E; padding-top: 18px; }
</style></head><body>
<div class="ph">${src ? `<img src="${esc(src)}" alt="">` : STAR}</div>
<div class="tx"><div class="logo">out${STAR}cast</div><div><div class="type">${esc(p.type)}</div><h1>${esc(p.name)}</h1></div><div class="foot">Order online · Shipped all over India</div></div>
</body></html>`;
}
function page(p) {
  const to = "../../#" + p.slug, title = p.name + " · Outcast";
  const desc = p.headline || p.type + " by Outcast. Order online, shipped all over India.";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ""}<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Outcast">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${site}/p/${p.slug}/">
<meta property="og:image" content="${site}/images/og/${p.slug}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)});</script>
</head>
<body><p><a href="${to}">${esc(p.name)} on Outcast</a></p></body>
</html>
`;
}

const list = withSlugs(await pieces());
rmSync(join(root, "p"), { recursive: true, force: true });
rmSync(join(root, "images", "og"), { recursive: true, force: true });
mkdirSync(join(root, "images", "og"), { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const p of list) {
  await tab.setContent(card(p), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: join(root, "images", "og", p.slug + ".jpg"), type: "jpeg", quality: 82 });
  mkdirSync(join(root, "p", p.slug), { recursive: true });
  writeFileSync(join(root, "p", p.slug, "index.html"), page(p));
  console.log("  " + p.slug);
}
await browser.close();
console.log("Done. Commit p/ and images/og/ to publish the previews.");
