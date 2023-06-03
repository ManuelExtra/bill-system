// conversion function.
const toCents = (val: number) => val * 100;
const toNum = (val: number) => Math.round(val) / 100;

// integer conversion.
const toInt = (a:string) => {
  const x = Number(a);
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};

// detector functions.
const isSafe = (n:any) =>
  typeof n === 'number' &&
  Math.round(n) === n &&
  Number.MIN_SAFE_INTEGER <= n &&
  n <= Number.MAX_SAFE_INTEGER;

const isEqual = (a:any, b:any) => Math.abs(a.number - b.number) < Number.EPSILON;
const isNaN_ = (value: any) => typeof value === 'number' && isNaN(value);

// comparer functions.
const isLte = (a:any, b:any) => a.value <= b.value;
const isGte = (a:any, b:any) => a.value >= b.value;
const isLt = (a:any, b:any) => a.value < b.value;
const isGt = (a:any, b:any) => a.value > b.value;

// money constructor.
const money = (number:any, value:any) => {
  const result =
    number != null
      ? { number, value: toCents(number) }
      : { number: toNum(value), value };

  if (!isSafe(result.value))
    throw new Error('Number exceed integer SAFE range');

  return result;
};

// arithmetic operators.
const add = (a:any, b:any) => money(null, a.value + b.value);
const sub = (a:any, b:any) => money(null, a.value - b.value);
const mul = (a:any, b:any) => money(null, a.value * b.value);
const div = (a:any, b:any) => money(null, a.value / b.value);

export default {
  isSafe,
  isEqual,
  isNaN_,
  toInt,
  toCents,
  toNum,
  money,
  isLte,
  isGte,
  isLt,
  isGt,
  add,
  sub,
  mul,
  div,
};
