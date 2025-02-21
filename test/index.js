const { Auth, Api } = require("../src/index");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
    try {
        
        const auth = new Auth("questions.json"); // Charge le fichier des réponses
        const token = await auth.login(process.env.USER, process.env.PASSWORD);
        
        console.log("Connexion réussie, token :", token);

        const api = new Api(token);
        const profile = await api.getProfile();
        console.log(profile);
    } catch (error) {
        console.error(error.message);
    }
}

main();
