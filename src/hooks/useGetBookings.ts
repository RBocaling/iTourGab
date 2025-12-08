import { useQuery } from "@tanstack/react-query";
import { getAllBookingsApi,  getBookingByIdApi,  getMyBookingsApi } from "@/api/bookingApi";
import { formatBookings, formatBooking } from "@/lib/formatBooking";
import type { BookingRaw, FormattedBooking } from "@/types/booking";

export const useGetMyBookings = () => {
  const q = useQuery<BookingRaw[], Error>({
    queryKey: ["bookings", "me"],
    queryFn: getMyBookingsApi,
  });

  return {
    refetch: q.refetch,
    ...q,
    normalData: q.data ?? ([] as BookingRaw[]),
    formatData: q.data ? formatBookings(q.data) : ([] as FormattedBooking[]),
  };
};

export const useGetBookings = () => {
  const q = useQuery<BookingRaw[], Error>({
    queryKey: ["bookings", "all"],
    queryFn: getAllBookingsApi,
  });

  return {
    ...q,
    normalData: q.data ?? ([] as BookingRaw[]),
    formatData: q.data ? formatBookings(q.data) : ([] as FormattedBooking[]),
  };
};

export const useGetBookingById = (id?: string | number) => {
  const q = useQuery<BookingRaw, Error>({
    queryKey: ["bookings", "item", id],
    queryFn: () => getBookingByIdApi(id),
    enabled: Boolean(id),
  });

  return {
    ...q,
    normalData: q.data ?? null,
    formatData: q.data ? formatBooking(q.data) : null,
  };
};