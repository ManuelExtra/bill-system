// const crypto = require("crypto")
const CryptoJS = require("crypto-js");
const fs = require("fs");

const constants = require("../config/constants");
/**
 * @function
 * Generate random string
 * @param {int} length string length
 * @returns {string} randomString
 */
function randomString(length: number) {
  let result = [];
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = length; i > 0; --i)
    result.push(chars[Math.floor(Math.random() * chars.length)]);
  return result.join("");
}

/**
 * @function
 * Generate random number string
 * @param {int} length string length
 * @returns {string} randomNumberString
 */
function randomNumberString(length: number) {
  let result = [];
  let chars = "0123456789";
  for (var i = length; i > 0; --i)
    result.push(chars[Math.floor(Math.random() * chars.length)]);
  return result.join("");
}

function encryptText(plainText: string) {
  // return crypto.publicEncrypt(
  //   {
  //     key: fs.readFileSync("public_key.pem", "utf8"),
  //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //     oaepHash: "sha256",
  //   },
  //   // We convert the data string to a buffer
  //   Buffer.from(plainText)
  // );
  return CryptoJS.AES.encrypt(plainText, constants.secret_key).toString();
}

function decryptText(encryptedText: string) {
  // return crypto.privateDecrypt(
  //   {
  //     key: fs.readFileSync("private_key.pem", "utf8"),
  //     // In order to decrypt the data, we need to specify the
  //     // same hashing function and padding scheme that we used to
  //     // encrypt the data in the previous step
  //     // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //     oaepHash: "sha256",
  //   },
  //   Buffer.from(encryptedText, 'base64')
  // );
  return CryptoJS.AES.decrypt(encryptedText, constants.secret_key).toString(
    CryptoJS.enc.Utf8
  );
}

export default {
  randomString,
  randomNumberString,
  encryptText,
  decryptText,
};
