import { useQuery } from "@tanstack/react-query";
import { psgcApi } from "@/api/psgcApi";

export const useProvinces = () => {
  return useQuery({
    queryKey: ["psgc", "provinces"],
    queryFn: () => psgcApi.getProvinces(),
  });
};

export const useCitiesMunicipalities = (provinceCode: string | null) => {
  return useQuery({
    queryKey: ["psgc", "cities", provinceCode],
    queryFn: () =>
      provinceCode
        ? psgcApi.getCitiesMunicipalitiesByProvince(provinceCode)
        : [],
    enabled: Boolean(provinceCode),
  });
};

export const useBarangays = (cityMunicipalityCode: string | null) => {
  return useQuery({
    queryKey: ["psgc", "barangays", cityMunicipalityCode],
    queryFn: () =>
      cityMunicipalityCode
        ? psgcApi.getBarangaysByCityMunicipality(cityMunicipalityCode)
        : [],
    enabled: Boolean(cityMunicipalityCode),
  });
};
