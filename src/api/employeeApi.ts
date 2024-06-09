import axios from "axios";

export const handleGetEmployeeList = async () => {
  try {
    const res = await axios.get("http://localhost:8081/employee/get-list");
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const handleGetEmployee = async (employee_uuid: string) => {
  try {
    const res = await axios.get(
      `http://localhost:8081/employee/get?employee_uuid=${employee_uuid}`
    );
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const handleCreateEmployee = async (data: any) => {
  try {
    const res = await axios.post("http://localhost:8081/employee/create", data);
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const handleUpdateEmployee = async (data: any) => {
  try {
    const res = await axios.put(
      `http://localhost:8081/employee/update/${data?.uuid}`,
      data
    );
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const handleDeleteEmployee = async (employee_uuid: string) => {
  try {
    const res = await axios.delete(
      `http://localhost:8081/employee/delete/${employee_uuid}`
    );
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};
