const axios = require("axios");

const BACKEND_HOST = process.env.BACKEND_HOST || "http://localhost:3000/api";

async function getApp() {
  try {
    const response = await axios.get(`${BACKEND_HOST}/app`);
    const HttpResponse = response.data;
    if (HttpResponse.success) {
      const theResponse = {
        ...HttpResponse.data,
        ...{
          year: new Date().getFullYear()
        }
      };
      return theResponse;
    }
    else return [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = {
  getApp
};