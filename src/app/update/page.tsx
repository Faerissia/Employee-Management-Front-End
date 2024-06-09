// pages/edit-employee.tsx or app/edit-employee/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleUpdateEmployee, handleGetEmployee } from "../../api/employeeApi";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import dayjs from "dayjs";
import "dayjs/locale/th";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.locale("th");

import {
  getProvince,
  getDistrict,
  getSubDistrict,
} from "@/api/thaiProvinceDataApi";

import {
  ProvinceType,
  DistrictType,
  SubDistrictType,
} from "@/types/provinceType";
import toast from "react-hot-toast";

const genderSelect = [
  { label: "ชาย", value: 1 },
  { label: "หญิง", value: 2 },
  { label: "อื่นๆ", value: 3 },
];

export default function EditEmployee() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get("employee_uuid");
  const [employee, setEmployee] = useState<any>(null);
  const [province, setProvince] = useState<ProvinceType[]>([]);
  const [district, setDistrict] = useState<DistrictType[]>([]);
  const [subDistrict, setSubDistrict] = useState<SubDistrictType[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(Number);
  const [selectedDistrictId, setSelectedDistrictId] = useState(Number);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [birthDate, setBirthDate] = useState<dayjs.Dayjs | null>(null);
  const [expiryDate, setExpiryDate] = useState<dayjs.Dayjs | null>(null);

  const getProvinceList = async () => {
    const province: any = await getProvince();
    setProvince(province?.data);
  };

  const getDistrictList = async () => {
    if (!selectedProvinceId) return;
    const district: any = await getDistrict();
    const filter_district = district?.data.filter(
      (item: any) => item.province_id === selectedProvinceId
    );
    setDistrict(filter_district);
  };

  const getSubDistrictList = async () => {
    if (!selectedDistrictId) return;
    const sub_district: any = await getSubDistrict();
    const filter_sub_district = sub_district?.data.filter(
      (item: any) => item.amphure_id === selectedDistrictId
    );
    setSubDistrict(filter_sub_district);
  };

  useEffect(() => {
    getProvinceList();
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      getDistrictList();
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedDistrictId) {
      getSubDistrictList();
    }
  }, [selectedDistrictId]);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (uuid) {
        const data = await handleGetEmployee(uuid);
        setEmployee(data?.data);
        if (data?.data) {
          setBirthDate(dayjs(data.data.birth_day));
          setExpiryDate(dayjs(data.data.expired_id_card));
        }
      }
    };
    fetchEmployee();
  }, [uuid]);

  useEffect(() => {
    if (employee && province.length > 0) {
      const initialProvince = province.find(
        (item: any) => item.name_th === employee.province
      );
      if (initialProvince) {
        setSelectedProvinceId(initialProvince.id);
        setSelectedProvince(initialProvince.name_th);
      }
    }
  }, [employee, province]);

  useEffect(() => {
    if (employee && district.length > 0) {
      const initialDistrict = district.find(
        (item: any) => item.name_th === employee.district
      );
      if (initialDistrict) {
        setSelectedDistrictId(initialDistrict.id);
        setSelectedDistrict(initialDistrict.name_th);
      }
    }
  }, [employee, district]);

  const handleProvinceChange = (event: any) => {
    const provinceId = event.target.value;
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId(0);
    const selectProvinceObject: any = province.find(
      (p: any) => p.id === provinceId
    );
    if (selectProvinceObject) {
      setSelectedProvince(selectProvinceObject.name_th);
    }
  };

  const handleDistrictChange = (event: any) => {
    const districtId = event.target.value;
    setSelectedDistrictId(districtId);
    const selectDistrictObject: any = district.find(
      (d: any) => d.id === districtId
    );
    if (selectDistrictObject) {
      setSelectedDistrict(selectDistrictObject.name_th);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedEmployee = {
      ...employee,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      gender: parseInt(formData.get("gender") as string, 10),
      address: formData.get("address") as string,
      sub_district: formData.get("sub_district") as string,
      district: selectedDistrict,
      province: selectedProvince,
      birth_day: birthDate?.toISOString(),
      expired_id_card: expiryDate?.toISOString(),
    };

    try {
      const result = await handleUpdateEmployee(updatedEmployee);
      if (result?.success === true) {
        toast.success(result?.data);
        router.push("/");
      } else {
        toast.error("อุ๊ปซ์ มีบางอย่างผิดพลาด");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <main>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
        <Container maxWidth="md" className="py-10">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className="text-indigo-800"
          >
            แก้ไขข้อมูลพนักงาน
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="first_name"
                  defaultValue={employee.first_name}
                  label="ชื่อ"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="last_name"
                  label="นามสกุล"
                  defaultValue={employee.last_name}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="gender-label">เพศ</InputLabel>
                  <Select
                    labelId="gender-label"
                    name="gender"
                    defaultValue={employee.gender}
                    onChange={(e) =>
                      setEmployee({ ...employee, gender: e.target.value })
                    }
                    label="เพศ"
                  >
                    {genderSelect.map((gender) => (
                      <MenuItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  name="address"
                  defaultValue={employee.address}
                  label="ที่อยู่"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="province-label">จังหวัด</InputLabel>
                  <Select
                    labelId="province-label"
                    name="province"
                    value={selectedProvinceId || ""}
                    onChange={handleProvinceChange}
                  >
                    <MenuItem value="" disabled>
                      เลือกจังหวัด
                    </MenuItem>
                    {province.map((p: any) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name_th}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="district-label">อำเภอ</InputLabel>
                  <Select
                    labelId="district-label"
                    value={selectedDistrictId || ""}
                    name="district"
                    onChange={handleDistrictChange}
                    displayEmpty
                    disabled={!selectedProvinceId}
                  >
                    <MenuItem value="" disabled>
                      เลือกอำเภอ
                    </MenuItem>
                    {district.map((d: any) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.name_th}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="sub_district-label">ตำบล</InputLabel>
                  <Select
                    labelId="sub_district-label"
                    name="sub_district"
                    defaultValue={employee.sub_district || ""}
                    displayEmpty
                    disabled={!selectedDistrictId}
                  >
                    <MenuItem value="" disabled>
                      เลือกตำบล
                    </MenuItem>
                    {subDistrict.map((sub_district: any) => (
                      <MenuItem
                        key={sub_district.id}
                        value={sub_district.name_th}
                      >
                        {sub_district.name_th}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="วันเกิด"
                  value={birthDate}
                  onChange={(newValue) => setBirthDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="บัตรหมดอายุ"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} className="flex justify-center gap-4">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => router.back()}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  บันทึก
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </LocalizationProvider>
    </main>
  );
}
