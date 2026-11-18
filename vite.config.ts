import { defineConfig } from "vite";

// Listen on every interface so a preview proxy in front of the machine can reach the dev server.
export default defineConfig({
  server: { host: "0.0.0.0", port: 5173, strictPort: true, allowedHosts: true },
});
