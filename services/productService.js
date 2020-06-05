const axios = require('axios');

class ProductService {
    constructor(){
        this.host = "http://localhost:3000/api";
    }

    async getProducts() {
        try {
          const response = await axios.get(`${this.host}/product`);
          let products = response.data.data;
          return products;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async postProduct(product){
        console.log("product");
        console.log(product);
        try {
            const response = await axios.post(`${this.host}/product`, product);
            return response.data.data;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async getProductsByCategory(){
        try {
            const response = await axios.get(`${this.host}/product/catalog`);
            return response.data.data;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }
}

module.exports = new ProductService();