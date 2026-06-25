/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Scuderia DIIEM brand colors - Main palette
                primary: '#012245',        // Prussian Blue - Main brand color
                'primary-variant': '#112844', // Prussian Blue variant
                secondary: '#f4792b',      // Pumpkin Spice - Accent/CTA color
                'deep-space': '#202d42',   // Deep Space Blue - Backgrounds
                mocha: '#463b3e',          // Deep Mocha - Text/secondary
                caramel: '#b86432',        // Burnt Caramel - Warm accent
                // Semantic color aliases
                accent: '#f4792b',         // Alias for secondary (Pumpkin Spice)
                'bg-dark': '#202d42',      // Dark background
                'text-primary': '#202d42',  // Primary text on light
                'text-secondary': '#463b3e', // Secondary text
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'sans-serif'], // For headings
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-in-left': 'slideInLeft 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.6s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-30px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(30px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

