const axios = require('axios');

class CategoryService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async getCategories() {
        try {
            const response = await axios.get(`${this.host}/category`);
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

    async getCategoryById(id) {
        try {
            const response = await axios.get(`${this.host}/category/${id}`);
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

    async postCategory(category) {
        try {
            const response = await axios.post(`${this.host}/category`, category);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async putCategory(category) {
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