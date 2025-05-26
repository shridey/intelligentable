import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.js"),
      name: "IntelligentUI", // UMD global name (change if you want)
      fileName: (format) => `intelligentable.${format}.js`, // consistent naming
    },
    rollupOptions: {
      external: ["react", "react-dom", "antd", "@ant-design/icons"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
          "@ant-design/icons": "icons",
        },
      },
    },
  },
});
