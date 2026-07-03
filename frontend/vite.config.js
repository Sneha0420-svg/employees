

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite'


// export default defineConfig({
//   plugins: [react(),tailwindcss(),],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000', // Ensure this is YOUR backend port
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // YOUR BACKEND PORT
        changeOrigin: true,
        secure: false,
      },
    },
  },
});