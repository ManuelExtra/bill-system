import config from '../config/sysConfig';
import AuthService from '../utils/AuthService';
import CustomError from '../utils/customError';

import Spend from '../services/spend.service';

export default {
  async createOutflow (token: string, data: any){
    const response = await AuthService.createOutflow(token, data);
    if (response.error) {
      // failed the spend if unable to create outflow
      await Spend.update({ _id: data.ref_id }, { status: 'failed' });
  
      throw new CustomError(response.msg, 400);
    }
    return {
      ...response,
    }
  },
  async createInflow (token:string, data: any){
    const response = await AuthService.createInflow(token, data);
    if (response.error) throw new CustomError(response.msg, 400);
    return {
      ...response,
    };
  }
}

