"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { handleCreateEmployee } from "@/api/employeeApi";
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

export default function CreateEmployee() {
  const router = useRouter();
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
    const district: any = await getDistrict();
    const filter_district = district?.data.filter(
      (item: any) => item.province_id === selectedProvinceId
    );
    setDistrict(filter_district);
  };

  const getSubDistrictList = async () => {
    const sub_district: any = await getSubDistrict();
    const filter_sub_district = sub_district?.data.filter(
      (item: any) => item.amphure_id === selectedDistrictId
    );
    setSubDistrict(filter_sub_district);
  };

  useEffect(() => {
    getProvinceList();

    if (selectedProvinceId) {
      getDistrictList();
    }

    if (selectedDistrictId) {
      getSubDistrictList();
    }
  }, [selectedProvinceId, selectedDistrictId]);

  const handleProvinceChange = (event: any) => {
    setSelectedProvinceId(event.target.value);
    setSelectedDistrictId(0);
    const selectProvinceObject: any = province.find(
      (province: any) => province.id === event.target.value
    );
    if (selectProvinceObject) {
      setSelectedProvince(selectProvinceObject.name_th);
    }
  };

  const handleDistrictChange = (event: any) => {
    setSelectedDistrictId(event.target.value);
    const selectDistrictObject: any = district.find(
      (district: any) => district.id === event.target.value
    );
    if (selectDistrictObject) {
      setSelectedDistrict(selectDistrictObject.name_th);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const createEmployee = {
      ...employee,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      address: formData.get("address") as string,
      gender: parseInt(formData.get("gender") as string, 10),
      sub_district: formData.get("sub_district") as string,
      district: selectedDistrict,
      province: selectedProvince,
      birth_day: birthDate?.add(1, "day"),
      expired_id_card: expiryDate?.add(1, "day"),
    };

    try {
      const result = await handleCreateEmployee(createEmployee);
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
            เพิ่มข้อมูลพนักงาน
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField name="first_name" label="ชื่อ" fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="last_name"
                  label="นามสกุล"
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
                <TextField name="address" label="ที่อยู่" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="province-label">จังหวัด</InputLabel>
                  <Select
                    labelId="province-label"
                    name="province"
                    onChange={handleProvinceChange}
                  >
                    <MenuItem value="" disabled>
                      เลือกจังหวัด
                    </MenuItem>
                    {province.map((province: any) => (
                      <MenuItem key={province.id} value={province.id}>
                        {province.name_th}
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
                    name="district"
                    onChange={handleDistrictChange}
                    displayEmpty
                    disabled={!selectedProvinceId}
                  >
                    <MenuItem value="" disabled>
                      เลือกอำเภอ
                    </MenuItem>
                    {district.map((district: any) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name_th}
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
                  onChange={(newValue) => setBirthDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="บัตรหมดอายุ"
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
