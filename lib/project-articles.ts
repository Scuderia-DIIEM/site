import type { ProjectArticle } from '@/types'

const articlesDirectory = 'data/project-articles'

async function getProjectFiles() {
  const { promises: fs } = await import('fs')
  const path = await import('path')

  const directory = path.join(process.cwd(), articlesDirectory)
  const filenames = await fs.readdir(directory)
  return { fs, path, directory, filenames }
}

export async function loadAllProjectArticles(): Promise<ProjectArticle[]> {
  const { fs, path, directory, filenames } = await getProjectFiles()
  const projectFiles = filenames.filter((name) => name.endsWith('.json'))

  const projects = await Promise.all(
    projectFiles.map(async (filename) => {
      const raw = await fs.readFile(path.join(directory, filename), 'utf8')
      return JSON.parse(raw) as ProjectArticle
    })
  )

  return projects.sort((a, b) => b.date.localeCompare(a.date))
}

export async function loadProjectArticleBySlug(slug: string): Promise<ProjectArticle | undefined> {
  const projects = await loadAllProjectArticles()
  return projects.find((project) => project.slug === slug)
}
