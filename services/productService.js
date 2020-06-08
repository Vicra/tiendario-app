const axios = require('axios');

class ProductService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async getProducts() {
        try {
            const response = await axios.get(`${this.host}/product`);
            let products = response.data.data;
            return products;
        } catch (error) {
            if (error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async postProduct(product) {
        try {
            const response = await axios.post(`${this.host}/product`, product);
            return response.data.data;
        } catch (error) {
            if (error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async putProduct(product){
        console.log(product);
        try {
            const response = await axios.put(`${this.host}/product/${product.id}`, product);
            console.log(response);
            return response.data.data;
        } catch (error) {
            if (error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async getProductsByCategory() {
        try {
            const response = await axios.get(`${this.host}/product/catalog`);
            return response.data.data;
        } catch (error) {
            if (error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async getProductById(id){
        try {
            const response = await axios.get(`${this.host}/product/${id}`);
            let product = response.data.data;
            return product;
        } catch (error) {
            if (error.response)
                console.log(error.response.body);
            return [];
        }
    }
}

module.exports = new ProductService();