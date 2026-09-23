import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
async function pages(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await pages(file));
    else if (file.endsWith(".html")) result.push(file);
  }
  return result;
}

test("every built video has a local preview before activation, in both languages", async () => {
  const files = await pages(dist);
  assert.ok(files.length >= 93, "Build the complete site before this test");
  let facades = 0;
  let nativeVideos = 0;
  const youtubeIds = new Set();
  const providers = new Set();
  for (const file of files) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(/<div\b[^>]*(?:data-yt-id|data-embed-src)=[^>]+>[\s\S]*?<\/button>/g)) {
      const block = match[0];
      const image = block.match(/<img\b[^>]*src="([^"]+)"[^>]*>/)?.[1];
      assert.ok(image?.startsWith("/_astro/"), `${file}: missing self-hosted preview`);
      await access(path.join(dist, image));
      assert.match(block, /<button[^>]*type="button"/);
      assert.match(block, /class="sr-only">[^<]+<\/span>/);
      const id = block.match(/data-yt-id="([^"]+)"/)?.[1];
      if (id) youtubeIds.add(id);
      if (block.includes("giphy.com")) providers.add("giphy");
      if (block.includes("facebook.com")) providers.add("facebook");
      facades++;
    }
    assert.doesNotMatch(html, /<iframe\b[^>]*src="https:\/\/(?:www\.)?(?:youtube-nocookie|facebook|giphy)\.com/);
    for (const [video] of html.matchAll(/<video\b[^>]*>/g)) {
      assert.doesNotMatch(video, /\bautoplay\b/);
      assert.match(video, /\bcontrols\b/);
      const poster = video.match(/poster="([^"]+)"/)?.[1];
      assert.ok(poster, `${file}: native video needs a poster`);
      await access(path.join(dist, poster));
      nativeVideos++;
    }
  }
  assert.ok(youtubeIds.size >= 42);
  assert.deepEqual([...providers].sort(), ["facebook", "giphy"]);
  assert.equal(nativeVideos, 2);
  console.log(`${files.length} pages, ${facades} previews, ${youtubeIds.size} YouTube IDs, ${nativeVideos} native posters`);
});

test("native hero remains paused before play and honors reduced motion changes", async () => {
  const source = await readFile(path.join(root, "src/components/home/ProductBanner.astro"), "utf8");
  assert.doesNotMatch(source, /video\.play\(/);
  assert.match(source, /video\.pause\(/);
  assert.match(source, /reducedMotion\.addEventListener\("change", syncVideoMotion\)/);
});
