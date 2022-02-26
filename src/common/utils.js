import Hashids from "hashids";
import { v1 as uuidv1 } from "uuid";
import { HASH_SALT, SORT_VALUES } from "@common/constants";

const hashids = new Hashids(HASH_SALT);

export const encodeId = (id) => hashids.encode(id, 10);

export const decodeId = (id) => hashids.decode(id, 10);

export const parseParams = (params = {}) => {
  const defaultParams = { offset: 0, limit: 50, sort: "NAME" };

  let sanitizedParams = { ...defaultParams, ...params };

  const { limit: rawLimit, sort: rawSort } = sanitizedParams;

  if (rawLimit > 50) {
    sanitizedParams = { ...sanitizedParams, limit: 50 };
  }

  sanitizedParams = { ...sanitizedParams, sort: SORT_VALUES[rawSort] };

  return sanitizedParams;
};

export const getUuid = () =>
  uuidv1()
    .split("-")
    .join("")
    .replace(/[a-zA-Z]/g, "")
    .substring(0, 10);
