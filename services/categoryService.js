const axios = require('axios');

class CategoryService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async getCategories() {
        try {
            const response = await axios.get(`${this.host}/category`);
            let categories = response.data.data;
            return categories;
        } catch (error) {
            if (error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async getCategoryById(id) {
        try {
          const response = await axios.get(`${this.host}/category/${id}`);
          let category = response.data.data;
          return category;
        } catch (error) {
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async postCategory(category){
        try {
            const response = await axios.post(`${this.host}/category`, category);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async putCategory(category){
        try {
            const response = await axios.put(`${this.host}/category/${category.id}`, category);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }
}

module.exports = new CategoryService();