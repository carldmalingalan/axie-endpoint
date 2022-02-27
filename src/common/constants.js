export const { MONGODB_URI, HASH_SALT, PORT } = process.env;

export const SORT_VALUES = {
  NAME: { name: 1 },
  PRICE_ASC: { "price.USD": 1 },
  PRICE_DESC: { "price.USD": -1 },
  CLASS: { class: 1 },
};
