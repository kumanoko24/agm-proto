const crypto = require("node:crypto");
const { Buffer } = require("node:buffer");
const http = require("node:http");
const https = require("node:https");

const lodash = require("lodash");

const nanoid = require("nanoid");

const Papa = require("papaparse");

const axios = require("axios").default;
const theAxios = axios.create({
  timeout: 60 * 1000,
  maxContentLength: 64 * 1024 * 1024,
  maxBodyLength: 64 * 1024 * 1024,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

function sha256Text(input) {
  return "0x" + crypto.createHash("sha256").update(input).digest("hex");
}

function sha512Text(input) {
  return "0x" + crypto.createHash("sha512").update(input).digest("hex");
}

function sha3_256Text(input) {
  return "0x" + crypto.createHash("sha3-256").update(input).digest("hex");
}

function sha3_512Text(input) {
  return "0x" + crypto.createHash("sha3-512").update(input).digest("hex");
}

function getBuiltInComputationHelpers() {
  return {
    Lodash: lodash,
    Hashes: {
      sha256Text,
      sha512Text,
      sha3_256Text,
      sha3_512Text,
    },
    Buffer,
    parseInt,
    parseFloat,
    Math,
    TextEncoder,
    TextDecoder,
    RegExp,
    Promise,
    BigInt,
    DecodeURI: decodeURI,
    EncodeURI: encodeURI,
    DecodeURIComponent: decodeURIComponent,
    EncodeURIComponent: encodeURIComponent,
    Error,
    String,
    Number,
    JSON,
    Map,
    Set,
    Convert: {
      JSON2CSV: Papa.unparse,
      CSV2JSON: Papa.parse,
    },
    Date,
    setImmediate,
    setTimeout,
  };
}

const randomUUIDv4 = () => crypto.randomUUID();
const randomIDAny = nanoid.customAlphabet(
  "0123456789qazwsxedcrfvtgbyhnujmiklopQAZWSXEDCRFVTGBYHNUJMIKLOP",
  64
);
const randomBytes = (n) => "0x" + crypto.randomBytes(n).toString("hex");

function getBuiltInIOHelpers() {
  return {
    Random: {
      UUIDv4: randomUUIDv4,
      IDAny: randomIDAny,
      Bytes: randomBytes,
    },
    Storage: {
      KeyValueDatabase: null,
      DocumentDatabase: null,
      GraphDatabase: null,
    },
    Http: {
      Client: theAxios,
      Methods: {
        Get: null,
        Post: null,
        Put: null,
        Delete: null,
      },
    },
    Date,
    setImmediate,
    setTimeout,
    Event: {
      Emit: null,
      Search: null,
    },
  };
}

module.exports.getBuiltInComputationHelpers = getBuiltInComputationHelpers;

module.exports.getBuiltInIOHelpers = getBuiltInIOHelpers;
