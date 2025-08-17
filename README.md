# Intelligentable by @shridey

> Intelligentable is a highly customizable, fully-types, performant, and feature-rich React component library built on top of handpicked industry-level production-grade UI Components for modern web applications.

---

## 📦 Installation

```bash
npm install @shridey/intelligentable
```

## Changelog

See the [CHANGELOG](https://github.com/shridey/intelligentable/blob/main/CHANGELOG.md) for all updates and release notes.

---

## 🧠 IntelligentTable

IntelligentTable is a Modern React TypeScript Table Component built on top of Ant Design, providing advanced, smart, and highly customizable table component.

---

## ✨ Features

- 📊 **Automatic Sorting** – Enabled smart sorting by default for numbers, dates, days of week, currencies, percentages, ids and string.
- 📊 **Automatic Summary Row** – Built-in support for sum, average, count, max, and min operations per column.
- 🔍 **Universal Search** – Out-of-the-box search across all columns, or plug in your own custom logic.
- 🧩 **Composable Data Transformation Pipeline** – Chain and compose data transformation steps before rendering.
- 🎨 **Legends** – Dynamic legend generation based on column color rules, with customizable styles.
- 📤 **Export** – Export table data to Excel (XLSX), PDF, JSON, CSV, and TSV formats.
- 🏷️ **Dynamic Cell Coloring** – Apply colors to cells based on value thresholds, string matches, or regex.
- 🌈 **Themeable** – Fully customize every visual aspect of the table, including legends, summary rows, search box, export buttons, and more.
- 🛠️ **Type Safety** – All props and features are fully typed for maximum reliability.

---

## 🚀 Quick Start Example

```tsx
import { IntelligentTable } from "@shridey/intelligentable";
import type { IntelligentTableColumnType } from "@shridey/intelligentable";

function App() {
  const columns: IntelligentTableColumnType[] = [
    {
      title: "Name",
      dataIndex: "name",
      summaryOperation: "count",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      summaryOperation: "sum",
      colorConfig: [
        { min: 0, max: 50000, color: "red" },
        { min: 50000, max: 100000, inclusiveMax: true, color: "green" },
      ],
    },
  ];

  const dataSource = [
    { key: 1, name: "Alice", salary: 40000 },
    { key: 2, name: "Bob", salary: 60000 },
  ];

  return (
    <IntelligentTable
      columns={columns}
      dataSource={dataSource}
      defaultSummary={{ enable: true, fixed: "bottom" }}
      enableLegends
      search={{ enable: true }}
      tableExport={{ enable: true, exportFileName: "MyTable" }}
      tableThemeConfig={{
        legends: { fontSize: "12px" },
      }}
    />
  );
}

export default App;
```

---

## ⚙️ Full Props Reference

| Prop                      | Type                                                                                                          | Description                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `columns`                 | `IntelligentTableColumnType[] (extends AntD's TableColumnType)`                                               | Table columns, supports extra fields: `roundOff`, `colorConfig`, `summaryOperation`, `displaySummaryOperationInSummary` |
| `dataSource`              | `readonly AnyObject[] (AntD's)`                                                                               | Table data                                                                                                              |
| `defaultSummary`          | `{ enable?: boolean; fixed?: "top" \| "bottom" }`                                                             | Enables built-in summary row                                                                                            |
| `enableLegends`           | `boolean`                                                                                                     | Show legend box                                                                                                         |
| `search`                  | `{ enable: boolean; placeholder: string; onSearch?: (searchText, row, columns) => boolean }`                  | Built-in search or custom logic                                                                                         |
| `tableExport`             | `{ enable: boolean; exportFileName?: string; pdfFontOptions?: IntelligentTableExportButtonPDFFontOptionsType` | Enables export options                                                                                                  |
| `dataTransform`           | `(ctx: { pipeline }) => AnyObject[]`                                                                          | Chain data transformations                                                                                              |
| `tableThemeConfig`        | `IntelligentTableThemeConfigType (Table Theme from AntD's ThemeConfig)`                                       | Theme customization (legend, searchBox, exportButton etc)                                                               |
| ...other AntD Table props | Supported                                                                                                     | All other props from AntD's `<Table />` are supported                                                                   |

---

...

## 🔢 Automatic Smart Sorting

IntelligentTable automatically detects the data type of each column and applies the most appropriate sorting logic:

- **Numbers:** Sorted numerically
- **Strings:** Sorted alphabetically
- **Dates:** Sorted chronologically
- **Day of Week:** Starting from Sunday to Saturday
- **Currencies, Percentages, IDs:** Sorted by their respective types

**You do not need to specify a sorter manually—IntelligentTable does it for you!**

### Example: Smart Sorting

```tsx
import { IntelligentTable } from "@shridey/intelligentable";
import type { IntelligentTableColumnType } from "@shridey/intelligentable";

const columns: IntelligentTableColumnType[] = [
  {
    title: "Employee ID",
    dataIndex: "id",
    // Smart sorting will sort as numbers
  },
  {
    title: "Name",
    dataIndex: "name",
    // Smart sorting will sort alphabetically
  },
  {
    title: "Joining Date",
    dataIndex: "joiningDate",
    // Smart sorting will sort by date
  },
  {
    title: "Joining Day",
    dataIndex: "joiningDay",
    // Smart sorting will sort by day of week
  },
  {
    title: "Salary",
    dataIndex: "salary",
    // Smart sorting will sort numerically
  },
];

const dataSource = [
  { key: 1, id: 101, name: "Alice", joiningDate: "2022-01-15", salary: 40000 },
  { key: 2, id: 102, name: "Bob", joiningDate: "2021-11-03", salary: 60000 },
];

<IntelligentTable columns={columns} dataSource={dataSource} />;
```

### Overriding Smart Sorting with a Custom Sorter

If you want to override the automatic sorting for a column, simply provide your own `sorter` function:

```tsx
const columns: IntelligentTableColumnType[] = [
  {
    title: "Name",
    dataIndex: "name",
    // Override smart sorting with custom sorter
    sorter: (a, b) => a.name.length - b.name.length, // Sort by name length
  },
  // ...other columns
];
```

---

## 🧮 Summary Operations

Set via `summaryOperation` in column:

- `"sum"` – total
- `"average"` – mean
- `"count"` – count
- `"max"` – max value
- `"min"` – min value

**Example:**

```ts
{
  title: "Score",
  dataIndex: "score",
  summaryOperation: "average",
}
```

---

## 🎨 Dynamic Cell Coloring & Legends

Add dynamic coloring rules to columns:

```ts
colorConfig: [
  { min: 0, max: 50, color: "red" },
  { min: 50, max: 100, inclusiveMax: true, color: "green" },
  { str: "Pending", color: "orange" },
  { regEx: "^Error", color: "red" },
];
```

Legends are automatically generated and displayed when `enableLegends` is true.

---

## 🔍 Universal Search

Enable built-in search or provide your own logic:

```tsx
<IntelligentTable
  defaultUniversalSearch={{
    enable: true,
    onSearch: (searchText, row, columns) =>
      columns.some((col) => String(row[col.dataIndex]).includes(searchText)),
  }}
  // ...
/>
```

---

## 📤 Export

Export table data to:

- Excel (xlsx)
- PDF
- JSON
- CSV
- TSV

Enable via `tableExport` prop:

```tsx
import NotoSans from "@/assets/fonts/NotoSans-Regular.ttf";

<IntelligentTable
  tableExport={{
    enable: true,
    exportFileName: "Report",
    pdfFontOptions: {
      // Optional
      fontUrl: NotoSans,
      fontName: "NotoSans",
      fontFileName: "NotoSans-Regular.ttf",
      fontStyles: ["normal", "bold"],
      fallbackFont: "helvetiva", // Default
    },
  }}
  // ...
/>;
```

---

## 🧩 Data Transformation Pipeline

Chain multiple data transformation steps before rendering:

```tsx
<IntelligentTable
  dataTransform={({ pipeline }) =>
    pipeline([
      (data) => data.filter((row) => row.active),
      (data) => data.sort((a, b) => a.score - b.score),
      // ...other transformations
    ])
  }
  // ...
/>
```

---

## 🌈 Theme Customization

Customize table appearance via `tableThemeConfig`:

```tsx
<IntelligentTable
  tableThemeConfig={{
    legends: { fontSize: "14px", backgroundColor: "#f0f0f0" },
    searchBox: { colorText: "#333" },
    exportButton: { defaultBg: "#1890ff", defaultColor: "#fff" },
    defaultSummaryRow: { backgroundColor: "#fafafa", fontWeight: "bold" },
  }}
  // ...
/>
```

---

## 📜 License

[MIT](https://github.com/shridey/intelligentable/blob/main/LICENSE) | Made with ❤️ in Mumbai 🇮🇳

---

## ✨ More IntelligentComponents Coming Soon!

Stay tuned for updates and new components.

---

> _Wanna Talk:_ [Start a discussion](https://github.com/shridey/intelligentable/discussions) or [Create an issue](https://github.com/shridey/intelligentable/issues)
