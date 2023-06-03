import { Router } from "express";

import isAuthenticated from "../middlewares/isAuthenticated";
import customerController from "../controllers/user.controller";
import validate from "../middlewares/Validator/auth";
import isAuthorized from "../middlewares/isAuthorized";
import Encryption from "../middlewares/Validator/encryption";

// For users assigned to the core product
import Product from "../middlewares/Validator/product";
import Data from "../middlewares/data";

const { encrypt, decrypt } = Encryption;
const { core } = Product;
const { phone } = Data;

const router = Router();

/**
 * Spend
 */
router.post(
  "/phone-number/:network/validator",
  [isAuthenticated, core, isAuthorized],
  validate("checkMessage"),
  decrypt,
  validate("phoneNumberValidator"),
  customerController.phoneNumberValidator
);

router.post(
  '/buy-airtime/:network/instant',
  [isAuthenticated, core, isAuthorized],
  validate('checkMessage'),
  decrypt,
  validate('buyAirtime'),
  customerController.buyInstantAirtime
);

router.post(
  '/buy-airtime/:network/schedule',
  [isAuthenticated, core, isAuthorized],
  // validate('checkMessage'),
  // decrypt,
  validate('buyAirtime'),
  customerController.buyScheduleAirtime
);

router.get(
  '/data/:network/plans',
  [isAuthenticated, core, isAuthorized],
  customerController.getDataPlans
);

router.post(
  '/buy-data/:network/instant',
  [isAuthenticated, core, isAuthorized],
  // validate('checkMessage'),
  // decrypt,
  validate('buyData'),
  customerController.buyInstantData
);

router.post(
  '/buy-data/:network/schedule',
  [isAuthenticated, core, isAuthorized],
  // validate('checkMessage'),
  // decrypt,
  validate('buyData'),
  customerController.buyScheduleData
);

router.get(
  '/cable-tv/:network/plans',
  [isAuthenticated, core, isAuthorized],
  customerController.getCableTVPlans
);

router.post(
  '/cable-tv/validator',
  [isAuthenticated, core, isAuthorized],
  // validate('checkMessage'),
  // decrypt,
  validate('cableTVValidator'),
  customerController.cableTVValidator
);

router.post(
  '/buy-cable-tv/:network/instant',
  [isAuthenticated, core, isAuthorized],
  // validate('checkMessage'),
  // decrypt,
  validate('buyCableTV'),
  customerController.buyInstantCableTV
);

router.post(
  '/buy-cable-tv/:network/schedule',
  [isAuthenticated, core, isAuthorized],
  // validate('checkMessage'),
  // decrypt,
  validate('buyCableTV'),
  customerController.buyScheduleCableTV
);

router.get(
  '/internet/:network/plans',
  [isAuthenticated, core, isAuthorized],
  customerController.getInternetPlans
);

router.get(
  '/electricity/:network/plans',
  [isAuthenticated, core, isAuthorized],
  customerController.getElectricityPlans
);

export default router;
