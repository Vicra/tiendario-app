const axios = require('axios');

class SupplierService {
    constructor(){
        this.host = "http://localhost:3000/api";
    }

    async getSuppliers() {
        try {
          const response = await axios.get(`${this.host}/supplier`);
          let suppliers = response.data.data;
          return suppliers;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async getSupplierById(id) {
        try {
          const response = await axios.get(`${this.host}/supplier/${id}`);
          let supplier = response.data.data;
          return supplier;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async getLatestSuppliers(){
        try {
          const response = await axios.get(`${this.host}/supplier/latest`);
          let suppliers = response.data.data;
          return suppliers;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async postSupplier(supplier){
        try {
            const response = await axios.post(`${this.host}/supplier`, supplier);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async putSupplier(supplier){
        try {
            const response = await axios.put(`${this.host}/supplier/${supplier.id}`, supplier);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }
}

module.exports = new SupplierService();