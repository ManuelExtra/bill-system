import Utils from "../../utils/utils";

import Spend from "../../services/spend.service";
import userResource from "../../resources/user.resource";

interface JobRequest {
  
  data: {
    network: string;
    phone_number: string;
    amount: number;
    account_type: string;
    user: { user_no: string };
    token: string;
    spend_id: string;
  };
}
/**
 *
 * @param {*} job
 * @param {*} done
 *
 * Buy airtime job
 */
export default async function buyAirtime(job: any, done: any) {
  let { network, phone_number, amount, account_type, user, token, spend_id } =
    job.data;

  // buy airtime
  let response = await Utils.createBill({
    country: "NG",
    customer: phone_number,
    amount: +amount,
    type: "AIRTIME",
    reference: Utils.randomString(16),
  });

  // FLW status: error
  if (response.data.status == "error" && response.data.data == null) {
    if (response.data.message == "Insufficient funds in your wallet") {
      //  log info to  admin and console
      console.error("[LOG][FLW]: " + response.data.message);
    }

    // failed the spend if flutterwave down
    await Spend.update(
      { _id: spend_id },
      { status: "failed", third_party_response: response.data }
    );

    // reversal
    try {
      // reverse money (Auth Service) - inflow
      await userResource.createInflow(token, {
        service: "spend",
        description: `${network.toUpperCase()} Recharge - REVERSAL`,
        amount,
        account_type,
        ref_id: spend_id,
        user_id: user.user_no,
      });
    } catch (error) {
      console.log(error);
      //  log info to  admin and console
      console.error(
        `[LOG][STASH]: Unable to reverse failed airtime. User Id: ${user.user_no} | Amount: ${amount}`
      );
    }
  }

  // FLW status: success
  if (response.data.status == "success") {
    // update spend model (status: success)
    await Spend.update(
      { _id: spend_id },
      { status: "success", third_party_response: response.data }
    );
  }

  done(null, "success");
}
