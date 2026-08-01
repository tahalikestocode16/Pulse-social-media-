import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/auth": { target: "http://localhost:8080" },
      "/posts": { target: "http://localhost:8080" },
      "/comments": { target: "http://localhost:8080" },
      "/profile": { 
        target: "http://localhost:8080",
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes("html")) {
            return "/index.html";
          }
        }
      },
      "/reports": { target: "http://localhost:8080" },
      "/notifications": { target: "http://localhost:8080" },
      "/conversation": { target: "http://localhost:8080" },
      "/messages": { target: "http://localhost:8080" },
      "/users": { target: "http://localhost:8080" },
    },
  },
});