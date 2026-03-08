import api from "./api";

export type EntityType = "TOURIST_SPOT" | "SERVICE" | "USER";

export const suspendApi = async (payload: {
  entity_type: EntityType;
  entity_id: number;
  suspended_reason: string;
}) => {
  const { data } = await api.post("/suspension/suspend", payload);
  return data;
};

export const unsuspendApi = async (payload: {
  entity_type: EntityType;
  entity_id: number;
  lifted_reason: string;
}) => {
  const { data } = await api.post("/suspension/unsuspend", payload);
  return data;
};

export const getSuspensionStatusApi = async (
  entity_type: EntityType,
  entity_id: number,
) => {
  const { data } = await api.get(
    `/suspension/status?entity_type=${entity_type}&entity_id=${entity_id}`,
  );
  return data;
};

export const getSuspendedListApi = async () => {
  const { data } = await api.get("/suspension/suspended");
  return data;
};
