export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#8a2be2', // Ungu utama
        'primary-light': '#9d4edd',
        'dark-color': '#2b2d42', // Teks
        'light-color': '#f8f9fa', // Background ringan
        'gray-color': '#6c757d', // Teks abu-abu
      },
      // ... extensions lain jika diperlukan
    },
  },
  plugins: [],
}
