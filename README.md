# 🧠 IntelligentTable Component

<!-- ![IntelligentTable Demo](https://demo-image-url.png) -->

A highly customizable, feature-rich React table component built on **Ant Design’s Table**, with intelligent data handling, advanced sorting, filtering, and visualization capabilities.

---

## 🚧 Migration & Roadmap

> 🧪 This project is currently in **beta** while we stabilize the TypeScript-first release. Expect rapid updates, and feel free to contribute or raise issues.

---

## ✨ Features

- ✅ **Smart Data Handling**: Automatically detects and sorts percentages, grades, weekdays, and dates
- 🎨 **Visual Data Representation**: Color-coded cells based on value thresholds
- 🧾 **Automatic Legend Generation**: Dynamically creates legends based on color threshold rules
- 📋 **Excel Ready Copy**: Built-in copy-to-clipboard
- 📱 **Responsive Design**: Adapts to various screen sizes with horizontal scroll
- ♿ **Accessibility Focused**: Keyboard navigable with proper ARIA support
- 🌙 **Dark Mode**: Full compatibility with dark theme implementations
- ⚡ **Performance Optimized**: Supports virtual scrolling for large datasets

---

## 📦 Installation

```bash
npm install @shridey/intelligentable
# or
yarn add  @shridey/intelligentable
```

---

## 🚀 Usage

```jsx
import IntelligentTable from "@shridey/intelligentable";

const columns = [
  {
    title: "Student",
    dataIndex: "studentName",
    operation: "count",
  },
  {
    title: "Performance",
    children: [
      {
        title: "Math",
        dataIndex: "mathScore",
        color: [
          { min: 0, max: 60, color: "#ff4d4f" },
          { min: 60, max: 80, color: "#faad14" },
          { min: 80, max: 101, color: "#52c41a" },
        ],
        operation: "average",
      },
    ],
  },
];

const data = [
  { studentName: "Alice", mathScore: "85%" },
  { studentName: "Bob", mathScore: "72%" },
];

function App() {
  return (
    <IntelligentTable columns={columns} data={data} enableLegends enableCopy />
  );
}
```

---

## 🔧 Props

| Prop            | Type            | Default     | Description                  |
| --------------- | --------------- | ----------- | ---------------------------- |
| `columns`       | `Array<Column>` | `[]`        | Table column configuration   |
| `data`          | `Array<Object>` | `[]`        | Data to display in the table |
| `summaryTitle`  | `string`        | `''`        | Title for the summary row    |
| `instructions`  | `string`        | `''`        | Help text above the table    |
| `loading`       | `boolean`       | `false`     | Shows loading indicator      |
| `pagination`    | `boolean`       | `false`     | Enables pagination controls  |
| `stickyHeader`  | `boolean`       | `false`     | Sticky header on scroll      |
| `enableLegends` | `boolean`       | `false`     | Show color legends           |
| `enableSummary` | `boolean`       | `true`      | Show summary calculation row |
| `enableCopy`    | `boolean`       | `true`      | Enable copy to clipboard     |
| `darkMode`      | `boolean`       | `false`     | Dark theme compatibility     |
| `styles`        | `object`        | `undefined` | Inline style overrides       |

---

## 🧱 Column Configuration

Each column object can include the following properties:

```js
{
  title: 'Column Title',
  dataIndex: 'fieldName',
  operation: 'sum', // or 'average', 'count'
  color: [
    { min: 0, max: 60, color: 'red' },
    { value: 'N/A', color: 'gray' }
  ],
  filter: [
    { min: 0, max: 60, effect: true }
  ],
  sorted: 'asc', // or 'desc'
  width: 150,
}
```

---

## 🛠 Advanced Features

### 🔁 Smart Sorting

- Percentages (`85%`, `90%`)
- Grades (`K`, `1`, ..., `12`)
- Weekdays (`Mon`, `Tue`, ...)
- Dates (various formats)
- Numbers and text (fallback)

### 🎨 Color Thresholds

```js
color: [
  { min: 0, max: 60, color: "#ff4d4f" },
  { min: 60, max: 80, color: "#faad14" },
  { min: 80, max: 101, color: "#52c41a" },
];
```

### 📤 Data Export

- TSV (Tab-Separated Values) export
- Clipboard copy with fallback to file download
- Excel-friendly formatting

### 📊 Summary Row

- Automatic count, sum, average
- Per-column operation setting
- Custom title with `summaryTitle` prop

---

## 🎨 Theming & Customization

### CSS Variables

```css
:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --chart-background: #fafafa;
}
```

### Inline Style Overrides

```jsx
<IntelligentTable
  styles={{
    header: { fontSize: "14px" },
    cell: { padding: "8px" },
  }}
/>
```

---

## ⚡ Performance Tips

For large datasets (1000+ rows):

- ✅ Use **virtual scrolling**
- ✅ Set **fixed column widths**
- ❌ Avoid complex renderers in cells
- ✅ Enable **pagination** if needed

---

## 🌐 Browser Support

| Browser | Supported        |
| ------- | ---------------- |
| Chrome  | ✅ Latest        |
| Firefox | ✅ Latest        |
| Safari  | ✅ Latest        |
| Edge    | ✅ Latest        |
| IE11    | ❌ Not Supported |

---

## 🤝 Contributing

Contributions are welcome!  
Please open an issue to propose changes or features before submitting a pull request.

---

## 📄 License

MIT © Shridhar Pandey
