import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "intelligentable",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // Add all peer dependencies here
      external: [
        "react",
        "react-dom",
        "antd",
        "@ant-design/icons",
        "exceljs",
        "file-saver",
        "jspdf",
        "jspdf-autotable",
      ],
      output: {
        globals: {
          // Define global variable names for UMD build
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
          "@ant-design/icons": "icons",
          exceljs: "ExcelJS",
          "file-saver": "saveAs",
          jspdf: "jsPDF",
          "jspdf-autotable": "jsPDFAutoTable",
        },
      },
    },
  },
});
