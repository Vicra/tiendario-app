const axios = require('axios');

class ProductService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async getProducts() {
        try {
            const response = await axios.get(`${this.host}/product`);
            let HttpResponse = response.data;
            console.log(HttpResponse);
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return [];
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async getLatestProducts() {
        try {
            const response = await axios.get(`${this.host}/product/latest`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return [];
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async postProduct(product) {
        try {
            const response = await axios.post(`${this.host}/product`, product);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async putProduct(product) {
        try {
            const response = await axios.put(`${this.host}/product/${product.id}`, product);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async getProductsByCategory() {
        try {
            const response = await axios.get(`${this.host}/product/catalog`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return [];
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async getProductById(id) {
        try {
            const response = await axios.get(`${this.host}/product/${id}`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return {};
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async searchProducts(keyword) {
        try {
            const response = await axios.get(`${this.host}/product/search/${keyword}`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return {};
            return response;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }
}

module.exports = new ProductService();