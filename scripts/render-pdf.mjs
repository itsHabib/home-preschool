// Renders the built binder and kits to printables/*.pdf (US Letter, actual size).
// Run `npm run build` first; `npm run pdf` calls this.
import { chromium } from 'playwright'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const requested = process.argv.slice(2)
const built = ['binder.html', ...readdirSync('.').filter((f) => /^kit-week-\d+\.html$/.test(f)).sort()].filter(existsSync)
const files = requested.length ? requested : built
if (!files.length) throw new Error('Nothing to render. Run `npm run build` first.')

mkdirSync('printables', { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  for (const file of files) {
    const page = await browser.newPage()
    await page.goto(pathToFileURL(resolve(file)).href)
    await page.evaluate(() => document.fonts.ready)
    const out = resolve('printables', file.replace(/\.html$/, '.pdf'))
    await page.pdf({ path: out, format: 'Letter', preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false })
    console.log(`Wrote ${out} (${await page.locator('.page').count()} pages)`)
    await page.close()
  }
} finally {
  await browser.close()
}
