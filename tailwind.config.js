/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Navy institusional — warna utama identitas perpustakaan
        navy: {
          50: '#eef2f7',
          100: '#d7e0ec',
          200: '#aec1d9',
          300: '#7f9dbe',
          400: '#4d729a',
          500: '#2f5679',
          600: '#1f3f5e',
          700: '#173049', // primary navy
          800: '#112536',
          900: '#0b1a26',
        },
        // Biru aksen untuk elemen interaktif (link, tombol, fokus)
        accent: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#84acf7',
          400: '#4f83e8',
          500: '#2c62d6', // primary accent
          600: '#204cb0',
          700: '#1a3d8c',
        },
        // Slate netral untuk latar & teks
        slate: {
          50: '#f8fafc',
          100: '#f1f4f8',
          200: '#e4e9ef',
          300: '#cbd4de',
          400: '#9aa8b8',
          500: '#69798c',
          600: '#4b5a6c',
          700: '#333f4f',
          800: '#212b38',
          900: '#141b24',
        },
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
