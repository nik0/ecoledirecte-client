# 📚 EcoleDirecte Client

**`ecoledirecte-client`** est un module Node.js permettant d'interagir avec l'API d'**Ecole Directe** de manière simple et efficace.

---

## 🚀 Installation

```sh
npm install ecoledirecte-client
```

---

## 🔹 Importation et Connexion

### **Connexion à l'API**
```javascript
const { Auth, Api } = require("ecoledirecte-client");


async function main() {
    try {
        const auth = new Auth("questions.json");
        const api = new Api(await auth.login("MY_LOGIN", "MY_PASSWORD"));

        const profile = await api.getProfile();
        
        console.log("Profil's informations :");
        console.log("Name :", profile.nom);
        console.log("First name :", profile.prenom);
        
    } catch (error) {
        console.error(error.message);
    }
}

main();
```

---

## 🔍 Utilisation of the main features

### **📌 Get the list of students on a account**
```javascript
async function getStudentsExample() {
    const token = await Auth.login("identifiant", "motdepasse");
    const api = new Api(token);

    const students = await api.getStudents();
    console.log(students);
}

getStudentsExample();
```

---

### **📌 Get the notes of a student**
```javascript
async function getNotesExample() {
    const token = await Auth.login("identifiant", "motdepasse");
    const api = new Api(token);

    const students = await api.getStudents();
    if (students.length > 0) {
        const firstStudent = students[0];
        const notes = await firstStudent.getNotes();
        console.log(notes);
    }
}

getNotesExample();
```

---

### **📌 Get the homeworks day of a student**
```javascript
async function getHomeworksExample() {
    const token = await Auth.login("identifiant", "motdepasse");
    const api = new Api(token);

    const students = await api.getStudents();
    if (students.length > 0) {
        const firstStudent = students[0];
        const homeworksDay = await firstStudent.getHomeworksDay();
        console.log(homeworksDay);
    }
}

getHomeworksExample();
``` 

---

### **📌 Get the homeworks of a day**
```javascript
async function getHomeworksExample() {
    const token = await Auth.login("identifiant", "motdepasse");
    const api = new Api(token);

    const students = await api.getStudents();
    if (students.length > 0) {
        const firstStudent = students[0];
        const homeworksDay = await firstStudent.getHomeworksDay();
        if (homeworksDay.length > 0) {
            const firstHomeworksDay = homeworksDay[0];
            const homeworks = await firstHomeworksDay.getMore();
            console.log(homeworks);
        }
    }   
}

getHomeworksExample();
```

---

📉 **Example of `questions.json` :**
```json
    {
        "question": "Quelle est votre ville de résidence ?",
        "reponse": "Paris"
    },
```
 Several questions are possible, see the `questions.json.example` file for more information.
---

## 🛠️ Dependencies

- **Node.js >= 16** *(necessary for the module to work)*

---

## 🏠 Contribution

If you want to improve this project :
1. **Fork** the GitHub repo.
2. **Clone** the project :  
   ```sh
   git clone https://github.com/ton-user/ecoledirecte-client.git
   ```
3. **Installe les dépendances** :  
   ```sh
   npm install
   ```
4. **Create a branch and propose your changes**.

---

## 🐟 Licence

This project is under the **MIT** license. You can use it freely as long as you mention the original author.

---

## 💌 Contact

If you encounter a problem, open an **issue** on GitHub. 🚀
You can also reach me by email at `contact@pierre.ebele.fr` or `pierre@ebele.fr`
