const axios = require('axios');
// const request = require('request');

class OrderService {
    constructor() {
        this.host = "http://localhost:3000/api";
    }

    async postOrder(params, items) {
        try {
            let _items = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                _items.push({
                    id: item.id,
                    amount: item.amount,
                    price: item.price
                });
            }
            
            let body = {
                items: _items
                , observations: params.observations || ""
                , type: params.deliveryRadio
                , customerId: params.customerId
                , address: params.address
                , subtotal: params.subtotal
                , delivery: params.delivery
                , total: params.total
            }
            let response = await axios.post(`${this.host}/order`, body);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    async postGuestOrder(params, items) {
        try {
            let _items = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                _items.push({
                    id: item.id,
                    amount: item.amount,
                    price: item.price
                });
            }
            let response = await axios.post(`${this.host}/order/guestOrder`, {
                items: _items,
                name: params.name,
                phone: params.phone,
                observations: params.observations || "",
                type: params.deliveryRadio,
                address: params.address || ""
            });
            return response.data;
        } catch (error) {
            console.log(error);
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

    async putOrder(order){
        try {
            let response = await axios.put(`${this.host}/order/${order.id}`, order);
            let HttpResponse = response.data;
            return HttpResponse;
        }
        catch (error) {
            console.log(error.response.config);
            console.log(error.response.request);
            return error.response;
        }
    }
}

module.exports = new OrderService();