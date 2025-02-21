const Api = require("../Api");

class Student {
    constructor(data, api) {
        this.id = data.id;
        this.name = data.nom;
        this.firstName = data.prenom;
        this.class = data.classe;
        this.api = api;
    }

    getId() {
        return this.id;
    }

    getFullName() {
        return `${this.firstName} ${this.name}`;
    }

    getClass() {
        return this.class.libelle;
    }

    async getNotes() {    
        return this.api.getNotes(this.id);
    }

    async getHomeworks() {
        return this.api.getHomeworks(this.id);
    }
}

module.exports = Student;
