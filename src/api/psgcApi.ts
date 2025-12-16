import axios from "axios";

const BASE_URL = "https://psgc.gitlab.io/api";

export type PSGCProvince = {
  code: string;
  name: string;
  regionCode: string;
};

export type PSGCCityMunicipality = {
  code: string;
  name: string;
  provinceCode: string;
  isCity: boolean;
};

export type PSGCBarangay = {
  code: string;
  name: string;
  cityMunicipalityCode: string;
};

async function getJson<T>(path: string): Promise<T> {
  const resp = await axios.get<T>(`${BASE_URL}${path}`);
  return resp.data;
}

export const psgcApi = {
  async getProvinces(): Promise<PSGCProvince[]> {
    const data = await getJson<
      Array<{ code: string; name: string; regionCode: string }>
    >("/provinces/");
    return data.map((p) => ({
      code: p.code,
      name: p.name,
      regionCode: p.regionCode,
    }));
  },

  async getCitiesMunicipalitiesByProvince(
    provinceCode: string
  ): Promise<PSGCCityMunicipality[]> {
    const data = await getJson<
      Array<{
        code: string;
        name: string;
        provinceCode: string;
        isCity?: boolean;
      }>
    >(`/provinces/${provinceCode}/cities-municipalities/`);
    return data.map((c) => ({
      code: c.code,
      name: c.name,
      provinceCode: c.provinceCode,
      isCity: Boolean(c.isCity),
    }));
  },

  async getBarangaysByCityMunicipality(
    cityMunicipalityCode: string
  ): Promise<PSGCBarangay[]> {
    const data = await getJson<
      Array<{ code: string; name: string; cityMunicipalityCode: string }>
    >(`/cities-municipalities/${cityMunicipalityCode}/barangays/`);
    return data.map((b) => ({
      code: b.code,
      name: b.name,
      cityMunicipalityCode: b.cityMunicipalityCode,
    }));
  },
};
