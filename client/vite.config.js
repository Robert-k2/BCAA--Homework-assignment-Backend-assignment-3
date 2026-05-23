// import Vite's configuration helper function
import { defineConfig } from 'vite'

// import the official React plugin for Vite
import react from '@vitejs/plugin-react'

// eport the configuration so Vite can read it
export default defineConfig({

  // plugins: Array of plugins that extend Vite’s functionality
  // here we enable React support (JSX, Fast Refresh, etc.)
  plugins: [react()],

  // server: Configuration for the development server
  server: {

    // port: The port number where the dev server will run
    // default is 5173, but you can change it (e.g., 3000, 8080)
    port: 5173
  }

})
