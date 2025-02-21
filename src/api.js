const endpoints = require("./endpoints");

class Api {
    constructor(token) {
        this.token = token;
    }

    async getProfile() {
        const response = await fetch(endpoints.PROFILE, {
            headers: { "X-Token": this.token }
        });
        const data = await response.json();
        return data.data;
    }

    async getNotes() {
        const response = await fetch(endpoints.NOTES, {
            headers: { "X-Token": this.token }
        });
        const data = await response.json();
        return data.data.notes;
    }
}

module.exports = Api;
