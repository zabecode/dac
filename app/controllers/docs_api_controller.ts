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
}

export default class DocsApiController {
  private docsPath = app.makePath('resources/docs')

  /**
   * Parse a doc filename into metadata
   * Format: 01-introduction.md → { slug: 'introduction', title: 'Introduction', order: 1 }
   */
  private parseFilename(filename: string): DocFile | null {
    if (!filename.endsWith('.md')) return null
    const name = basename(filename, '.md')
    const match = name.match(/^(\d+)-(.+)$/)
    if (!match) return null

    const order = parseInt(match[1], 10)
    const slug = match[2]
    const title = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    return { slug, title, order, filename }
  }

  /**
   * GET /api/v1/docs
   * List all available documentation files
   */
  async index({ response }: HttpContext) {
    try {
      const files = await readdir(this.docsPath)
      const docs = files
        .map((f) => this.parseFilename(f))
        .filter(Boolean)
        .sort((a, b) => a!.order - b!.order)
        .map((d) => ({
          slug: d!.slug,
          title: d!.title,
          order: d!.order,
          urls: {
            view: `/api/v1/docs/${d!.slug}`,
            raw: `/api/v1/docs/${d!.slug}/raw`,
          },
        }))

      return response.ok({ data: docs })
    } catch {
      return response.ok({ data: [] })
    }
  }

  /**
   * GET /api/v1/docs/:slug
   * View a rendered (HTML) version of a doc
   */
  async show({ params, response }: HttpContext) {
    const file = await this.findFile(params.slug)
    if (!file) {
      return response.notFound({ error: 'Documento não encontrado' })
    }

    const content = await readFile(join(this.docsPath, file.filename), 'utf-8')
    const html = await marked(content)

    return response.ok({
      data: {
        slug: file.slug,
        title: file.title,
        order: file.order,
        format: 'html',
        content: html,
      },
    })
  }

  /**
   * GET /api/v1/docs/:slug/raw
   * View the raw markdown of a doc
   */
  async raw({ params, response }: HttpContext) {
    const file = await this.findFile(params.slug)
    if (!file) {
      return response.notFound({ error: 'Documento não encontrado' })
    }

    const content = await readFile(join(this.docsPath, file.filename), 'utf-8')

    return response.ok({
      data: {
        slug: file.slug,
        title: file.title,
        order: file.order,
        format: 'markdown',
        content,
      },
    })
  }

  /**
   * Find a doc file by slug
   */
  private async findFile(slug: string): Promise<DocFile | null> {
    try {
      const files = await readdir(this.docsPath)
      for (const f of files) {
        const parsed = this.parseFilename(f)
        if (parsed && parsed.slug === slug) return parsed
      }
      return null
    } catch {
      return null
    }
  }
}
