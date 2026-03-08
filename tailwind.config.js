/**** Tailwind config with AstroVeda cosmic theme ****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './sections/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          purple: '#1e1b4b',
          indigo: '#2e1065'
        },
        gold: {
          DEFAULT: '#facc15',
          soft: 'rgba(250, 204, 21, 0.15)'
        },
        glass: 'rgba(255,255,255,0.05)'
      },
      backgroundImage: {
        starfield: 'radial-gradient(1200px 600px at 0% 0%, rgba(250,204,21,0.06), transparent 50%), radial-gradient(900px 500px at 100% 100%, rgba(37,99,235,0.15), transparent 50%)'
      },
      boxShadow: {
        glow: '0 0 20px rgba(250,204,21,0.25)',
        glass: '0 8px 30px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        poppins: ['var(--font-poppins)']
      }
    }
  },
  plugins: [],
}
