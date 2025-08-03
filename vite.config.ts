import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import pkg from "./package.json";

const peerDeps = Object.keys(pkg.peerDependencies || {});
const external = (id: string) =>
  peerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)) ||
  id === "react/jsx-runtime";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "intelligentable",
      formats: ["es", "umd", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external,
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
          "@ant-design/icons": "icons",
          "write-excel-file": "writeXlsxFile",
          "file-saver": "saveAs",
          jspdf: "jsPDF",
          "jspdf-autotable": "jsPDFAutoTable",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});
