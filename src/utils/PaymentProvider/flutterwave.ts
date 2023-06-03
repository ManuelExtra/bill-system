const config = require('../../config/sysConfig');
const axios = require('axios').default;

const ApiCall = axios.create({
    baseURL: config.FLUTTERWAVE_SERVICE_URL,
    timeout: config.HTTP_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.FLUTTERWAVE_SECRET_KEY}`
    }
});
ApiCall.interceptors.response.use(function (response: {}) {
    return response;
}, function (error: any) {
    // Return all api responses and not throw them as errors
    if (error.response) return error.response;
    return Promise.reject(error);
});

export async function initializePayment(data: any){
    const payload = {
        tx_ref: data.refNo,
        amount: data.amount, // Set to kobo
        currency: 'NGN', // Since we are only dealing with nigerians
        redirect_url: data.callback_url,
        payment_options: 'card',
        // "meta": {
        //     "consumer_id": 23,
        //     "consumer_mac": "92a3-912ba-1192a"
        // },
        "customer": {
            "email": data.email,
        },
        "customizations": {
            "title": config.KARDUSO_NAME,
            "description": config.KARDUSO_DESCRIPTION,
            "logo": config.KARDUSO_LOGO
        }
    }

    const response = await ApiCall({
        url: '/v3/payments',
        method: 'POST',
        data: payload
    });

    return response.data.status === "success"
        ? {
            refNo: data.referenceNumber,
            payment_url: response.data.data.link
        }
        : null;

}

export async function verifyPayment (referenceNumber:string) {
    const response = await ApiCall({
        url: `/v3/transactions/${referenceNumber}/verify`,
        method: 'GET'
    });


    if (response.data.status !== 'success') return null;

    return response.data.data.status === 'successful'
        ? {
            amount: response.data.data.charged_amount,
            currency: response.data.data.currency
        }
        : null;

}