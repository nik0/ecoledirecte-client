const fs = require("fs");
const endpoints = require("./endpoints");
const { encodeString, decodeBase64, encodeBase64 } = require("./utils");
const { log } = require("console");

class Auth {
    constructor(questionsFile = null) {
        this.questionsFile = questionsFile;
        this.questionsAnswers = this.loadQuestions();
    }
    
    loadQuestions() {
        if (this.questionsFile && fs.existsSync(this.questionsFile)) {
            try {
                return JSON.parse(fs.readFileSync(this.questionsFile, "utf-8"));
            } catch (error) {
                console.error("Erreur lors de la lecture du fichier JSON :", error);
            }
        }
        return {};
    }

    async login(username, password,cn,cv) {
        this.username = username; 
        this.password = password;
        let loginData = `data={
            "identifiant": "${encodeString(username)}",
            "motdepasse": "${encodeString(password)}"
        }`;
        if(cn && cv) {
            loginData = `data={
                "identifiant": "${encodeString(username)}",
                "motdepasse": "${encodeString(password)}",
                "fa":[{
                    "cn": "${encodeString(cn)}",
                    "cv": "${encodeString(cv)}"
                }]
            }`;
        }
        try {
            const response = await fetch(endpoints.LOGIN, {
                method: 'POST',
                body: loginData
            });
            const data = await response.json();
            if (data.code === 200) {
                return {
                    token: data.token,
                    profile: data.data.accounts[0]
                };
            } else if (data.code === 250) {
                const questionToken = data.token;
                let question = await this.getQuestion(questionToken);
                let answer = await this.getAnswer(decodeBase64(question), await this.loadQuestions());

                if (!answer) {
                    console.log("⚠️  Réponse non trouvée dans le fichier");
                    return;
                }

                return await this.answerToQuestion(encodeBase64(answer), questionToken);
            } else {
                throw new Error("Échec de l'authentification : identifiants incorrects.");
            }
        } catch (error) {
            throw new Error(`Erreur de connexion : ${error.message}`);
        }
    }

    async getQuestion(questionToken) {
        try {
            const response = await fetch(endpoints.GET_QUESTIONS, {
                method: 'POST',
                headers: {
                    'x-token': questionToken
                },
                body: 'data={}'
            });
            const data = await response.json();
            return data.data.question;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de la question : ${error.message}`);
        }
    }

    async answerToQuestion(answer, questionToken) {
        try {
            const dataInput = `data={
                "choix": "${encodeString(answer)}"
            }`;
            const response = await fetch(endpoints.ANSWER_QUESTIONS, {
                method: 'POST',
                headers: {
                    'x-token': questionToken
                },  
                body: dataInput
            });
    
            const data = await response.json();
    
            if (data.code === 200) {
                const cn = data.data.cn; 
                const cv = data.data.cv;    
                return await this.login(this.username, this.password, cn, cv); 
            } else {
                console.log(data);
                console.log(answer);
                throw new Error("Réponse incorrecte.");
            }
        } catch (error) {
            throw new Error(`Erreur lors de la soumission de la réponse : ${error.message}`);
        }
    }
    
    
    getAnswer(question, answers) {
        for (const answer of answers) {
            if (question.startsWith(answer.question)) {
                return answer.reponse;
            }
        }
        return null; 
    }
    
}

module.exports = Auth;
