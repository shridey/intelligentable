import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      // NOTE: If you're using TS, change this to index.ts when ready
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "IntelligentUI",
      formats: ["es", "umd"],
      fileName: (format) => `intelligentable.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "antd",
        "@ant-design/icons",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
          "@ant-design/icons": "icons",
          "react-router-dom": "ReactRouterDOM",
        },
      },
    },
  },
});
