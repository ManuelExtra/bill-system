import { NextFunction, Request, Response } from "express";

import Config from "../../config/sysConfig"

interface ProductRequest extends Request{
    product?: string
}

function admin(req:ProductRequest, res:Response, next:NextFunction){
    req.product = Config.product.admin;

    next();
}

function core(req:ProductRequest, res:Response, next:NextFunction){
    req.product = Config.product.core;
    next();
}

export default {admin, core};