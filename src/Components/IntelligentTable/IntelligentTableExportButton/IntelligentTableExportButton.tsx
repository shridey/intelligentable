import { Button, Dropdown, type MenuProps } from "antd";
import writeXlsxFile from "write-excel-file";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import type { AnyObject } from "antd/es/_util/type";
import type { IntelligentTableExportButtonProps } from "../../../types/IntelligentTable/IntelligentTableExportButtonProps";
import type { IntelligentTableColumnType } from "../../../types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableExportButtonPDFFontOptionsType } from "../../../types/IntelligentTable/IntelligentTableExportButtonPDFFontOptionsType";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const generateFileName = (base: string, extension: string) => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const timePart = `${pad(now.getHours())}-${pad(now.getMinutes())}`;

  return `${base}-${datePart}_${timePart}.${extension}`;
};

const exportDelimited = (
  data: readonly AnyObject[] | undefined,
  columns: IntelligentTableColumnType[],
  delimiter: "," | "\t"
): string => {
  const visibleColumns = columns.filter((col) => col.title);
  const headers = visibleColumns.map((col) => col.title as string);
  const dataKeys = visibleColumns.map((col) => col.dataIndex as string);

  const rows = (data as AnyObject[]).map((row) =>
    dataKeys
      .map((key) => {
        const value = row[key];
        if (value == null) return "";

        const stringValue = String(value);
        return typeof value === "string" &&
          (stringValue.includes(delimiter) || stringValue.includes("\n"))
          ? `"${stringValue.replace(/"/g, '""')}"` // Escape quotes
          : stringValue;
      })
      .join(delimiter)
  );

  return [headers.join(delimiter), ...rows].join("\n");
};

const registerCustomFont = async (
  doc: jsPDF,
  options: {
    fontUrl?: string;
    fontFileName?: string;
    fontName?: string;
    fontStyles?: string[];
    fallbackFont?: string;
  } = {}
) => {
  const {
    fontUrl,
    fontFileName = "",
    fontName = "",
    fontStyles = [],
    fallbackFont = "helvetica",
  } = options;

  if (!fontUrl) {
    doc.setFont(fallbackFont);
    return;
  }
  try {
    const response = await fetch(fontUrl);
    const fontBlob = await response.blob();
    const base64Font = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(fontBlob);
    }).then((dataUrl) => dataUrl.split(",")[1]);
    doc.addFileToVFS(fontFileName, base64Font);
    fontStyles.forEach((style) => {
      doc.addFont(fontFileName, fontName, style);
    });
    doc.setFont(fontName);
  } catch (error) {
    console.error(`Failed to load custom font (${fontFileName}):`, error);
    doc.setFont(fallbackFont);
  } finally {
    console.log(doc.getFontList());
  }
};

const exportTable = async (
  data: readonly AnyObject[] | undefined,
  columns: IntelligentTableColumnType[],
  format: "csv" | "tsv" | "xlsx" | "json" | "pdf",
  fileName: string,
  pdfFontOptions?: IntelligentTableExportButtonPDFFontOptionsType
): Promise<void> => {
  const visibleColumns = columns.filter((col) => col.title);
  const headers = visibleColumns.map((col) => col.title as string);
  const dataKeys = visibleColumns.map((col) => col.dataIndex as string);

  switch (format) {
    case "csv": {
      const csv = exportDelimited(data, columns, ",");
      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, generateFileName(fileName || "table-export", "csv"));
      break;
    }

    case "tsv": {
      const tsv = exportDelimited(data, columns, "\t");
      const blob = new Blob(["\uFEFF" + tsv], {
        type: "text/tab-separated-values;charset=utf-8;",
      });
      saveAs(blob, generateFileName(fileName || "table-export", "tsv"));
      break;
    }

    case "xlsx": {
      // Convert data to array of objects (if needed)
      const rows = (data as AnyObject[]).map((row) => {
        const obj: Record<string, string | number> = {};
        dataKeys.forEach((key, index) => {
          obj[headers[index]] = row[key] ?? "";
        });
        return obj;
      });

      // Define schema (mapping headers to data keys)
      const schema = headers.map((header) => ({
        column: header,
        type: String, // Force all values to strings
        value: (row: Record<string, string | number>) =>
          String(row[header] ?? ""),
      }));

      await writeXlsxFile(rows, {
        schema,
        fileName: generateFileName(fileName || "table-export", "xlsx"),
      });
      break;
    }

    case "json": {
      const jsonData = (data as AnyObject[]).map((row) => {
        const obj: Record<string, unknown> = {};
        dataKeys.forEach((key, index) => {
          obj[headers[index]] = row[key];
        });
        return obj;
      });

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, generateFileName(fileName || "table-export", "json"));
      break;
    }

    case "pdf": {
      const visibleColumns = columns.filter((col) => col.title);
      const headers = visibleColumns.map((col) => col.title as string);
      const dataKeys = visibleColumns.map((col) => col.dataIndex as string);

      const pdfData = (data as AnyObject[]).map((row) =>
        dataKeys.map((key) => {
          const value = row[key];
          return value != null ? String(value) : "";
        })
      );

      const doc = new jsPDF({ orientation: "landscape" });

      await registerCustomFont(doc, pdfFontOptions);

      // Use the directly imported autoTable function
      autoTable(doc, {
        head: [headers],
        body: pdfData,
        styles: {
          font: pdfFontOptions?.fontName,
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [70, 130, 180],
          textColor: 255,
          fontStyle: "bold",
        },
        margin: { top: 10 },
      });

      doc.save(generateFileName(fileName || "table-export", "pdf"));
      break;
    }
  }
};

export const IntelligentTableExportButton = ({
  data = [],
  columns = [],
  exportFileName = "",
  pdfFontOptions = {
    fontUrl: "",
    fontFileName: "",
    fontName: "",
    fontStyles: [],
    fallbackFont: "helvetica",
  },
}: IntelligentTableExportButtonProps) => {
  const handleMenuClick = (key: string) => {
    exportTable(
      data,
      columns,
      key as "csv" | "tsv" | "xlsx" | "json" | "pdf",
      exportFileName,
      pdfFontOptions
    );
  };

  const items: MenuProps["items"] = [
    {
      key: "pdf",
      label: "PDF",
      icon: <FilePdfOutlined />,
      onClick: () => handleMenuClick("pdf"),
    },
    {
      key: "xlsx",
      label: "Excel (XLSX)",
      icon: <FileExcelOutlined />,
      onClick: () => handleMenuClick("xlsx"),
    },
    {
      key: "json",
      label: "JSON",
      icon: <FileTextOutlined />,
      onClick: () => handleMenuClick("json"),
    },
    {
      key: "tsv",
      label: "TSV",
      icon: <FileTextOutlined />,
      onClick: () => handleMenuClick("tsv"),
    },
    {
      key: "csv",
      label: "CSV",
      icon: <FileTextOutlined />,
      onClick: () => handleMenuClick("csv"),
    },
  ].filter(Boolean) as MenuProps["items"];

  return (
    <Dropdown menu={{ items }} trigger={["hover"]}>
      <Button size="middle" icon={<DownloadOutlined />} iconPosition="end">
        Export
      </Button>
    </Dropdown>
  );
};
