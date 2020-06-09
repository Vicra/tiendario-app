const axios = require('axios');

class UserService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async isValidUser(user){
        console.log(user);
    }
}

module.exports = new UserService();