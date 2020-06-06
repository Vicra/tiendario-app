const axios = require('axios');

class BrandService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async getBrands() {
        try {
            const response = await axios.get(`${this.host}/brand`);
            let brands = response.data.data;
            return brands;
        } catch (error) {
            if (error.response)
                console.log(error.response.body);
            return [];
        }
    }
}

module.exports = new BrandService();