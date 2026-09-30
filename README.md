# University Project Landing Page

A modern, beautiful landing page built with Next.js and TypeScript, configured for static site generation.

## Features

- ⚡ **Static Site Generation** - Optimized for performance with Next.js static export
- 🎨 **Modern Design** - Beautiful, responsive UI with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🔒 **Type-Safe** - Built with TypeScript for better development experience
- ✨ **Accessible** - Follows modern web accessibility best practices

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

To create a static export of your site:

```bash
npm run build
```

This will generate a fully static site in the `out` directory, which can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

### ThingSpeak Sensor Readings

Paste the ThingSpeak read API key into `THINGSPEAK_READ_API_KEY` in `components/Layout/Header.tsx` to display the latest temperature (`field1`) and humidity (`field2`) from channel `3516664`.

The site is statically exported, so this read-only key is included in the public browser bundle. Anyone can use it to read the private channel's feed; do not use a write key. Rebuild and redeploy the site after inserting the key.

## Project Structure

```
├── pages/
│   ├── _app.tsx          # App wrapper with global styles
│   └── index.tsx         # Main landing page
├── styles/
│   └── globals.css       # Global styles and design system
├── next.config.js        # Next.js configuration (static export)
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Customization

### Updating Content

Edit `pages/index.tsx` to customize the content, sections, and structure of the landing page.

### Styling

Modify `styles/globals.css` to change colors, fonts, spacing, and other design elements. CSS variables are defined at the top of the file for easy customization.

### Colors

The color scheme can be customized by modifying the CSS variables in `styles/globals.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #ec4899;
  /* ... */
}
```

## Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

1. Build the static site: `npm run build`
2. Drag and drop the `out` folder to [Netlify](https://app.netlify.com/drop)

### Deploy to GitHub Pages

1. Build the static site: `npm run build`
2. Commit the `out` folder and push to your repository
3. Configure GitHub Pages to serve from the `out` directory

## License

This project is created for educational purposes as part of a university project.


# diiem-website
