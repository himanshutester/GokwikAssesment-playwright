require('dotenv').config();

const env = {
  baseURL: process.env.BASE_URL,

  login: {
    email: process.env.LOGIN_EMAIL,
    password: process.env.LOGIN_PASSWORD,
    otp: process.env.LOGIN_OTP
  },

  merchantId: process.env.MERCHANT_ID,

  headless: process.env.HEADLESS === 'true'
};

module.exports = env;
