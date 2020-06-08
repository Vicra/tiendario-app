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
}

module.exports = new SupplierService();