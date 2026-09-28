export interface Product {
  id: string
  title: string
  description: string
  image?: string
  icon?: string
  features?: string[]
  link?: string
  colorAccent?: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  stat?: string
  colorAccent?: string
}

export type ProjectBlock =
  | { type: 'text'; content: string }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
      width?: number
      height?: number
      align?: 'left' | 'center' | 'right'
      className?: string
    }

export interface HeroImage {
  src: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  align?: 'left' | 'center' | 'right'
  show?: boolean
  className?: string
}

export interface ProjectArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  authors?: string[]
  heroImage?: string | HeroImage
  blocks: ProjectBlock[]
}

export interface GalleryImage {
  id?: string
  src: string
  alt: string
  title?: string
  description?: string
  caption?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string | string[]
}

export interface NewsItem {
  id: string
  title: string
  date: string
  excerpt: string
  link?: string
}

export interface Race {
  id: string
  name: string
  date: string
  location: string
  result?: string
  status: 'upcoming' | 'completed'
}

export interface TeamMember {
  id: number
  name: string
  role: string
  headOf?: 'role' | 'team'
  team: string
  image: string
}

