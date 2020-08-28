const axios = require('axios');

class SupplierService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async getSuppliers() {
        try {
            const response = await axios.get(`${this.host}/supplier`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return [];
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async getSupplierById(id) {
        try {
            const response = await axios.get(`${this.host}/supplier/${id}`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return {};
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async getLatestSuppliers() {
        try {
            const response = await axios.get(`${this.host}/supplier/latest`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return [];
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async postSupplier(supplier) {
        try {
            const response = await axios.post(`${this.host}/supplier`, supplier);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async putSupplier(supplier) {
        try {
            const response = await axios.put(`${this.host}/supplier/${supplier.id}`, supplier);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }
}

module.exports = new SupplierService();