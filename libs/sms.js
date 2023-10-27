const twilio = require("twilio");

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
const accountSid = "ACd3c36a17181833d4c8111949e4471e6c";
const authToken = "8614cdb827aa017c395e3090ee1bbabc";
const client = require("twilio")(accountSid, authToken);

module.exports = {
  async sendVerificationCode(phoneNumber, code) {
    return await client.messages
      .create({
        body: `your verfication code is ${code}`,
        from: "+16562187819",
        to: phoneNumber,
      })
      .then((message) => console.log(message.sid))
      .done();
    // return await client.verify.v2
    //   .services(process.env.TWILIO_ACCOUNT_VERIFY_SID)
    //   .verifications.create({ to: phoneNumber, channel: "sms" });
  },

  async verificationCode(phoneNumber, code) {
    return await client.verify
      .services(process.env.TWILIO_ACCOUNT_VERIFY_SID)
      .verificationChecks.create({ code, to: phoneNumber });
  },
};
