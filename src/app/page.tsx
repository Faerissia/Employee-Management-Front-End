"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  handleGetEmployeeList,
  handleDeleteEmployee,
} from "../api/employeeApi";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SelectChangeEvent } from "@mui/material/Select";
import { exportToCSV } from "@/utils/exportToCSV";
import { isCardExpired } from "@/utils/checkCardExpired";

dayjs.extend(buddhistEra);

const columns: GridColDef[] = [
  { field: "id", headerName: "UUID", width: 170 },
  { field: "first_name", headerName: "ชื่อ", width: 100 },
  { field: "last_name", headerName: "นามสกุล", width: 100 },
  { field: "gender", headerName: "เพศ", width: 50 },
  { field: "birth_day", headerName: "วันเกิด", width: 150 },
  { field: "address", headerName: "ที่อยู่", width: 130 },
  { field: "sub_district", headerName: "ตำบล", width: 130 },
  { field: "district", headerName: "อำเภอ", width: 130 },
  { field: "province", headerName: "จังหวัด", width: 130 },
  { field: "expired_id_card", headerName: "บัตรหมดอายุ", width: 150 },
  { field: "created_date", headerName: "สร้างเมื่อ", width: 180 },
  { field: "updated_date", headerName: "แก้ไขเมื่อ", width: 180 },
];

export default function Home() {
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filterExpired, setFilterExpired] = useState("all");
  const router = useRouter();

  const getList = async () => {
    const res = await handleGetEmployeeList();
    if (res?.data?.length > 0) {
      setEmployeeList(res.data);
    } else {
      setEmployeeList([]);
    }
  };

  const handleCreateClick = () => {
    router.push(`/create`);
  };

  const handleEditClick = () => {
    if (selectedRows.length === 1) {
      router.push(`/update?employee_uuid=${selectedRows[0]}`);
    }
  };

  const handleDeleteClick = () => {
    if (selectedRows.length > 0) {
      setDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    for (const id of selectedRows) {
      await handleDeleteEmployee(String(id));
    }
    setDeleteOpen(false);
    getList();
    toast.success("delete employee successfully!");
  };

  const filteredRows = employeeList
    .filter(
      (item) => filterExpired === "all" || isCardExpired(item.expired_id_card)
    )
    .map((item: any) => ({
      ...item,
      id: item.uuid,
      birth_day: dayjs(item.birth_day).locale("th").format("DD MMMM BBBB"),
      gender: item.gender === 1 ? "ชาย" : item.gender === 2 ? "หญิง" : "อื่นๆ",
      expired_id_card: dayjs(item.expired_id_card)
        .locale("th")
        .format("DD MMMM BBBB"),
      created_date: dayjs(item.created_date)
        .locale("th")
        .format("DD MMMM BBBB HH:mm"),
      updated_date: dayjs(item.updated_date)
        .locale("th")
        .format("DD MMMM BBBB HH:mm"),
    }));

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterExpired(event.target.value);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <main className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen p-8 sm:p-8 flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-center text-indigo-800 drop-shadow-md">
        ระบบจัดการพนักงาน
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mx-auto w-fit max-w-full">
        <div className="mb-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="contained"
              color="success"
              onClick={handleCreateClick}
            >
              เพิ่ม
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleEditClick}
              disabled={selectedRows.length !== 1}
            >
              แก้ไข
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClick}
              disabled={selectedRows.length === 0}
            >
              ลบ
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 200 }}
            >
              <InputLabel>สถานะบัตรประชาชน</InputLabel>
              <Select
                value={filterExpired}
                onChange={handleFilterChange}
                label="สถานะบัตรประชาชน"
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="expired">ใกล้หมดอายุ/หมดอายุ</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={() => exportToCSV(columns, filteredRows, selectedRows)}
            >
              ส่งออก CSV
            </Button>
          </div>
        </div>
        {filteredRows.length > 0 ? (
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            sx={{
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "rgb(224, 231, 255)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgb(199, 210, 254)",
              },
            }}
          />
        ) : (
          <div className="text-center text-gray-600 text-2xl py-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            ไม่พบรายการพนักงาน
          </div>
        )}
      </div>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>ยืนยันการลบพนักงาน</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบพนักงานที่เลือกใช่หรือไม่?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} variant="contained">
            ยกเลิก
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
