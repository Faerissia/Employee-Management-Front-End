import dayjs from "dayjs";

export const isCardExpired = (expiredDate: string) => {
  const today = dayjs();
  const expDate = dayjs(expiredDate);
  return expDate.isBefore(today) || expDate.diff(today, "month") <= 3;
};
