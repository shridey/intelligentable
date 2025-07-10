import { Button, Dropdown, type MenuProps } from "antd";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import type { IntelligentTableExportButtonProps } from "@/types/IntelligentTable/IntelligentTableExportButtonProps";
import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { AnyObject } from "antd/es/_util/type";
import NotoSansFont from "@/assets/fonts/NotoSans-Regular.ttf";
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

const registerNotoSansFont = async (doc: jsPDF) => {
  try {
    // 1. Fetch the font file
    const response = await fetch(NotoSansFont);
    const fontBlob = await response.blob();

    // 2. Read as base64
    const base64Font = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(fontBlob);
    }).then((dataUrl) => dataUrl.split(",")[1]); // Extract base64 part

    // 3. Register the font
    doc.addFileToVFS("NotoSans-Regular.ttf", base64Font);
    doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
    doc.addFont("NotoSans-Regular.ttf", "NotoSans", "bold");
    doc.setFont("NotoSans");
  } catch (error) {
    console.error("Failed to load NotoSans font:", error);
    // Fallback to standard font
    doc.setFont("helvetica");
  }
};

const exportTable = async (
  data: readonly AnyObject[] | undefined,
  columns: IntelligentTableColumnType[],
  format: "csv" | "tsv" | "xlsx" | "json" | "pdf",
  fileName: string
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
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Add headers
      worksheet.addRow(headers);

      // Style headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };

      // Add data
      (data as AnyObject[]).forEach((row) => {
        const rowData = dataKeys.map((key) => row[key]);
        worksheet.addRow(rowData);
      });

      // Auto-fit columns
      worksheet.columns = headers.map((_, colIndex) => ({
        width:
          Math.max(
            15, // Minimum width
            ...(data as AnyObject[]).map((row) => {
              const value = row[dataKeys[colIndex]];
              return value ? String(value).length : 0;
            }),
            headers[colIndex].length
          ) + 2, // Add some padding
      }));

      // Generate buffer and save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, generateFileName(fileName || "table-export", "xlsx"));
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

      await registerNotoSansFont(doc);

      // Use the directly imported autoTable function
      autoTable(doc, {
        head: [headers],
        body: pdfData,
        styles: {
          font: "NotoSans",
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [70, 130, 180], // Steel blue
          textColor: 255, // White text
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
}: IntelligentTableExportButtonProps) => {
  const handleMenuClick = (key: string) => {
    exportTable(
      data,
      columns,
      key as "csv" | "tsv" | "xlsx" | "json" | "pdf",
      exportFileName
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
