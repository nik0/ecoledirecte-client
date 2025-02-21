const Api = require("../Api");
const { decodeBase64, isHTML, removeParagraphTags } = require("../utils");

class Homework {
    constructor(date, data, id, api) {
        this.date = date;
        this.data = data;
        this.api = api;
        this.id = id;
    }

    getDate() {
        return this.date;
    }

    getMatiere() {
        return this.data.matiere;
    }

    getDescription() {
    
        let description = decodeBase64(this.data.aFaire.contenu);
        description = removeParagraphTags(description);

        if(isHTML(description)) {
            return "Contenu HTML";
        }
        return description;
    }

    isDone() {
        return this.data.aFaire.effectue;
    }
}

module.exports = Homework;
