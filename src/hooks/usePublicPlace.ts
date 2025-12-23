import { getPlacePublicApi } from "@/api/placeApi";
import { useQuery } from "@tanstack/react-query";

const useGetPlacePublic = () => {
    return useQuery({
        queryFn: getPlacePublicApi,
        queryKey:["public"]
    });
};


export default useGetPlacePublic