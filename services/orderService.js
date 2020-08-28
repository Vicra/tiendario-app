const axios = require('axios');
// const request = require('request');

class OrderService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async postOrder(params, items) {
        console.log(params);
        try {
            let _items = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                _items.push({
                    id: item.item.id,
                    amount: item.quantity,
                    price: item.price
                });
            }
            
            let body = {
                items: _items
                , observations: params.observations || ""
                , type: params.deliveryRadio
                , customerId: params.customerId
                , address: params.address
            }
            let response = await axios.post(`${this.host}/order`, body);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error.response);
            return error.response.data;
        }
    }

    async postGuestOrder(params, items) {
        try {
            let _items = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                _items.push({
                    id: item.item.id,
                    amount: item.quantity,
                    price: item.price
                });
            }

            let response = await axios.post(`${this.host}/order`, {
                items: _items,
                name: params.name,
                phone: params.phone,
                observations: params.observations || "",
                type: params.deliveryRadio,
                address: params.address || ""
            });
            return response.data;
        } catch (error) {
            console.log(error.response);
            return error.response.data;
        }
    }

    async getNewOrders() {
        try {
            let response = await axios.get(`${this.host}/order/newOrders`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return [];
        }
        catch (error) {
            console.log(error.response);
            return error.response.data;
        }
    }

    async getOrderById(id) {
        try {
            let response = await axios.get(`${this.host}/order/${id}`);
            let HttpResponse = response.data;
            if (HttpResponse.success)
                return HttpResponse.data;
            else
                return {};
        }
        catch (error) {
            console.log(error.response);
            return error.response.data;
        }
    }

    async approveOrder(orderId){
        try {
            let response = await axios.get(`${this.host}/order/approve/${orderId}`);
            let HttpResponse = response.data;
            return HttpResponse;
        }
        catch (error) {
            console.log(error.response);
            return error.response.data;
        }
    }

    async deliverOrder(orderId){
        try {
            let response = await axios.get(`${this.host}/order/deliver/${orderId}`);
            let HttpResponse = response.data;
            return HttpResponse;
        }
        catch (error) {
            console.log(error.response);
            return error.response.data;
        }
    }
}

module.exports = new OrderService();