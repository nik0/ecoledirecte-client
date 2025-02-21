const BASE_URL = "https://api.ecoledirecte.com/v3";

module.exports = {
    LOGIN: `${BASE_URL}/login.awp?v=6.22.4`,
    PROFILE: `${BASE_URL}/eleves`,
    NOTES: `${BASE_URL}/notes.awp`,
    GET_QUESTIONS: `${BASE_URL}/connexion/doubleauth.awp`,
    ANSWER_QUESTIONS: `${BASE_URL}/connexion/doubleauth.awp?verbe=post&v=4.53.4`,
};
