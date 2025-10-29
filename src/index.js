const collect = require('collect.js');
const notif = require('./libs/notif')

const config = require('./config.json')
const fs = require('fs')
const responsesConfiguration = require('./reponses.json')

const { isDeepStrictEqual } = require('util');
const { log } = require('console');
const port = 80;
const utf8 = require('utf8');
let dir = "./db"
let isDebugMode = false;


let headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "fr-FR,fr;q=0.9",
    "connection": "keep-alive",
    "content-type": "application/x-www-form-urlencoded",
    "dnt": "1",
    "origin": "https://www.ecoledirecte.com",
    "priority": "1",
    "referer": "https://www.ecoledirecte.com",
    "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "sec-fetch-dest": "",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
    };

start()

function Debug(message) {
    if (isDebugMode) {
        console.log(message);
    }
}
async function getDataFromUrl(url, token) {
    
    options = {
        method: "GET",
        headers: headers,
    };

    console.log("Avant fetch:" + url);
    const response = await fetch(url, options);
    const data = await response;

    if (!response.ok) {
        const message = `Erreur login ${response.status}`;
        console.log(message);
        throw new Error(message);
    }

    //return await response.json();
    return await data['headers'];
}

async function postDataFromUrl(url, token, data, cookie) {
    headers["x-gtk"] = cookie;
    options = {
        method: "POST",
        headers: headers,
        body: data
    };
    console.log(headers);
    console.log(data);
    const response = await fetch(url, options);
    if (!response.ok) {
        const message = `Erreur login ${response.status}`;
        console.log(message);
        throw new Error(message);
    }

    return await response.json();
}

async function start() {
	//notif.send('Ecole Directe Notifs', "On demarre", '')
//	try
	{	
		account = await getToken(config.username, config.pass)
		await checkIfNew(account[0], account[1])
	}
//	catch (error) {
//		console.error("Exception !!!!" + error)
//	} 
}

async function getToken(username, password) {
    let account = {};
    let token = {};

    console.log("avant");
    const headers = await getDataFromUrl("https://api.ecoledirecte.com/v3/login.awp?v=4.77.5&gtk=1", "");
    console.log(headers);
    const gtk = headers.get("set-cookie").split(";")[0].split("=")[1];
    //const gtk = headers.get("set-cookie").substring(4);
    console.log(gtk);
            //const cookies = headers.get("set-cookie").split(";")[0];
            //const cookies = headers.get("set-cookie").split(",")[1].split(";")[0];
//	    const cookies = setCookie.splitCookiesString(headers.get("set-cookie")).map(
//		    (cookie) => cookie.split(";")[0]
//	    )[0];
//	    const cookies2 = setCookie.splitCookiesString(headers.get("set-cookie")).map(
//		    (cookie) => cookie.split(";")[0]
//	    )[1];

    const encodedUser = encodeString(username);
    const encodedPass = encodeString(password);
    console.log(username +"*"+password+"*"+encodedUser+"*"+encodedPass);
    const loginUrl = "https://api.ecoledirecte.com/v3/login.awp?v=4.77.5";
    const loginData = `data={
        "identifiant":"${encodedUser}",
	"motdepasse":"${encodedPass}",
	"isRelogin" :"false"
	}`;

    const loginResponse = await postDataFromUrl(loginUrl, "", loginData, gtk);
    console.log(loginResponse); 
    console.log("****************"); 

    const code = loginResponse['code'];
    
    token = loginResponse['token']; 
    console.log("Standard login: " + code + "token=" + token + "**" + JSON.stringify(loginResponse));

    if (code === 200) { account =
		    loginResponse['data']['accounts']['0']['profile']['eleves']['0'];
    } else if (code === 250) { const doubleAuthUrl =
		    "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=get&v=4.72.0";
	    const doubleAuthData = "data={}";

	const doubleAuthResponse = await postDataFromUrl(doubleAuthUrl,
		loginResponse['token'], doubleAuthData); console.log("Get questions: " + doubleAuthResponse['code']);

	const question = Buffer.from(doubleAuthResponse["data"]["question"],
		'base64').toString('utf-8'); console.log("Question posée = " +
			question);

	const encodedResp =
		    Buffer.from(responsesConfiguration[question]).toString('base64');
	    console.log("Reponse si trouvée = " +
		    responsesConfiguration[question] + "*** encoded=" +
		    encodedResp); if (!encodedResp) { const message = `Erreur
		    reponse pour la question:`+ question;
			    notif.send(utf8.encode(message));

		console.log(message); throw new Error(message); } const
	    propositions = doubleAuthResponse["data"]["propositions"]; for
	    (const key in propositions) {
		    process.stdout.write(Buffer.from(propositions[key],
			    'base64').toString('utf-8') + ","); }
	    console.log("");

	const setQuestionUrl =
		    "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&v=4.72.0";
	    const setQuestionData = `data={ "choix": "${encodedResp}" }`;

	const setQuestionResponse = await postDataFromUrl(setQuestionUrl,
		loginResponse['token'], setQuestionData); console.log("set question: " + setQuestionResponse['code']);

	if (setQuestionResponse['code'] === 200) { const cn =
			setQuestionResponse['data']['cn']; const cv =
			setQuestionResponse['data']['cv'];

	    const loginAfterQuestionUrl =
			"https://api.ecoledirecte.com/v3/login.awp?v=4.72.0";
		const loginAfterQuestionData = `data={ "uuid": "",
		"identifiant": "${encodedUser}", "motdepasse":
		"${encodedPass}",
                "isReLogin": false,
                "cn": "${cn}",
                "cv": "${cv}",
                "fa": [{
                    "cn": "${cn}",
                    "cv": "${cv}"
                }]
            }`;

            const loginAfterQuestionResponse = await postDataFromUrl(loginAfterQuestionUrl, loginResponse['token'], loginAfterQuestionData);
            console.log("login après question: " + loginAfterQuestionResponse['code']);

            if (loginAfterQuestionResponse['code'] === 200) {
                token = loginAfterQuestionResponse['token'];
                account = loginAfterQuestionResponse['data']['accounts']['0']['profile']['eleves']['0'];
            }
        }
    }
    //console.log("Account=" + JSON.stringify(account));
    if (!account) {
        const message = `Erreur login`;
        console.log(message);
        throw new Error(message);
    }
    return [account, token];
}

function encodeString(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}

async function checkIfNew(account, token) {
    console.log("check new");
    console.log("check new: get all OK, ID=" + account.id + " token=" + token);

    const oldNote = retrieveAllNotes();
    const oldComp = retrieveAllComp();
    const oldMoyennes = retrieveAllMoyennes();

    const [newNotes, newCompetences, newMoyennes] = await getNewNotes(account.id, token);

    console.log("check new: get all2 OK");

    checkAndNotify(oldNote, newNotes, "note");
    checkAndNotify(oldComp, newCompetences, "competence");
    checkAndNotifyMoyennes(oldMoyennes, newMoyennes);
}

function checkAndNotifyMoyennes(oldData, newData) {

    const differences = findDifferentMoyenne(oldData, newData);
    if (differences.length === 0) {
        console.log(`Pas de nouvelle moyenne`);
        return;
    }

    console.log(`check new: Start find different moyenne`);
    for (const element of differences) {
    	console.log(element);
        console.log(formatNotificationMessageMoyenne(element));
        notif.send(utf8.encode(`Une nouvelle moyenne a été calculée)`), formatNotificationMessageMoyenne(element));
    }
    console.log(`check new: find moyenne ended`);


   saveMoyennes(newData);
}


function checkAndNotify(oldData, newData, type) {
    const differences = findDifferent(oldData, newData);

    if (differences.length === 0) {
        console.log(`Pas de nouvelle ${type}`);
        return;
    }

    console.log(`check new: Start find different ${type}`);
    const threshold = 4;
    if (differences.length > threshold) {
        console.log(`check new: plus de ${threshold} ${type}s`);
        const dataString = differences.map(element => element.matiere).join(" ");
        notif.send(utf8.encode(`Plus de ${threshold} ${type}s: ${dataString}`));
    } else {
        for (const element of differences) {
            console.log(element);
            //console.log(formatNotificationMessage(element, type));
            notif.send(utf8.encode(`Une nouvelle ${type} est arrivée`), formatNotificationMessage(element, type));
        }
    }
    console.log(`check new: find ${type} ended`);

    if (type === "note") {
        saveNotes(newData);
    } else if (type === "competence") {
        saveComp(newData);
    }
}

function formatCompetence(val) {
	switch (val) {
		case "0" : return "0";
		case "1" : return "1/Rouge";
		case "2" : return "2/Orange";
		case "3" : return "3/Bleu";
		case "4" : return "4/Vert";
		default: return "Je sais pas";
	}
}
function formatNotificationMessage(element, type) {
    if (type === "note") {
        return `${element.matiere}: ${element.type}: ${element.note}/${element.noteSur}`;
    } else if (type === "competence") {
        return `${element.matiere}: ${element.nom}: ${element.type}: ${element.text} => ` + formatCompetence(`${element.note}`);
    }
}

function formatNotificationMessageMoyenne(element) {
        return `${element.nom}: ${element.moyenne}/${element.moyenneClasse}`;
}

function saveNotes(allNotes) {
	
	console.log("check dir" + dir);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	
	try
	{
		fs.renameSync(dir + 'notes.json', dir + 'notes.json.old');
		fs.unlinkSync(dir + "/notes.json")
	}
	catch (err)
	{
	}

		
	console.log('Write Notes');
	fs.writeFileSync(dir + '/notes.json', JSON.stringify(allNotes), function (err) {
		if (err) throw err;
		console.log('Notes successfully updated !');
	});

	console.log("fin saveNotes");
}

function saveComp(allCompetences)
{
	console.log("check dir" + dir);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	
	try
	{
		fs.renameSync(dir + '/competences.json', dir + '/competences.json.old');
		fs.unlinkSync(dir + '/competences.json')
	}
	catch (err)
	{
	}

	console.log('Write competences');
	fs.writeFileSync(dir + '/competences.json', JSON.stringify(allCompetences), function (err) {
		if (err) throw err;
		console.log('Competences successfully updated !');
	});
}

function saveMoyennes(allMoyennes)
{
	console.log("check dir" + dir);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	
	try
	{
		fs.renameSync(dir + '/moyennes.json', dir + '/moyennes.json.old');
		fs.unlinkSync(dir + '/moyennes.json')
	}
	catch (err)
	{
	}

	console.log('Write moyennes');
	fs.writeFileSync(dir + '/moyennes.json', JSON.stringify(allMoyennes), function (err) {
		if (err) throw err;
		console.log('Moyennes successfully updated !');
	});
}

function findDifferent(old, newnotes) {
	let nouvelles = [];
	let found = false;

	for (let i = 0; i < newnotes.length; i++) {
		found = false;
		for (let ii = 0; ii < old.length && !found; ii++) {
			if (newnotes[i].id == old[ii].id) {
				found = true
			}
		}
		if (!found) {
		    nouvelles.push(newnotes[i])
		}
		
	}
	return nouvelles;
}

function findDifferentMoyenne(old, newMoyennes) {
	let nouvelles = [];
	let found = false;
	let tobeadded = false;
	for (let i = 0; i < newMoyennes.length; i++) {
		found = false;
		tobeadded = false;
		for (let ii = 0; ii < old.length && !found; ii++) {
			if (newMoyennes[i].nom == old[ii].nom) {
				found = true;
				if ((newMoyennes[i].moyenne != old[i].moyenne) || (newMoyennes[i].moyenneClasse != old[i].moyenneClasse)) 
				{
					tobeadded = true;
				}
			}
		}
		if (!found || tobeadded == true) {
	            nouvelles.push(newMoyennes[i])
		}
	}
	return nouvelles;
}


async function getNewNotes(id, token) {
    const url = `https://api.ecoledirecte.com/v3/eleves/${id}/notes.awp?verbe=get&v=4.72.0`;
    const data = "data={\n    \"anneeScolaire\": \"\"\n}";

    const body = await postDataFromUrl(url, token, data);
    //console.log("Get note: " + body['code']);
    //console.log("body: " + JSON.stringify(body));
    const allMoyennes = []; 
    body['data']['periodes'].forEach(p => {
	    //console.log("nom = " + p.periode + " date=" +  p.ensembleMatieres.dateCalcul + " Moyenne=" + p.ensembleMatieres.moyenneGenerale +  " Moyenne Classe=" + p.ensembleMatieres.moyenneClasse);
	    if (p.ensembleMatieres.moyenneGenerale && p.ensembleMatieres.moyenneGenerale !== "")
            {
		    const moyenneData = {
		    	nom: p.periode,
			moyenne: p.ensembleMatieres.moyenneGenerale,
			moyenneClasse: p.ensembleMatieres.moyenneClasse,
			date: p.ensembleMatieres.dateCalcul,
		    };
	    	allMoyennes.push(moyenneData);
            }
    });


    const allNotes = [];
    const allCompetences = [];

    body['data']['notes'].forEach(n => {
        const commonData = {
            id: n.id,
            nom: n.devoir,
            matiere: n.libelleMatiere,
            type: n.typeDevoir,
            date: n.date
        };
	    //console.log(" *** full note=" + JSON.stringify(n));

        if (n.valeur !== "") {
            const noteData = {
                ...commonData,
                coef: n.coef,
                note: n.valeur,
                noteSur: n.noteSur,
                MClasse: n.moyenneClasse,
                MinClasse: n.minClasse,
                MaxClasse: n.maxClasse
            };
            allNotes.push(noteData);
        } else {
	    n['elementsProgramme'].forEach(v =>
		 {
                   const competenceData = {
                       ...commonData,
                       note: v.valeur,
		       text: v.descriptif
		};
	    //console.log(JSON.stringify(competenceData.nom));
            allCompetences.push(competenceData);
          });
	}
    });

    //Debug(allNotes); // Afficher les notes détaillées
    // Debug(allCompetences); // Afficher les compétences

    return [allNotes, allCompetences, allMoyennes];
}



function retrieveAllNotes() {
  let allNotesData = {};
  try {
    allNotesData = JSON.parse(fs.readFileSync(`${dir}/notes.json`));
  } catch {
    // Do nothing
 }
  return allNotesData;
}


function retrieveAllComp() {
	let allCompData = {};
	try
	{
		allCompData = JSON.parse(fs.readFileSync(`${dir}/competences.json`))
	} catch {
		// Do nothing
	}

	return allCompData;
}

function retrieveAllMoyennes() {
	let allData = [];
	try
	{
		allData = JSON.parse(fs.readFileSync(`${dir}/moyennes.json`))
	} catch {
		// Do nothing
	}

	return allData;
}
