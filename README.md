# Intelligentable by @shridey

> I believe that UI can be intelligent, so I select the components from the top UI libraries exists out there, and make them smarter, by adding features that they must have as a component.

---

### 📦 Installation

```bash
npm install @shridey/intelligentable
```

---

## 🧠 IntelligentTable

> The first component of the **Intelligentable** library – built to make your tables not just pretty, but _smart_.

A powerful React TypeScript table component on top of **Ant Design** with important built-in features.

---

### ✨ Features

- 🌈 **Themeable** – fully customize each visual components
- 📊 **Automatic summary row** – sum, average, count, max, min
- 🔍 **Universal search** – out of the box or bring your own logic
- 🎨 **Legend colors** – based on dynamic rules
- 📤 **Export** – to Excel, PDF, JSON, CSV, TSV
- 🧩 **Composable** – plug in data transformations

---

### 🚀 Usage

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
      defaultUniversalSearch={{ enable: true }}
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

### ⚙️ Props (extended)

| Prop                     | Type                                                                    | Description                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `columns`                | `IntelligentTableColumnType[]`                                          | Same as AntD, but with extra fields: `roundOff`, `colorConfig`, `summaryOperation`, `displaySummaryOperationInSummary` |
| `dataSource`             | `readonly AnyObject[]`                                                  | Table data                                                                                                             |
| `defaultSummary`         | `{ enable?: boolean; fixed?: "top" \| "bottom" }`                       | Enables built-in summary row                                                                                           |
| `enableLegends`          | `boolean`                                                               | Show legend box                                                                                                        |
| `defaultUniversalSearch` | `{ enable: boolean; onSearch?: (searchText, row, columns) => boolean }` | Built-in search or custom logic                                                                                        |
| `tableExport`            | `{ enable: boolean; exportFileName?: string }`                          | Enables export options                                                                                                 |
| `dataTransform`          | `(ctx: { pipeline }) => AnyObject[]`                                    | Chain data transformations                                                                                             |
| `tableThemeConfig`       | `IntelligentTableThemeConfigType`                                       | Theme customization (legend, searchBox, exportButton etc)                                                              |

All other props from AntD `<Table />` are supported.

---

### 🧮 Summary operations

- `"sum"` – total
- `"average"` – mean
- `"count"` – count
- `"max"` – max value
- `"min"` – min value

Set via `summaryOperation` in column.

---

### 🎨 Legend colors

Add dynamic coloring rules:

```ts
colorConfig: [
  { min: 0, max: 50, color: "red" },
  { min: 50, max: 100, inclusiveMax: true, color: "green" },
];
```

Set via `colorConfig` in column.

---

### 📤 Export

Export to:

- Excel (xlsx)
- PDF
- JSON
- CSV
- TSV

Enable via `tableExport` prop.

---

## 📜 License

MIT © @shridey | Made with ❤️ in Mumbai 🇮🇳

---

## ✨ Next: more IntelligentComponents coming soon!

Stay tuned...

---

> _Questions, suggestions?_
> Create an issue or discuss on GitHub! 🚀
