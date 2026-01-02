/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}", // include Angular templates and TS files
  ],
  theme: {
    extend: {
      colors: {
        // Dark navy base
        background: {
          default: '#0f1b2b', // main dark navy background
          light: '#152a3f',   // slightly lighter variant
          dark: '#0b121f',    // darker variant for depth
        },
        // Primary accent
        primary: {
          default: '#1E40AF', // vibrant blue
          light: '#3B82F6',   // lighter accent for hover
          dark: '#1E3A8A',    // darker accent for active states
        },
        // Secondary accent
        secondary: {
          default: '#F59E0B', // amber
          light: '#FCD34D',
          dark: '#B45309',
        },
        // Neutral text colors
        text: {
          default: '#E5E7EB', // light gray text
          muted: '#9CA3AF',   // muted gray
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
