import { NextFunction, Request, Response } from "express";


interface PhoneNumber extends Request{
    phone_number: string,
    user: {
        phone: string
    }
}

const phone = (req:PhoneNumber, res:Response, next:NextFunction) => {
    req.body.phone_number = req.user.phone;
    next()
}

const data = {
    phone
}

export default data