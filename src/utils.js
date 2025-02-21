function encodeString(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}

function decodeBase64(str) {
    return Buffer.from(str, 'base64').toString('utf-8');
}

function encodeBase64(str) {
    return Buffer.from(str).toString('base64');
}


module.exports = {
    encodeString,
    decodeBase64,
    encodeBase64
}