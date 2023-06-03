import { Request, Response, NextFunction } from "express";
import Utils from '../utils/utils';

// queue-ing external api call to make response to be very fast
import airtimeQueue from '../scripts/airtime/queue';
import mobileDataQueue from '../scripts/mobile-data/queue';

// Money
import Money from '../utils/money';
const { money, isLt } = Money;

import Spend from '../services/spend.service';

import userResource from '../resources/user.resource';

/**
 * @class UserController
 * Create a new User instance
 */
class UserController {

  
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
phoneNumberValidator = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;
  let { phone_number } = req.body;

  let { data } = await Utils.validateBill('AT099', 'BIL099', phone_number);

  // validate number
  if (data.data.name.toLowerCase() != network) {
    return res.status(200).json({
      msg: `The provider (${network}) and phone number (${phone_number}) doesn't match. Please check and try again.`,
      error: 1,
    });
  }

  return res.status(200).json({
    msg: `The provider (${network}) and phone number (${phone_number}) matched`,
    error: 0,
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cableTVValidator = async (req: Request, res: Response, next: NextFunction) => {
  let { biller_name, item_code, smartcard_number } = req.body;

  let { data } = await Utils.validateBill(
    item_code,
    biller_name,
    smartcard_number
  );

  // validate smart card
  if (data.status == 'error' && data.data == null) {
    return res.status(200).json({
      msg: `Unable to verify the smartcard number.`,
      error: 1,
    });
  }

  return res.status(200).json({
    msg: 'Smart card number info fetch successfully',
    data: {
      name: data.data.name,
      smartcard_number: data.data.customer,
    },
    error: data.status == 'success' ? 0 : 1,
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
buyInstantAirtime = async (req: any, res: Response, next: NextFunction) => {
  try {
    let { network } = req.params;
    let { amount, phone_number, account_type } = req.body;

    // invalid account type
    const wallet:any = req.user.wallet.find((w:any) => w.account_type === account_type);
    if (!wallet) {
      return res.status(200).json({
        msg: `Invalid account type.`,
        error: 1,
      });
    }

    // check wallet balance against amount
    if (isLt(money(+wallet.amount.balance, undefined), money(+amount, undefined))) {
      return res.status(200).json({
        msg: `Insufficient balance to complete this transaction.`,
        error: 1,
      });
    }

    // create spend (status - pending)

    const spend : any = await Spend.add({
      type: 'airtime',
      description: phone_number,
      amount,
      status: 'pending',
      metadata: {
        customer_number: phone_number,
        service_provider: network,
      },
      user_id: req.user.user_no,
    });

    // deduct amount (Auth Service) - outflow
    const transaction = await userResource.createOutflow(req.token, {
      service: 'spend',
      description: `${network.toUpperCase()} Recharge`,
      amount,
      account_type,
      ref_id: spend._id,
      user_id: req.user.user_no,
    });

    // queue airtime purchase job
    airtimeQueue.tasks.buyAirtime({
      data: {
        network,
        amount,
        account_type,
        phone_number,
        user: req.user,
        token: req.token,
        spend_id: spend._id,
      },
    });

    // return response
    return res.status(200).json({
      msg: `You have successfully recharged ${amount} (NGN) airtime to ${phone_number}.`,
      data: { ...transaction },
      error: 0,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
buyScheduleAirtime = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;
  let { amount, phone_number } = req.body;

  let { data } = await Utils.validateBill('AT099', 'BIL099', phone_number);

  // validate number
  if (data.data.name.toLowerCase() != network) {
    return res.status(200).json({
      msg: `The provider (${network}) and phone number (${phone_number}) doesn't match. Please check and try again.`,
      error: 1,
    });
  }

  // schedule
  // // queue scheduled job
  // airtimeQueue.tasks.buyAirtime({
  //   data: 'heyyy',
  //   repeat: { startDate: '', endDate: '', every: '' },
  //   jobId: 'job-id',
  // });

  return res.status(200).json({
    msg: `You have successfuly scheduled ${amount} (NGN) airtime to recur weekly.`,
    data: {},
    error: 0,
  });
};

terminateScheduledAirtime = async (req: Request, res: Response, next: NextFunction) => {
  // await airtimeQueue.taskQueue.removeRepeatableByKey('job-name:job-id::1000');
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
getDataPlans = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;

  let biller_code:any = {
    mtn: 'BIL104',
    glo: 'BIL105',
    airtel: 'BIL106',
    '9mobile': 'BIL107',
  };

  let response:any = await Utils.billCategories(
    'data_bundle',
    biller_code[network.toLowerCase()],
    'NG'
  );

  if (response.data.status == 'error' && response.data.data == null) {
    if (response.data.message == 'Insufficient funds in your wallet') {
      //  Log info to  admin and console
      console.error('[LOG][FLW]: ' + response.data.message);
    }

    return res.status(200).json({
      msg: 'Error occcured while fetching data plans',
      error: 1,
    });
  }

  // pick some keys, remove duplicate biller_name, and then sort plans
  let uniq: any = {};
  const plans: any = response.data.data
    .map((plan: {id:string,
      biller_name:string,
      item_code:string,
      amount:string|number,
      is_airtime:boolean,
      fee: string|number}) => {

      return {
      id: plan.id,
      biller_name: plan.biller_name,
      item_code: plan.item_code,
      amount: plan.amount,
      is_airtime: plan.is_airtime,
      fee: plan.fee,
      }
    })
    .filter((obj:{biller_name:string}) => !uniq[obj.biller_name] && (uniq[obj.biller_name] = true))
    .sort((a:any, b:any) => a.amount - b.amount);

  return res.status(200).json({
    msg: 'Mobile data plans fetched successfully',
    plans,
    error: 0,
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
buyInstantData = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;
  let { biller_name, item_code, amount, phone_number } = req.body;

  let { data } = await Utils.validateBill(item_code, biller_name, phone_number);

  // validate number
  if (data.data.name.toLowerCase() != network) {
    return res.status(200).json({
      msg: `The provider (${network}) and phone number (${phone_number}) doesn't match. Please check and try again.`,
      error: 1,
    });
  }

  // buy data
  let response = await Utils.createBill({
    country: 'NG',
    customer: phone_number,
    amount: +amount,
    type: biller_name,
    reference: Utils.randomString(16),
  });

  if (response.data.status == 'error' && response.data.data == null) {
    if (response.data.message == 'Insufficient funds in your wallet') {
      //  Log info to  admin and console
      console.error('[LOG][FLW]: ' + response.data.message);
    }

    return res.status(200).json({
      msg: 'Error occcured while buying data',
      error: 1,
    });
  }

  // save response.data.data

  return res.status(200).json({
    msg: `You have successfuly recharged ${amount} (NGN) data to ${phone_number}.`,
    data: response.data.data,
    error: 0,
  });
};

buyScheduleData = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;
  let { biller_name, item_code, amount, phone_number } = req.body;

  //
  let { data } = await Utils.validateBill(item_code, biller_name, phone_number);

  // validate number
  if (data.data.name.toLowerCase() != network) {
    return res.status(200).json({
      msg: `The provider (${network}) and phone number (${phone_number}) doesn't match. Please check and try again.`,
      error: 1,
    });
  }

  // schedule

  return res.status(200).json({
    msg: `You have successfuly scheduled ${amount} (NGN) data to recur weekly.`,
    data: {},
    error: 0,
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
getCableTVPlans = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;

  let biller_code: any = {
    dstv: 'BIL119',
    gotv: 'BIL120',
    startimes: 'BIL123',
  };

  let response = await Utils.billCategories(
    'cable',
    biller_code[network.toLowerCase()],
    'NG'
  );

  if (response.data.status == 'error' && response.data.data == null) {
    if (response.data.message == 'Insufficient funds in your wallet') {
      //  Log info to  admin and console
      console.error('[LOG][FLW]: ' + response.data.message);
    }

    return res.status(200).json({
      msg: 'Error occcured while fetching cable tv plans',
      error: 1,
    });
  }

  // pick some keys, remove duplicate biller_name, and then sort plans
  let uniq:any = {};
  const plans = response.data.data
    .map((plan: { id:string, biller_name:string, item_code:string, amount:string|number, is_airtime:boolean, fee:string|number }) => ({
      id: plan.id,
      biller_name: plan.biller_name,
      item_code: plan.item_code,
      amount: plan.amount,
      is_airtime: plan.is_airtime,
      fee: plan.fee,
    }))
    .filter((obj:{biller_name: string}) => !uniq[obj.biller_name] && (uniq[obj.biller_name] = true))
    .sort((a:any, b:any) => a.amount - b.amount);

  return res.status(200).json({
    msg: 'Cable TV plans fetched successfully',
    plans,
    error: 0,
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
buyInstantCableTV = async (req: Request, res: Response, next: NextFunction) => {
  let { biller_name, item_code, amount, smartcard_number } = req.body;

  let { data } = await Utils.validateBill(
    item_code,
    biller_name,
    smartcard_number
  );

  // validate smart card
  if (data.status == 'error' && data.data == null) {
    return res.status(200).json({
      msg: `Unable to verify the smartcard number.`,
      error: 1,
    });
  }

  // buy data
  let response = await Utils.createBill({
    country: 'NG',
    customer: smartcard_number,
    amount: +amount,
    type: biller_name,
    reference: Utils.randomString(16),
  });

  if (response.data.status == 'error' && response.data.data == null) {
    if (response.data.message == 'Insufficient funds in your wallet') {
      //  Log info to  admin and console
      console.error('[LOG][FLW]: ' + response.data.message);
    }

    return res.status(200).json({
      msg: 'Error occcured while buying cable tv.',
      error: 1,
    });
  }

  // save response.data.data

  return res.status(200).json({
    msg: `Your cable TV purchase to ${smartcard_number} was successful`,
    data: response.data.data,
    error: 0,
  });
};

buyScheduleCableTV = async (req: Request, res: Response, next: NextFunction) => {
  let { biller_name, item_code, amount, smartcard_number } = req.body;

  let { data } = await Utils.validateBill(
    item_code,
    biller_name,
    smartcard_number
  );

  // validate smart card
  if (data.status == 'error' && data.data == null) {
    return res.status(200).json({
      msg: `Unable to verify the smartcard number.`,
      error: 1,
    });
  }

  // schedule cable tv

  return res.status(200).json({
    msg: `You have successfuly scheduled ${amount} (NGN) cable tv to recur weekly.`,
    data: {},
    error: 0,
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
getInternetPlans = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
getElectricityPlans = async (req: Request, res: Response, next: NextFunction) => {
  let { network } = req.params;
};

}


export default new UserController;

