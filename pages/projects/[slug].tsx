import React from 'react'
import Head from 'next/head'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import { ProjectArticle, ProjectBlock } from '@/types'
import { loadAllProjectArticles, loadProjectArticleBySlug } from '@/lib/project-articles'

interface ProjectDetailProps {
  project: ProjectArticle
}

export default function ProjectDetail({ project }: ProjectDetailProps) {

  const getHeroData = (heroImage?: string | { src: string; alt?: string; caption?: string; width?: number; height?: number; align?: 'left' | 'center' | 'right'; show?: boolean; className?: string }) => {
    if (!heroImage) return null
    if (typeof heroImage === 'string') {
      return {
        src: heroImage,
        alt: project?.title ?? '',
        width: undefined,
        height: 256,
        align: 'center' as 'center',
        show: true,
        className: undefined,
      }
    }
    if (heroImage.show === false) return null
    return {
      show: heroImage.show ?? true,
      ...heroImage,
    }
  }

  const renderBlock = (block: ProjectBlock, index: number) => {
    if (block.type === 'text') {
      return (
        <p key={index} className="mb-6 leading-8 text-gray-700">
          {block.content}
        </p>
      )
    }
    if (block.type === 'image') {
      const imgStyle: React.CSSProperties = {
        width: '100%',
        height: block.height ? `${block.height}px` : 'auto',
      }

      const alignmentClass = block.align === 'right'
        ? 'ml-auto'
        : block.align === 'left'
          ? 'mr-auto'
          : 'mx-auto'

      const wrapperStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: block.width ? `${block.width}px` : '100%',
      }

      return (
        <div key={index} className={`mb-10 ${alignmentClass}`} style={wrapperStyle}>
          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
            <img
              src={block.src}
              alt={block.alt}
              className={`${block.className ?? ''} ${block.width ? '' : 'w-full'} h-auto object-cover`}
              style={imgStyle}
            />
          </div>
          {block.caption && <p className="mt-3 text-sm text-gray-500">{block.caption}</p>}
        </div>
      )
    }
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-24">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
            <p className="text-gray-600">Il progetto richiesto non esiste o è stato rimosso.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{project.title} - Scuderia DIIEM</title>
      </Head>

      <div className="min-h-screen">
        <Header />

        <main className="py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-accent mb-4">{project.title}</h1>
            <p className="text-sm text-gray-400 mb-6">{project.date}</p>
            {project.heroImage && (() => {
              const hero = getHeroData(project.heroImage)
              if (!hero) return null
              const alignmentClass = hero.align === 'right'
                ? 'ml-auto'
                : hero.align === 'left'
                  ? 'mr-auto'
                  : 'mx-auto'
              const style: React.CSSProperties = {}
              if (hero.width) style.width = hero.width
              if (hero.height) style.height = hero.height

              return (
                <div className={`mb-8 overflow-hidden rounded-3xl border border-gray-200 shadow-sm ${alignmentClass}`} style={{ maxWidth: hero.width ?? '100%' }}>
                  <img
                    src={hero.src}
                    alt={hero.alt ?? project.title}
                    className={`${hero.className ?? ''} w-full object-cover`}
                    style={style}
                  />
                  {hero.caption && <p className="px-4 py-3 text-sm text-gray-500">{hero.caption}</p>}
                </div>
              )
            })()}
            <div className="prose max-w-none text-gray-700">
              {project.blocks.map((block, index) => renderBlock(block, index))}
            </div>
            {project.authors && project.authors.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  {project.authors.length > 1 ? 'Autori' : 'Autore'}: {project.authors.join(', ')}
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const projects = await loadAllProjectArticles()

  return {
    paths: projects.map((project) => ({
      params: { slug: project.slug },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const project = await loadProjectArticleBySlug(params.slug)

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
    },
  }
}
