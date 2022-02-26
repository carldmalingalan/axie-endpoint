export const MONGODB_URI = process.env.MONGODB_URI;
export const HASH_SALT = process.env.HASH_SALT;

export const SORT_VALUES = {
  NAME: { name: 1 },
  PRICE_ASC: { "price.USD": 1 },
  PRICE_DESC: { "price.USD": -1 },
  CLASS: { class: 1 },
};
