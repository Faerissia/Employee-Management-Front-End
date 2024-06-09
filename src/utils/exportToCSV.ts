import dayjs from "dayjs";

export const exportToCSV = (
  columns: any,
  filteredRows: any,
  selectedRows: any
) => {
  const rowsToExport =
    selectedRows.length > 0
      ? filteredRows.filter((row: any) => selectedRows.includes(row.id))
      : filteredRows;

  const header = columns.map((col: any) => col.headerName).join(",");
  const rows = rowsToExport
    .map((row: any) =>
      columns
        .map((col: any) => {
          let value = row[col.field];
          // Escape commas and quotes in the values
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    )
    .join("\n");

  const csv = `${header}\n${rows}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `employees_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
