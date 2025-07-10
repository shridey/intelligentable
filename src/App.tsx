import "./App.css";
import { IntelligentTable } from "./Components/IntelligentTable/IntelligentTable";

function App() {
  return (
    <IntelligentTable
      columns={[
        {
          title: "ID",
          key: "id",
          dataIndex: "id",
        },
        {
          title: "Name",
          key: "name",
          children: [
            {
              title: "First Name",
              key: "firstName",
              dataIndex: "firstName",
            },
            {
              title: "Middle Name",
              key: "middleName",
              dataIndex: "middleName",
            },
            {
              title: "Last Name",
              key: "lastName",
              dataIndex: "lastName",
            },
          ],
        },
        {
          title: "Age",
          key: "age",
          dataIndex: "age",
        },
        {
          title: "Date of Birth",
          key: "dateOfBirth",
          dataIndex: "dateOfBirth",
        },
        {
          title: "Day of Birth",
          key: "dayOfBirth",
          dataIndex: "dayOfBirth",
        },
        {
          title: "Per Year Revenue",
          key: "perYearRevenue",
          dataIndex: "perYearRevenue",
          summaryOperation: "min",
        },
      ]}
      dataSource={[
        {
          key: "1",
          id: "ID-01",
          firstName: "Shridhar",
          middleName: "Sachidanand",
          lastName: "Pandey",
          age: "23",
          dateOfBirth: "15/08/2002",
          dayOfBirth: "Monday",
          perYearRevenue: "₹3,00,000",
        },
        {
          key: "2",
          id: "ID-02",
          firstName: "Shridhar",
          middleName: "Sachidanand",
          lastName: "Pandey",
          age: "23",
          dateOfBirth: "12/08/2002",
          dayOfBirth: "Tuesday",
          perYearRevenue: "₹2,00,000",
        },
        {
          key: "3",
          id: "ID-03",
          firstName: "Shridhar",
          middleName: "Sachidanand",
          lastName: "Pandey",
          age: "23",
          dateOfBirth: "21/08/2002",
          dayOfBirth: "Wednesday",
          perYearRevenue: "₹6,00,000",
        },
        {
          key: "4",
          id: "ID-04",
          firstName: "Shridhar",
          middleName: "Sachidanand",
          lastName: "Pandey",
          age: "23",
          dateOfBirth: "15/08/1999",
          dayOfBirth: "Thursday",
          perYearRevenue: "₹4,00,000",
        },
        {
          key: "5",
          id: "ID-05",
          firstName: "Shridhar",
          middleName: "Sachidanand",
          lastName: "Pandey",
          age: "22",
          dateOfBirth: "15/06/2002",
          dayOfBirth: "Friday",
          perYearRevenue: "₹12,00,000",
        },
        {
          key: "6",
          id: "ID-06",
          firstName: "Shridhar",
          middleName: "Sachidanand",
          lastName: "Pandey",
          age: "24",
          dateOfBirth: "15/10/2002",
          dayOfBirth: "Saturday",
          perYearRevenue: "₹9,00,000",
        },
      ]}
      enableDefaultSummary
      tableExport={{
        enable: true,
      }}
      defaultUniversalSearch={{
        enable: true,
      }}
    />
  );
}

export default App;
