import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = async (path) => readFile(new URL(path, root), "utf8");

test("the Dead Sea Mud launch content includes its approved commercial facts", async () => {
  const data = await source("src/data/product-banner.ts");

  for (const fact of [
    "70%",
    "16%",
    "1%",
    "87%",
    "1,500",
    "3 ครั้งต่อเดือน",
    "1 ครั้งต่อเดือน",
    "3 regular treatments",
    "1 Dead Sea treatment",
  ]) {
    assert.match(data, new RegExp(fact.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")));
  }
});

test("the Dead Sea Mud launch hero is rendered before the existing homepage hero", async () => {
  const page = await source("src/components/home/HomePage.astro");

  assert.ok(page.indexOf("<ProductBanner {lang} />") < page.indexOf("<HeroScene {lang} />"));
});

test("the launch keeps the existing homepage H1 and readable header in both languages", async () => {
  const component = await source("src/components/home/ProductBanner.astro");
  assert.match(component, /<h2 id="dead-sea-mud-title"/);
  assert.doesNotMatch(component, /<h1\b/);
  for (const path of ["src/pages/index.astro", "src/pages/th/home.astro"]) {
    assert.match(await source(path), /headerOverlay=\{false\}/);
  }
});

test("the launch hero uses only the approved Dead Sea video and poster", async () => {
  const product = await source("src/components/home/ProductBanner.astro");
  const hero = await source("src/components/home/HeroScene.astro");

  assert.match(product, /<video[\s\S]*poster="\/media\/dead-sea-mud\/cover\.jpg"/);
  assert.match(product, /src="\/media\/dead-sea-mud\/dead-sea-launch\.mp4"/);
  assert.match(product, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(product, /YouTubeEmbed|HOME\.hero/);
  assert.doesNotMatch(hero, /<YouTubeEmbed/);
  await access(new URL("public/media/dead-sea-mud/cover.jpg", root));
  await access(new URL("public/media/dead-sea-mud/dead-sea-launch.mp4", root));
});

test("the banner keeps details below the video hero", async () => {
  const product = await source("src/components/home/ProductBanner.astro");

  assert.ok(product.indexOf("product-launch-media") < product.indexOf("product-launch-details-inner"));
  assert.ok(product.indexOf("product-composition") > product.indexOf("product-launch-media"));
  assert.match(product, /product\.description\[lang\]/);
  assert.match(product, /product\.price\[lang\]/);
});
