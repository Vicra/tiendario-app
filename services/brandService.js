const axios = require("axios");

class BrandService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async getBrands() {
        try {
            const response = await axios.get(`${this.host}/brand`);
            let HttpResponse = response.data;
            if (HttpResponse.success) return HttpResponse.data;
            else return HttpResponse;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async getBrandById(id) {
        try {
            const response = await axios.get(`${this.host}/brand/${id}`);
            let HttpResponse = response.data;
            if (HttpResponse.success) return HttpResponse.data;
            else return {};
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async postBrand(brand) {
        try {
            const response = await axios.post(`${this.host}/brand`, brand);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async putBrand(brand) {
        try {
            const response = await axios.put(
                `${this.host}/brand/${brand.id}`,
                brand
            );
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }
}

module.exports = new BrandService();
