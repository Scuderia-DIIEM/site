/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV === 'development'

const nextConfig = {
    ...(isDevelopment
        ? {
            skipTrailingSlashRedirect: true,
            async rewrites() {
                return [
                    {
                        source: '/api/:path*',
                        destination: 'http://127.0.0.1/api/:path*',
                    },
                ]
            },
        }
        : { output: 'export' }),
    turbopack: {
        root: __dirname,
    },
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
}

module.exports = nextConfig
