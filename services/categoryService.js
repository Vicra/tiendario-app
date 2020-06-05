const axios = require('axios');

class CategoryService {
    constructor(){
        this.host = "http://localhost:3000/api";
    }

    async getCategories() {
        try {
          const response = await axios.get(`${this.host}/category`);
          console.log(response);
          let categories = response.data.data;
          return categories;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }
}

module.exports = new CategoryService();