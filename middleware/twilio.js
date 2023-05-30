// const twilio = require('twilio')
// require('dotenv').config();
// const ACCOUNTSID = 'AC5aba7e11c99e3f17a319b21e008c1f2d';
// const AUTHTOKEN = '5308470d875e7e1d088cf678d0fb020c';
// const sendMessage=function (mobile,res,next){
//     let randomOTP = Math.floor(Math.random() * 9000)+1000;
//         twilio(ACCOUNTSID, AUTHTOKEN).messages.create({
//             body: 'Hello , your otp is '+randomOTP ,
//             from: "Gamers Bootcamp", // Replace with your Twilio phone number
//             to: mobile // Replace with the recipient's phone number
// })
// .then(message => console.log(message.sid))
// .catch(error => console.log(error));
//    return randomOTP;
// }

// module.exports={
//     sendMessage,
// }

const accountSid = "ACd349a28375eba4390a900582cb445104";
const authToken = "39da592500ddd331877bc5aa82add448";
const verifySid = "VAe0975db36cfc398539e785fc2699e52b";
const client = require("twilio")(accountSid, authToken);
const express = require('express')

module.exports = {
  sentotp: (number) => {
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+91 ${number} `, channel: "sms" })
  },
  check: async (otpCode, number) => {
    try {
      const status = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91 ${number}`, code: otpCode });
      return status
    } catch (err) {
      console.log(err);
    }
  }
}
