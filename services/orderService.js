const axios = require('axios');
// const request = require('request');

class OrderService {
    constructor(){
        this.host = "http://localhost:3000/api";
    }

    async postOrder(params, items) {
        try {
            let _items = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                _items.push({
                    id:item.item.id,
                    amount:item.quantity,
                    price:item.price
                });
            }

            let response = await axios.post(`${this.host}/order`, {
                items: _items,
                name: params.name,
                phone: params.phone,
                observations : params.observations || "",
                type: params.deliveryRadio,
                address: params.address || ""
            });
            console.log(response);
            return;
        } catch (error) {
            console.log(error);
            if(error.response)
                console.log(error.response.body);
            return;
        }
    }

    async getNewOrders(){
        try{
            let response = await axios.get(`${this.host}/order/newOrders`);
            return response.data.data;
        }
        catch(error){
            console.log(error);
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }

    async getOrderById(id){
        try{
            let response = await axios.get(`${this.host}/order/${id}`);
            return response.data.data;
        }
        catch(error){
            console.log(error);
            if(error.response)
                console.log(error.response.body);
            return [];
        }
    }
}

module.exports = new OrderService();