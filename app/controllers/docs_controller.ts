import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { readdir, readFile } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { marked } from 'marked'

interface DocFile {
  slug: string
  title: string
  order: number
  filename: string
  content?: string
  html?: string
}

export default class DocsController {
  private docsPath = app.makePath('resources/docs')

  async index({ inertia }: HttpContext) {
    const docs = await this.loadDocs()

    return inertia.render('docs/index', { docs })
  }

  private async loadDocs(): Promise<DocFile[]> {
    try {
      const files = await readdir(this.docsPath)
      const docs: DocFile[] = []

      for (const f of files) {
        if (!f.endsWith('.md')) continue
        const name = basename(f, '.md')
        const match = name.match(/^(\d+)-(.+)$/)
        if (!match) continue

        const order = parseInt(match[1], 10)
        const slug = match[2]
        const title = slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')

        const content = await readFile(join(this.docsPath, f), 'utf-8')
        const html = await marked(content)

        docs.push({ slug, title, order, filename: f, content, html })
      }

      return docs.sort((a, b) => a.order - b.order)
    } catch {
      return []
    }
  }
}
