const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const distDir = path.resolve(root, process.argv[2] || 'dist-local')
const htmlPath = path.join(distDir, 'index.html')
const outputPath = path.resolve(root, process.argv[3] || 'local-preview.html')

let html = fs.readFileSync(htmlPath, 'utf8')

const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="(.+?)">/)
const jsMatch = html.match(/<script type="module" crossorigin src="(.+?)"><\/script>/)

if (!cssMatch || !jsMatch) {
  throw new Error(`Could not find built CSS/JS references in ${htmlPath}`)
}

const css = fs.readFileSync(path.join(distDir, cssMatch[1]), 'utf8')
const js = fs.readFileSync(path.join(distDir, jsMatch[1]), 'utf8')

html = html.replace(cssMatch[0], `<style>\n${css}\n</style>`)
html = html.replace(jsMatch[0], `<script type="module">\n${js}\n</script>`)

fs.writeFileSync(outputPath, html)
console.log(outputPath)
