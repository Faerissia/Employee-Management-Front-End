import axios from "axios";

export const getProvince = async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getDistrict = async () => {
  try {
    const res = await axios.get(
      `https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json`
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getSubDistrict = async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};
