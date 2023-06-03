const axios = require('axios');

const { FLW_BASE_URL, FLW_SECRET_KEY } = require('../config/sysConfig');

const FLW = axios.create({
  baseURL: FLW_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${FLW_SECRET_KEY}`,
  },
});

export default {
  billCategories,validateBill,
  createBill,
  randomString
};

/**
 *
 * @param {*} bill_type {airtime|data_bundle|internet|power|cables|toll}
 * @param {*} biller_code
 * @param {*} country
 * @returns
 */
async function billCategories(bill_type:string, biller_code:string, country:string) {
  const response = await FLW({
    url: `/bill-categories?${bill_type}=1&biller_code=${biller_code}&country=${country}`,
    method: 'GET',
  });

  return response;
}

/**
 *
 * @param {*} item_code
 * @param {*} biller_code
 * @param {*} customer
 * @returns
 */
async function validateBill(item_code:string, biller_code:string, customer:string) {
  try {
    const response = await FLW({
      url: `/bill-items/${item_code}/validate?code=${biller_code}&customer=${customer}`,
      method: 'GET',
    });

    return response;
  } catch (error:any) {
    return error.response;
  }
}

/**
 *
 * @param {*} data
 */
async function createBill(data:any) {
  try {
    const response = await FLW({
      url: `https://api.flutterwave.com/v3/bills`,
      method: 'POST',
      data,
    });

    return response;
  } catch (error:any) {
    return error.response;
  }
}

/**
 * @function
 * Generate random string for otp verification
 * @param {int} length string length
 * @returns {string} randomString
 */
function randomString(length:number) {
  let result = 'S';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
