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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
} from "@mui/material";

import dayjs from "dayjs";
import "dayjs/locale/th";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Suspense } from "react";

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
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EmployeeEditor />
      </Suspense>
    </main>
  );
}

function EmployeeEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get("employee_uuid");
  const [employee, setEmployee] = useState<any>(null);
  const [province, setProvince] = useState<ProvinceType[]>([]);
  const [district, setDistrict] = useState<DistrictType[]>([]);
  const [subDistrict, setSubDistrict] = useState<SubDistrictType[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceType | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictType | null>(
    null
  );
  const [selectedSubDistrict, setSelectedSubDistrict] =
    useState<SubDistrictType | null>(null);
  const [birthDate, setBirthDate] = useState<dayjs.Dayjs | null>(null);
  const [expiryDate, setExpiryDate] = useState<dayjs.Dayjs | null>(null);

  const getProvinceList = async () => {
    const province: any = await getProvince();
    setProvince(province?.data);
  };

  const getDistrictList = async () => {
    if (!selectedProvince) return;
    const district: any = await getDistrict();
    const filter_district = district?.data.filter(
      (item: any) => item.province_id === selectedProvince.id
    );
    setDistrict(filter_district);
  };

  const getSubDistrictList = async () => {
    if (!selectedDistrict) return;
    const sub_district: any = await getSubDistrict();
    const filter_sub_district = sub_district?.data.filter(
      (item: any) => item.amphure_id === selectedDistrict.id
    );
    setSubDistrict(filter_sub_district);
  };

  useEffect(() => {
    getProvinceList();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getDistrictList();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      getSubDistrictList();
    }
  }, [selectedDistrict]);

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
        setSelectedProvince(initialProvince);
      }
    }
  }, [employee, province]);

  useEffect(() => {
    if (employee && district.length > 0) {
      const initialDistrict = district.find(
        (item: any) => item.name_th === employee.district
      );
      if (initialDistrict) {
        setSelectedDistrict(initialDistrict);
      }
    }
  }, [employee, district]);

  useEffect(() => {
    if (employee && subDistrict.length > 0) {
      const initialSubDistrict = subDistrict.find(
        (item: any) => item.name_th === employee.sub_district
      );
      if (initialSubDistrict) {
        setSelectedSubDistrict(initialSubDistrict);
      }
    }
  }, [employee, subDistrict]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedEmployee = {
      ...employee,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      gender: parseInt(formData.get("gender") as string, 10),
      address: formData.get("address") as string,
      sub_district: selectedSubDistrict ? selectedSubDistrict.name_th : "",
      district: selectedDistrict ? selectedDistrict.name_th : "",
      province: selectedProvince ? selectedProvince.name_th : "",
      birth_day: birthDate?.toISOString(),
      expired_id_card: expiryDate?.toISOString(),
    };

    try {
      const result = await handleUpdateEmployee(updatedEmployee);
      if (result?.success === true) {
        toast.success(result?.data);
        router.push("/");
      } else {
        toast.error("Oops, something went wrong!");
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
                <Autocomplete
                  id="province-autocomplete"
                  options={province}
                  getOptionLabel={(option) => option.name_th}
                  value={selectedProvince}
                  onChange={(event, newValue) => {
                    setSelectedProvince(newValue);
                    setSelectedDistrict(null);
                    setSelectedSubDistrict(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="เลือกจังหวัด"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name_th}
                    </li>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="district-autocomplete"
                  options={district}
                  getOptionLabel={(option) => option.name_th}
                  value={selectedDistrict}
                  onChange={(event, newValue) => {
                    setSelectedDistrict(newValue);
                    setSelectedSubDistrict(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="เลือกอำเภอ"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name_th}
                    </li>
                  )}
                  disabled={!selectedProvince}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="sub-district-autocomplete"
                  options={subDistrict}
                  getOptionLabel={(option) => option.name_th}
                  value={selectedSubDistrict}
                  onChange={(event, newValue) => {
                    setSelectedSubDistrict(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="เลือกตำบล"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name_th}
                    </li>
                  )}
                  disabled={!selectedDistrict}
                />
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
