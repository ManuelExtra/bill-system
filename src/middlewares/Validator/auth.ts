import { body, check, oneOf, ValidationChain } from "express-validator";
import validate from "./baseValidator";

// Helpers
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const is_valid_object = (object: object) =>
  object && typeof object == "object" && Array.isArray(object) == false;
const is_valid_fields = (keys: [], parent: any) =>
  keys.every((d: number) => {
    if (!is_valid_object(parent[d])) return false;
    if (!parent[d].hasOwnProperty("is_active")) return false;
    if (typeof parent[d].is_active != "boolean") return false;
    if (!parent[d].opening_time) return false;
    if (!parent[d].closing_time) return false;

    return true;
  });

const validationRules = (input: string): ValidationChain => {
  let message: ValidationChain = check("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isBase64()
    .withMessage("Message must be in a base64 format");
  switch (input) {
    case "checkMessage":
      message = check("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required.")
        .isBase64()
        .withMessage("Message must be in a base64 format");
    case "buyAirtime":
      (message = check("amount")
        .trim()
        .notEmpty()
        .withMessage("AMOUNT is required.")
        .isNumeric()
        .withMessage("AMOUNT must be a number.")),
        check("phone_number")
          .trim()
          .notEmpty()
          .withMessage("PHONE NUMBER is required."),
        check("account_type")
          .trim()
          .notEmpty()
          .withMessage("ACCOUNT TYPE is required.");
    case "buyData":
      message = check("biller_name")
        .trim()
        .notEmpty()
        .withMessage("BILLER NAME is required.");
      check("item_code")
        .trim()
        .notEmpty()
        .withMessage("ITEM CODE is required.");
      check("amount")
        .trim()
        .notEmpty()
        .withMessage("AMOUNT is required.")
        .isNumeric()
        .withMessage("AMOUNT must be a number."),
        check("phone_number")
          .trim()
          .notEmpty()
          .withMessage("PHONE NUMBER is required."),
        check("account_type")
          .trim()
          .notEmpty()
          .withMessage("ACCOUNT TYPE is required.");
    case "buyCableTV":
      (message = check("biller_name")
        .trim()
        .notEmpty()
        .withMessage("BILLER NAME is required.")),
        check("item_code")
          .trim()
          .notEmpty()
          .withMessage("ITEM CODE is required."),
        check("amount")
          .trim()
          .notEmpty()
          .withMessage("AMOUNT is required.")
          .isNumeric()
          .withMessage("AMOUNT must be a number."),
        check("smartcard_number")
          .trim()
          .notEmpty()
          .withMessage("SMARTCARD NUMBER is required."),
        check("account_type")
          .trim()
          .notEmpty()
          .withMessage("ACCOUNT TYPE is required.");
    case "cableTVValidator":
      (message = check("biller_name")
        .trim()
        .notEmpty()
        .withMessage("BILLER NAME is required.")),
        check("item_code")
          .trim()
          .notEmpty()
          .withMessage("ITEM CODE is required."),
        check("smartcard_number")
          .trim()
          .notEmpty()
          .withMessage("SMARTCARD NUMBER is required.");
    case "phoneNumberValidator":
      message = check("phone_number")
        .trim()
        .notEmpty()
        .withMessage("PHONE NUMBER is required.");
  }
  return message;
};

export default (routeValidation: string) => [
  validationRules(routeValidation),
  validate,
];
