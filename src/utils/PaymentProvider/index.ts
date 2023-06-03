const Paystack = require('./paystack');
const Flutterwave = require('./flutterwave');
const CONSTANTS = require('../../config/constants')
const PAYMENT_GATEWAY = CONSTANTS.Transaction.PAYMENT_GATEWAY

export default (payment_gateway:string) => {
    if( payment_gateway == PAYMENT_GATEWAY.PAYSTACK) return Paystack;
    if( payment_gateway == PAYMENT_GATEWAY.FLUTTERWAVE) return Flutterwave;
}