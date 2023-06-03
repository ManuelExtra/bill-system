import { Request } from "express";

export interface OtherRequest extends Request {
    product?: string | undefined,
    user?: {}
}