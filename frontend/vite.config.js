import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/auth": "http://localhost:8080",
      "/posts": "http://localhost:8080",
      "/comments": "http://localhost:8080",
      "/profile": "http://localhost:8080",
      "/reports": "http://localhost:8080",
      "/notification": "http://localhost:8080",
      "/conversation": "http://localhost:8080",
      "/messages": "http://localhost:8080",
      "/users": "http://localhost:8080",
    },
  },
});