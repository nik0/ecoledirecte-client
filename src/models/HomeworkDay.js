const Api = require("../Api");

class HomeworkDay {
    constructor(date, data, id, api) {
        this.date = date;
        this.all = data;
        this.api = api;
        this.id = id;
    }

    getDate() {
        return this.date;
    }

    getSize() {
        return this.all.length;
    }

    async getMore() {
        return this.api.getHomeworks(this.id, this.date);
    }
}

module.exports = HomeworkDay;
