export function normalizeRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const firstArray = Object.values(payload).find((value) =>
      Array.isArray(value)
    );
    if (firstArray) return firstArray;
    return [payload];
  }
  return [];
}

export function detectFields(rows, preferredX, preferredValue) {
  if (!rows || rows.length === 0) {
    return { xField: preferredX, valueField: preferredValue };
  }

  const sample = rows[0];
  const keys = Object.keys(sample);
  const stringKeys = keys.filter((key) => typeof sample[key] === "string");
  const numberKeys = keys.filter((key) => typeof sample[key] === "number");

  const xField =
    preferredX && keys.includes(preferredX)
      ? preferredX
      : stringKeys[0] || keys[0];

  const valueField =
    preferredValue && keys.includes(preferredValue)
      ? preferredValue
      : numberKeys.find((key) => /revenue|total|amount|idr/i.test(key)) ||
        numberKeys[0];

  return { xField, valueField };
}

export function isCurrencyField(fieldName) {
  return /revenue|idr|amount|spent|total_price/i.test(String(fieldName));
}
