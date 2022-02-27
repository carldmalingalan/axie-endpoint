export const { MONGODB_URI, HASH_SALT, PORT } = process.env;

export const SORT_VALUES = {
  NAME: { name: 1 },
  PRICE_ASC: { priceUSD: 1 },
  PRICE_DESC: { priceUSD: -1 },
  CLASS: { class: 1 },
};
