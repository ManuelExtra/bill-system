import helpers from "../../utils/helpers";
import customError from "../../utils/customError";
import validate from "./auth";
import { NextFunction, Request, Response } from "express";

async function encrypt(req:Request, res:Response, next:NextFunction) {
  const { message } = req.body;

  const response = helpers.encryptText(message);
}

function decrypt(req:Request, res:Response, next:NextFunction) {
  const { message } = req.body;

  try {
    const response = helpers.decryptText(message);
   
    const {withdrawal_account} = JSON.parse(response);
    if(withdrawal_account){
      // console.log(withdrawal_account)
      req.body.withdrawal_account = response;
    }
    else{
      req.body = JSON.parse(response);
    }
    
    next();
  } catch (error) {
    return res.status(422).json({
      error: 1,
      msg: "Error occured!",
    });
  }

  //   console.log(response);
}

export default {
  encrypt, decrypt
};
