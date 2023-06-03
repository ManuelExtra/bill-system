import config from "../config/sysConfig";
const axios = require("axios").default;

// const product_code_core = config.product.core;
// const product_code_admin = config.product.admin;
const AuthCall = axios.create({
  baseURL: config.AUTH_SERVICE_URL,
  timeout: config.HTTP_TIMEOUT,
  headers: { "content-type": "application/json" },
});

AuthCall.interceptors.response.use(
  function (response: {}) {
    return response;
  },
  function (error: any) {
    // Return all api responses and not throw them as errors
    if (error.response) return error.response;
    throw error;
  }
);

const AuthCall2 = axios.create({
  baseURL: config.AUTH_SERVICE_URL,
  headers: { "content-type": "application/json" },
});

AuthCall2.interceptors.response.use(
  function (response: {}) {
    return response;
  },
  function (error: any) {
    // Return all api responses and not throw them as errors
    if (error.response) return error.response;
    throw error;
  }
);

const { admin, core } = config.product;

async function getAuthDetails(token: string, pr_code: string) {
  const response = await AuthCall({
    url: `/auth/verify-token`,
    method: "POST",
    data: { product_code: pr_code },
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
}

async function createOutflow(token: string, data: any) {
  const response = await AuthCall({
    url: `/transaction/create-outflow`,
    method: "POST",
    data,
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
}

async function createInflow(token: string, data: any) {
  const response = await AuthCall({
    url: `/transaction/create-inflow`,
    method: "POST",
    data,
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
}

export default {
  getAuthDetails,
  createOutflow,
  createInflow,
};
