const axios = require('axios');

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
async function callApi(endpoint, method = 'get', accessToken = '', body = '') {

    let options = {};
    if (accessToken != '') {
        options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
    }
    

    console.log('request made to web API at: ' + new Date().toString());

    try {
        let response = {};
        if (method == 'post') {
            response = await axios.post(endpoint, body, options);
        } else {
            response = await axios.get(endpoint, options);
        }

        return (response) ? response.data : {};
    } catch (error) {
        console.log(error)
        return error;
    }
};


module.exports = {
    callApi: callApi
};