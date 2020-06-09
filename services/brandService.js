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

    async getBrandById(id) {
        try {
          const response = await axios.get(`${this.host}/brand/${id}`);
          let brand = response.data.data;
          return brand;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async postBrand(brand){
        try {
            const response = await axios.post(`${this.host}/brand`, brand);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async putBrand(brand){
        try {
            const response = await axios.put(`${this.host}/brand/${brand.id}`, brand);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }
}

module.exports = new BrandService();