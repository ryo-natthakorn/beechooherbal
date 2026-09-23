# Video preview sources

Captured 2026-09-23. These are the original video's own preview images, not generated substitutes.

- YouTube JPG filenames are video IDs. Added previews came from `https://i.ytimg.com/vi/{id}/maxresdefault.jpg`, falling back to `sddefault.jpg` then `hqdefault.jpg` where unavailable. Existing four previews were retained. JPEG signatures and image dimensions were validated; new images are at most 960px wide. Astro generates optimized served images.
- `facebook-1096213878455331.jpg`: the `og:image` for https://www.facebook.com/beechooherbal/videos/1096213878455331/ . Saved locally so the expiring Facebook CDN URL is never shipped to visitors.
- GIPHY IDs `t7752IVYRBN1YzOPaL`, `ywk5yj8EPv7Vzu2K4F`, `LVOdW9t7VMge0jk0Vz`: original still images at `https://media.giphy.com/media/{id}/giphy_s.gif`, validated with the image decoder and converted to JPEG.

Adding a YouTube/GIPHY video requires its matching local preview. The build fails if it is missing. Facebook currently has one source clip in TreatmentBenefits; if that source changes, its poster must change with it. Posters use contain, preserving the complete image. Native Dead Sea video retains its approved `/media/dead-sea-mud/cover.jpg`.
