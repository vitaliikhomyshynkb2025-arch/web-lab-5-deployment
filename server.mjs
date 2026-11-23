import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' }
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname))
    if (!file.startsWith(root + sep) || pathname.split('/').some((part) => part.startsWith('.') || part === 'node_modules')) {
      response.writeHead(403); response.end('Forbidden'); return
    }
    const content = await readFile(file)
    response.writeHead(200, { 'Content-Type': `${types[extname(file)] || 'text/plain'}; charset=utf-8` })
    response.end(content)
  } catch { response.writeHead(404); response.end('Not found') }
}).listen(8080, '127.0.0.1', () => console.log('HTML-версія: http://127.0.0.1:8080'))
