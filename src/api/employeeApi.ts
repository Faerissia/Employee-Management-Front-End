import axios from "axios";

export const handleGetEmployeeList = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_API}/employee/get-list`
    );
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const handleGetEmployee = async (employee_uuid: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_API}/employee/get?employee_uuid=${employee_uuid}`
    );
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const handleCreateEmployee = async (data: any) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_API}/employee/create`,
      data
    );
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const handleUpdateEmployee = async (data: any) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_API}/employee/update/${data?.uuid}`,
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
      `${process.env.NEXT_PUBLIC_EMPLOYEE_API}/employee/delete/${employee_uuid}`
    );
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};
