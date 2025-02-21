const endpoints = require("./endpoints");
const Student = require("./models/student");

class Api {
    constructor(token, profile) {
        this.token = token;
        this.profile = profile;
    }

    async getProfile() {
        return this.profile;
    }

    async getStudents() {
        return this.profile.profile.eleves.map(studentData => new Student(studentData, this));
    }

    async getNotes(id) {
        const response = await fetch(endpoints.NOTES.replace("{id}", id), {
            method: 'POST',
            body: 'data={"anneeScolaire": ""}',
            headers: { "X-Token": this.token }
        });
        
        const data = await response.json();
        return data.data.notes;
    }
}

module.exports = Api;
