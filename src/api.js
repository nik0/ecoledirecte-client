const endpoints = require("./endpoints");
const Student = require("./models/student");
const HomeworkDay = require("./models/HomeworkDay");
const Homework = require("./models/Homework");

class Api {
    constructor(loginAnswer) {
        this.token = loginAnswer.token;
        this.profile = loginAnswer.profile;
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

    async getHomeworksDay(id) {
        const response = await fetch(endpoints.HOMEWORKS.replace("{id}", id), {
            method: 'POST',
            body: 'data={}',
            headers: { "X-Token": this.token }
        });

        const data = await response.json();
        const result = [];
        Object.entries(data.data).forEach(([key, homeworkDayData]) => {
            result.push(new HomeworkDay(key, homeworkDayData, id, this) );
        });
        return result;


    }

    async getHomeworks(id, day) {
        const response = await fetch(endpoints.HOMEWORK_DAY.replace("{id}", id).replace("{day}", day), {
            method: 'POST',
            body: 'data={}',
            headers: { "X-Token": this.token }
        });

        const data = await response.json();
        const result = [];
        Object.entries(data.data.matieres).forEach(([key, homeworkData]) => {
            result.push(new Homework(data.data.date, homeworkData, id, this) );
        });
        return result;
    }
}

module.exports = Api;
