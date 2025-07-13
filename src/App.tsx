import { IntelligentTable } from "./Components/IntelligentTable/IntelligentTable";
import { pivotData } from "./utils/intelligentTable/dataTransformUtils";
import "./App.css";

function App() {
  const tableData = [
    {
      month_name: "August",
      grade: 1,
      avg_present_percentage: 88.04,
    },
    {
      month_name: "January",
      grade: 1,
      avg_present_percentage: 90.82,
    },
    {
      month_name: "June",
      grade: 1,
      avg_present_percentage: 91.83,
    },
    {
      month_name: "May",
      grade: 1,
      avg_present_percentage: 90.62,
    },
    {
      month_name: "October",
      grade: 1,
      avg_present_percentage: 88.73,
    },
    {
      month_name: "September",
      grade: 1,
      avg_present_percentage: 90.81,
    },
    {
      month_name: "December",
      grade: 1,
      avg_present_percentage: 89.5,
    },
    {
      month_name: "February",
      grade: 1,
      avg_present_percentage: 89.61,
    },
    {
      month_name: "April",
      grade: 1,
      avg_present_percentage: 88.95,
    },
    {
      month_name: "March",
      grade: 1,
      avg_present_percentage: 89.61,
    },
    {
      month_name: "July",
      grade: 1,
      avg_present_percentage: 89.65,
    },
    {
      month_name: "November",
      grade: 1,
      avg_present_percentage: 93.06,
    },
    {
      month_name: "August",
      grade: 2,
      avg_present_percentage: 88.25,
    },
    {
      month_name: "November",
      grade: 2,
      avg_present_percentage: 93.19,
    },
    {
      month_name: "May",
      grade: 2,
      avg_present_percentage: 90.15,
    },
    {
      month_name: "July",
      grade: 2,
      avg_present_percentage: 89.23,
    },
    {
      month_name: "June",
      grade: 2,
      avg_present_percentage: 91.77,
    },
    {
      month_name: "April",
      grade: 2,
      avg_present_percentage: 89.14,
    },
    {
      month_name: "September",
      grade: 2,
      avg_present_percentage: 91.19,
    },
    {
      month_name: "October",
      grade: 2,
      avg_present_percentage: 88.38,
    },
    {
      month_name: "January",
      grade: 2,
      avg_present_percentage: 89.72,
    },
    {
      month_name: "February",
      grade: 2,
      avg_present_percentage: 88.93,
    },
    {
      month_name: "December",
      grade: 2,
      avg_present_percentage: 91.25,
    },
    {
      month_name: "March",
      grade: 2,
      avg_present_percentage: 90.37,
    },
    {
      month_name: "December",
      grade: 3,
      avg_present_percentage: 88.9,
    },
    {
      month_name: "May",
      grade: 3,
      avg_present_percentage: 89.69,
    },
    {
      month_name: "April",
      grade: 3,
      avg_present_percentage: 89.18,
    },
    {
      month_name: "June",
      grade: 3,
      avg_present_percentage: 91.28,
    },
    {
      month_name: "March",
      grade: 3,
      avg_present_percentage: 88.58,
    },
    {
      month_name: "August",
      grade: 3,
      avg_present_percentage: 87.74,
    },
    {
      month_name: "October",
      grade: 3,
      avg_present_percentage: 89,
    },
    {
      month_name: "September",
      grade: 3,
      avg_present_percentage: 90.25,
    },
    {
      month_name: "July",
      grade: 3,
      avg_present_percentage: 91.85,
    },
    {
      month_name: "February",
      grade: 3,
      avg_present_percentage: 87.69,
    },
    {
      month_name: "January",
      grade: 3,
      avg_present_percentage: 89.71,
    },
    {
      month_name: "November",
      grade: 3,
      avg_present_percentage: 91.96,
    },
    {
      month_name: "April",
      grade: 4,
      avg_present_percentage: 89.55,
    },
    {
      month_name: "September",
      grade: 4,
      avg_present_percentage: 90.69,
    },
    {
      month_name: "October",
      grade: 4,
      avg_present_percentage: 89.57,
    },
    {
      month_name: "February",
      grade: 4,
      avg_present_percentage: 88.33,
    },
    {
      month_name: "August",
      grade: 4,
      avg_present_percentage: 88.23,
    },
    {
      month_name: "January",
      grade: 4,
      avg_present_percentage: 90.57,
    },
    {
      month_name: "March",
      grade: 4,
      avg_present_percentage: 89.68,
    },
    {
      month_name: "July",
      grade: 4,
      avg_present_percentage: 91.41,
    },
    {
      month_name: "May",
      grade: 4,
      avg_present_percentage: 89.78,
    },
    {
      month_name: "June",
      grade: 4,
      avg_present_percentage: 91.61,
    },
    {
      month_name: "November",
      grade: 4,
      avg_present_percentage: 92.24,
    },
    {
      month_name: "December",
      grade: 4,
      avg_present_percentage: 90.06,
    },
    {
      month_name: "July",
      grade: 5,
      avg_present_percentage: 90.52,
    },
    {
      month_name: "January",
      grade: 5,
      avg_present_percentage: 90.07,
    },
    {
      month_name: "June",
      grade: 5,
      avg_present_percentage: 91.04,
    },
    {
      month_name: "August",
      grade: 5,
      avg_present_percentage: 89.82,
    },
    {
      month_name: "April",
      grade: 5,
      avg_present_percentage: 87.87,
    },
    {
      month_name: "May",
      grade: 5,
      avg_present_percentage: 89.63,
    },
    {
      month_name: "February",
      grade: 5,
      avg_present_percentage: 89.62,
    },
    {
      month_name: "November",
      grade: 5,
      avg_present_percentage: 92.5,
    },
    {
      month_name: "December",
      grade: 5,
      avg_present_percentage: 90.28,
    },
    {
      month_name: "September",
      grade: 5,
      avg_present_percentage: 91.4,
    },
    {
      month_name: "October",
      grade: 5,
      avg_present_percentage: 88.27,
    },
    {
      month_name: "March",
      grade: 5,
      avg_present_percentage: 88.3,
    },
    {
      month_name: "July",
      grade: 6,
      avg_present_percentage: 91.11,
    },
    {
      month_name: "November",
      grade: 6,
      avg_present_percentage: 92.27,
    },
    {
      month_name: "March",
      grade: 6,
      avg_present_percentage: 89.28,
    },
    {
      month_name: "September",
      grade: 6,
      avg_present_percentage: 91.28,
    },
    {
      month_name: "December",
      grade: 6,
      avg_present_percentage: 90.09,
    },
    {
      month_name: "February",
      grade: 6,
      avg_present_percentage: 88.74,
    },
    {
      month_name: "January",
      grade: 6,
      avg_present_percentage: 89.76,
    },
    {
      month_name: "August",
      grade: 6,
      avg_present_percentage: 89.91,
    },
    {
      month_name: "October",
      grade: 6,
      avg_present_percentage: 87.93,
    },
    {
      month_name: "June",
      grade: 6,
      avg_present_percentage: 91.23,
    },
    {
      month_name: "April",
      grade: 6,
      avg_present_percentage: 87.11,
    },
    {
      month_name: "May",
      grade: 6,
      avg_present_percentage: 89.03,
    },
    {
      month_name: "May",
      grade: 7,
      avg_present_percentage: 89.66,
    },
    {
      month_name: "September",
      grade: 7,
      avg_present_percentage: 91.67,
    },
    {
      month_name: "April",
      grade: 7,
      avg_present_percentage: 87.66,
    },
    {
      month_name: "January",
      grade: 7,
      avg_present_percentage: 90.41,
    },
    {
      month_name: "July",
      grade: 7,
      avg_present_percentage: 89.76,
    },
    {
      month_name: "October",
      grade: 7,
      avg_present_percentage: 88.35,
    },
    {
      month_name: "February",
      grade: 7,
      avg_present_percentage: 89.18,
    },
    {
      month_name: "December",
      grade: 7,
      avg_present_percentage: 90.07,
    },
    {
      month_name: "June",
      grade: 7,
      avg_present_percentage: 90.73,
    },
    {
      month_name: "March",
      grade: 7,
      avg_present_percentage: 88.66,
    },
    {
      month_name: "November",
      grade: 7,
      avg_present_percentage: 91.44,
    },
    {
      month_name: "August",
      grade: 7,
      avg_present_percentage: 90.34,
    },
    {
      month_name: "July",
      grade: 8,
      avg_present_percentage: 88.63,
    },
    {
      month_name: "January",
      grade: 8,
      avg_present_percentage: 89.84,
    },
    {
      month_name: "August",
      grade: 8,
      avg_present_percentage: 90.01,
    },
    {
      month_name: "April",
      grade: 8,
      avg_present_percentage: 87.83,
    },
    {
      month_name: "December",
      grade: 8,
      avg_present_percentage: 88.85,
    },
    {
      month_name: "June",
      grade: 8,
      avg_present_percentage: 91.5,
    },
    {
      month_name: "May",
      grade: 8,
      avg_present_percentage: 88.77,
    },
    {
      month_name: "September",
      grade: 8,
      avg_present_percentage: 91.39,
    },
    {
      month_name: "November",
      grade: 8,
      avg_present_percentage: 91.22,
    },
    {
      month_name: "October",
      grade: 8,
      avg_present_percentage: 87.67,
    },
    {
      month_name: "February",
      grade: 8,
      avg_present_percentage: 89.34,
    },
    {
      month_name: "March",
      grade: 8,
      avg_present_percentage: 88.53,
    },
    {
      month_name: "August",
      grade: 9,
      avg_present_percentage: 88.68,
    },
    {
      month_name: "December",
      grade: 9,
      avg_present_percentage: 89.51,
    },
    {
      month_name: "July",
      grade: 9,
      avg_present_percentage: 90.32,
    },
    {
      month_name: "September",
      grade: 9,
      avg_present_percentage: 92.97,
    },
    {
      month_name: "March",
      grade: 9,
      avg_present_percentage: 91.04,
    },
    {
      month_name: "April",
      grade: 9,
      avg_present_percentage: 88.47,
    },
    {
      month_name: "May",
      grade: 9,
      avg_present_percentage: 88.74,
    },
    {
      month_name: "October",
      grade: 9,
      avg_present_percentage: 89.08,
    },
    {
      month_name: "February",
      grade: 9,
      avg_present_percentage: 89.75,
    },
    {
      month_name: "November",
      grade: 9,
      avg_present_percentage: 92.84,
    },
    {
      month_name: "June",
      grade: 9,
      avg_present_percentage: 92.51,
    },
    {
      month_name: "January",
      grade: 9,
      avg_present_percentage: 90.42,
    },
    {
      month_name: "May",
      grade: 10,
      avg_present_percentage: 89.97,
    },
    {
      month_name: "April",
      grade: 10,
      avg_present_percentage: 88.56,
    },
    {
      month_name: "September",
      grade: 10,
      avg_present_percentage: 93.28,
    },
    {
      month_name: "June",
      grade: 10,
      avg_present_percentage: 92.03,
    },
    {
      month_name: "December",
      grade: 10,
      avg_present_percentage: 90.04,
    },
    {
      month_name: "July",
      grade: 10,
      avg_present_percentage: 89.91,
    },
    {
      month_name: "February",
      grade: 10,
      avg_present_percentage: 89.84,
    },
    {
      month_name: "August",
      grade: 10,
      avg_present_percentage: 88.98,
    },
    {
      month_name: "November",
      grade: 10,
      avg_present_percentage: 93.57,
    },
    {
      month_name: "March",
      grade: 10,
      avg_present_percentage: 90.58,
    },
    {
      month_name: "January",
      grade: 10,
      avg_present_percentage: 90.06,
    },
    {
      month_name: "October",
      grade: 10,
      avg_present_percentage: 89.23,
    },
    {
      month_name: "April",
      grade: 11,
      avg_present_percentage: 88.23,
    },
    {
      month_name: "March",
      grade: 11,
      avg_present_percentage: 90.4,
    },
    {
      month_name: "December",
      grade: 11,
      avg_present_percentage: 89.7,
    },
    {
      month_name: "September",
      grade: 11,
      avg_present_percentage: 93.93,
    },
    {
      month_name: "June",
      grade: 11,
      avg_present_percentage: 92.32,
    },
    {
      month_name: "February",
      grade: 11,
      avg_present_percentage: 90.16,
    },
    {
      month_name: "May",
      grade: 11,
      avg_present_percentage: 89.75,
    },
    {
      month_name: "November",
      grade: 11,
      avg_present_percentage: 93.19,
    },
    {
      month_name: "July",
      grade: 11,
      avg_present_percentage: 91.56,
    },
    {
      month_name: "August",
      grade: 11,
      avg_present_percentage: 88.85,
    },
    {
      month_name: "January",
      grade: 11,
      avg_present_percentage: 89.97,
    },
    {
      month_name: "October",
      grade: 11,
      avg_present_percentage: 88.52,
    },
    {
      month_name: "January",
      grade: 12,
      avg_present_percentage: 90.63,
    },
    {
      month_name: "July",
      grade: 12,
      avg_present_percentage: 91.88,
    },
    {
      month_name: "October",
      grade: 12,
      avg_present_percentage: 88.99,
    },
    {
      month_name: "September",
      grade: 12,
      avg_present_percentage: 93.58,
    },
    {
      month_name: "December",
      grade: 12,
      avg_present_percentage: 89.69,
    },
    {
      month_name: "May",
      grade: 12,
      avg_present_percentage: 91.33,
    },
    {
      month_name: "August",
      grade: 12,
      avg_present_percentage: 88.62,
    },
    {
      month_name: "April",
      grade: 12,
      avg_present_percentage: 89.1,
    },
    {
      month_name: "June",
      grade: 12,
      avg_present_percentage: 91.27,
    },
    {
      month_name: "March",
      grade: 12,
      avg_present_percentage: 90.6,
    },
    {
      month_name: "February",
      grade: 12,
      avg_present_percentage: 90.71,
    },
    {
      month_name: "November",
      grade: 12,
      avg_present_percentage: 93.35,
    },
    {
      month_name: "December",
      grade: 91,
      avg_present_percentage: 89.77,
    },
    {
      month_name: "November",
      grade: 91,
      avg_present_percentage: 93.01,
    },
    {
      month_name: "September",
      grade: 91,
      avg_present_percentage: 90.79,
    },
    {
      month_name: "April",
      grade: 91,
      avg_present_percentage: 88.66,
    },
    {
      month_name: "May",
      grade: 91,
      avg_present_percentage: 90.56,
    },
    {
      month_name: "March",
      grade: 91,
      avg_present_percentage: 89.84,
    },
    {
      month_name: "July",
      grade: 91,
      avg_present_percentage: 90.58,
    },
    {
      month_name: "August",
      grade: 91,
      avg_present_percentage: 87.75,
    },
    {
      month_name: "January",
      grade: 91,
      avg_present_percentage: 89.33,
    },
    {
      month_name: "June",
      grade: 91,
      avg_present_percentage: 91.29,
    },
    {
      month_name: "February",
      grade: 91,
      avg_present_percentage: 89.73,
    },
    {
      month_name: "October",
      grade: 91,
      avg_present_percentage: 88.95,
    },
  ];

  const monthOrder = [
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  return (
    <IntelligentTable
      columns={[
        {
          title: "Grade",
          key: "grade",
          dataIndex: "grade",
          ellipsis: true,
          sorter: (a, b) => {
            const gA = a.grade === "K" ? 0 : parseInt(a.grade, 10);
            const gB = b.grade === "K" ? 0 : parseInt(b.grade, 10);
            return gA - gB;
          },
        },
        ...monthOrder.map((month_name) => ({
          title: month_name.slice(0, 3),
          key: month_name,
          ellipsis: true,
          colorConfig: [
            {
              max: 90,
              color: "red",
            },
            {
              min: 93,
              color: "green",
            },
          ],
          dataIndex: month_name,
          roundOff: 1,
          summaryOperation: "average" as const,
        })),
        {
          title: "Average",
          ellipsis: true,
          key: "average",
          colorConfig: [
            {
              max: 90,
              color: "red",
            },
            {
              min: 93,
              color: "green",
            },
          ],
          dataIndex: "average",
          roundOff: 1,
          summaryOperation: "average",
        },
      ]}
      defaultUniversalSearch={{
        enable: true,
      }}
      virtual
      tableThemeConfig={{
        padding: 6,
      }}
      defaultSummary={{
        enable: true,
        fixed: "bottom",
      }}
      enableLegends
      tableExport={{
        enable: true,
        exportFileName: "grades_report",
      }}
      scroll={{
        x: 1200,
        y: 300,
      }}
      pagination={false}
      dataSource={tableData}
      dataTransform={({ pipeline }) =>
        pipeline([
          (data) =>
            data.map((item) => ({
              ...item,
              grade: item.grade === 91 ? "K" : item.grade,
            })),
          (data) =>
            pivotData(data, {
              rowKey: "grade",
              pivotKey: "month_name",
              valueField: "avg_present_percentage",
              transformValue: (value) => `${value as number}%`,
              orderedPivotKeys: monthOrder,
              addAverageField: true,
            }),
          (data) =>
            data.sort((a, b) => {
              const gA = a.grade === "K" ? 0 : parseInt(a.grade, 10);
              const gB = b.grade === "K" ? 0 : parseInt(b.grade, 10);
              return gA - gB;
            }),
        ])
      }
    />
  );
}

export default App;
