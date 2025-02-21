const BASE_URL = "https://api.ecoledirecte.com/v3";
const VERSION = "4.72.0";
module.exports = {
    LOGIN: `${BASE_URL}/login.awp?v=${VERSION}`,
    NOTES: `${BASE_URL}/eleves/{id}/notes.awp?verbe=get&v=${VERSION}`,
    GET_QUESTIONS: `${BASE_URL}/connexion/doubleauth.awp?verbe=get&v=${VERSION}`,
    ANSWER_QUESTIONS: `${BASE_URL}/connexion/doubleauth.awp?verbe=post&v=${VERSION}`,
};
