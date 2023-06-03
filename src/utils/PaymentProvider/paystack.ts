const config = require('../../config/sysConfig');
const axios = require('axios').default;

const ApiCall = axios.create({
    baseURL: config.PAYSTACK_SERVICE_URL,
    timeout: config.HTTP_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.PAYSTACK_SECRET_KEY}`
    }
});
ApiCall.interceptors.response.use(function (response: {}) {
    return response;
}, function (error: any) {
    // Return all api responses and not throw them as errors
    if (error.response) return error.response;
    return Promise.reject(error);
});

export async function initializePayment (data: any){
    const payload = {
        reference: data.refNo,
        email: data.email,
        amount: data.amount * 100, // Set to kobo
        currency: 'NGN', // Since we are only dealing with nigerians
        callback_url: data.callback_url,
        channels: ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer'],
        // transaction_charge: data.amount * 0.1 * 100, // 10% of the entire amount set to kobo
        // bearer: 'subaccount' // Who pays for paystack charges
        // "metadata": {
        //     "cart_id": 398,
        //     "custom_fields": [{
        //         "display_name": "Invoice ID",
        //         "variable_name": "Invoice ID",
        //         "value": 209
        //     },
        //     {
        //         "display_name": "Cart Items",
        //         "variable_name": "cart_items",
        //         "value": "3 bananas, 12 mangoes"
        //     }]
        // }
    }

    const response = await ApiCall({
        url: '/transaction/initialize',
        method: 'POST',
        data: payload
    });

    return response.data.status === true
        ? {
            refNo: data.reference,
            payment_url: response.data.data.authorization_url
        }
        : null;

}

export async function verifyPayment (referenceNumber: string){
    const response = await ApiCall({
        url: `/transaction/verify/${referenceNumber}`,
        method: 'GET'
    });

    if (response.data.status === false) return null;

    return response.data.data.status === 'success'
        ? {
            amount: +response.data.data.amount / 100,
            currency: response.data.data.currency
        }
        : null;
}