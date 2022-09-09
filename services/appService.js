function getApp() {
    try {
        const response = await axios.get(`${this.host}/app`);
        const HttpResponse = response.data;
        if (HttpResponse.success) return HttpResponse.data;
        else return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

module.exports = {
    getApp
}