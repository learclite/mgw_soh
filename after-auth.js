import { Cookie, getWwwFormUrlEncodedData } from "./helpers.js";
import { clientId, redirectUri} from './config.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code')
const state = urlParams.get('state')

const tokenEndpoint = Cookie.get("token_endpoint")
const fhirUrl = Cookie.get("fhir_url")

var accessTokenPostBody = {
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': clientId,
    'redirect_uri': redirectUri
};

async function getAccessToken(){
    let response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: getWwwFormUrlEncodedData(accessTokenPostBody)
    })
    let token = await response.json()
    return token
}

async function getPatient(){
    let token_data_cookie = Cookie.get('token_data')
    const token_data = token_data_cookie != undefined ? JSON.parse(token_data_cookie) : null;
    if (!token_data.access_token || !token_data.patient) {
        console.log('no access token or patient found in cookie')
        return
    }

    let response = await fetch(fhirUrl + '/Patient/' + token_data.patient, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token_data.access_token}`
        }
    })
    return await response.json()
}

Cookie.rem('token_data')
getAccessToken().then((data) => {
    debugger
    if (data.error) {
        console.log('error fetching token' + data.error_uri)
        return
    }

    Cookie.set('token_data', JSON.stringify(data), {secure: true, "max-age": 900})

    getPatient().then((data) => {
        console.log(data)
    }).catch((err) => {
        debugger
        console.log('error fetching patient data')
    })

}).catch((err) => {
    debugger
    console.log('error fetching access token')
})