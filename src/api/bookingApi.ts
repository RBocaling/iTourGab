import api from "./api";
import type { BookingListResponse, BookingRaw } from "@/types/booking";

export const getMyBookingsApi = async (): Promise<BookingRaw[]> => {
  try {
    const { data } = await api.get<BookingListResponse>("/bookings/me");
    return data.data ?? [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to fetch my bookings";
    throw new Error(msg);
  }
};

export const getAllBookingsApi = async (): Promise<BookingRaw[]> => {
  try {
    const { data } = await api.get<BookingListResponse>("/booking/get-all");
    return data.data ?? [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to fetch bookings";
    throw new Error(msg);
  }
};

export const getBookingByIdApi = async (
  id: string | number
): Promise<BookingRaw> => {
  try {
    const { data } = await api.get<{
      success: boolean;
      message: string;
      data: BookingRaw;
    }>(`/bookings/me/${id}`);
    return data.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      `Failed to fetch booking with id ${id}`;
    throw new Error(msg);
  }
};

export const createBookingApi = async (payload: any): Promise<BookingRaw> => {
  try {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: BookingRaw;
    }>("/bookings", payload);
    return data.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to create booking";
    throw new Error(msg);
  }
};


export const updateStatus = async ({
  id,
  reason,
}: {
  id: number | string;
  reason: string;
}) => {
  console.log("reason", reason);

  try {
    const response = await api.put(`/bookings/status/${id}`, {
      cancel_reason: reason,
      status: "CANCELLED",
    });
    return response?.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      `Failed to update booking with id ${id}`;
    throw new Error(msg);
  }
};
