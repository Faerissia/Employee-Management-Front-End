export type ProvinceType = {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

export type DistrictType = {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

export type SubDistrictType = {
  id: number;
  zip_code: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};
