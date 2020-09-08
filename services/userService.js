const axios = require('axios');

class UserService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async isValidUser(user) {
        try {
            let response = await axios.post(`${this.host}/user/login`, {
                email: user.email,
                password: user.password
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async postUser(user) {
        try {
            let response = await axios.post(`${this.host}/user`, {
                email: user.email,
                password: user.password,
                name: user.name,
                phone: user.phone,
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getAddresses(customerId) {
        try {
            let response = await axios.get(`${this.host}/user/addresses/${customerId}`);
            let HttpResponse = response.data;
            let addresses = [];
            if (HttpResponse.success) {
                addresses = HttpResponse.data;
            }

            for (let i = 0; i < addresses.length; i++) {
                if (addresses[i].type == "1") {
                    addresses[i].typeName = "Casa"; 
                }
                else if (addresses[i].type == "2") {
                    addresses[i].typeName = "Trabajo";
                }
                else if (addresses[i].type == "3") {
                    addresses[i].typeName = "Otro";
                }
            }
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async postAddress(address) {
        try {
            let response = await axios.post(`${this.host}/user/address`, {
                description: address.description
                , reference: address.reference
                , typeId: address.typeId
                , customerId: address.customerId
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async verifyUser(key){
        try {
            let response = await axios.post(`${this.host}/user/verify/${key}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }
}

module.exports = new UserService();