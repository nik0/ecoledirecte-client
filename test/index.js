const { Auth, Api } = require("../src/index");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
    try {
        const auth = new Auth("./test/questions.json");

        const api = new Api(await auth.login(process.env.USER, process.env.PASSWORD));

        const profile = await api.getProfile();
        
        console.log("Informations du profil :");
        console.log("Nom :", profile.nom);
        console.log("Prénom :", profile.prenom);
        console.log("Type de compte :", profile.typeCompte);
        
        const students = await api.getStudents();
        console.log("Liste des étudiants :");
        
        students.forEach(async (student) => {
            console.log(`${student.getFullName()} - Classe : ${student.getClass()}`);
            const notes = await student.getNotes();
            //console.log(notes);
        });

        const homeworksDay = await api.getHomeworksDay(students[0].getId());
        homeworksDay.forEach(async (homeworkDay) => {
            console.log("Date : " + homeworkDay.getDate() + " - Nombre de devoirs : " + homeworkDay.getSize());
            let homeworks = await homeworkDay.getMore();
            homeworks.forEach(async (homework) => {
                console.log(homework.getMatiere() + " - " + homework.getDescription() + " - " + homework.isDone());
            });
        });

        
    } catch (error) {
        console.error(error.message);
    }
}

main();