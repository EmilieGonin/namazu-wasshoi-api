const XIVAPI = require('@xivapi/js');
const xivapi = new XIVAPI({
  private_key: process.env.XIVAPI_KEY,
  language: "fr"
})

const fcId = process.env.FC_ID;

module.exports = { xivapi, fcId }
