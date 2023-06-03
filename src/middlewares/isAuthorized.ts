import AuthService from "../utils/AuthService";
import config from "../config/sysConfig"
import { NextFunction, Request, Response } from "express";

import { OtherRequest } from "../interfaces/other.interface";

export default async (req:any, res:Response, next:NextFunction) => {
    const bearerToken = req.headers['authorization'];

    try {
        if(!bearerToken || !bearerToken.startsWith('Bearer ')) throw new Error();

        const token = bearerToken.split(' ')[1]
        const {product} = req;
        

        const response = await AuthService.getAuthDetails(token, product);
        console.log(response)
        if (response.error || !response.user) throw new Error();

        const user_no = response.user._id;
        delete response.user._id;
        req.user = {
            user_no,
            ...response.user
        };
        next();

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            error: 1,
            msg: "User not authorized!"
        });
    }
};