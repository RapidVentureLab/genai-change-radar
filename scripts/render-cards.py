# Renders the LinkedIn images from assets/social/cards.html.
#   python3 -m http.server 8790 &   (from the repo root)
#   python3 scripts/render-cards.py ["The Paper Name"] [url]
# Writes assets/social/og.png (link preview, 1200x627) and assets/social/post.png (1080x1350).
import asyncio, sys, urllib.parse
from playwright.async_api import async_playwright

async def main():
    q = {}
    if len(sys.argv) > 1: q["name"] = sys.argv[1]
    if len(sys.argv) > 2: q["url"] = sys.argv[2]
    url = "http://localhost:8790/assets/social/cards.html?" + urllib.parse.urlencode(q)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1300, "height": 2200})
        await pg.goto(url, wait_until="load")
        await pg.evaluate("document.fonts.ready")
        await pg.wait_for_timeout(500)
        await pg.locator("#og").screenshot(path="assets/social/og.png")
        await pg.locator("#post").screenshot(path="assets/social/post.png")
        await b.close()

asyncio.run(main())
