import {Cookie} from "./helpers.js";
import {clientId, redirectUri} from './config.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);

const fhirUrl = urlParams.get('iss')

Cookie.set('fhir_url', fhirUrl, {secure: true, "max-age": 3600})

const launchId = urlParams.get('launch')

async function getWellKnown() {
    let response = await fetch(fhirUrl + '/.well-known/smart-configuration', {
        headers: {
            Accept: 'application/json'
        }
    })

    return await response.json()
}

function authorize(data) {
    //.replace
    let authEndpoint = data.authorization_endpoint;
    let token_endpoint = data.token_endpoint;
    // let token_endpoint = "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/hosts/apigee.test/protocols/oauth2/profiles/smart-v1/token"
    Cookie.set('token_endpoint', token_endpoint, {secure: true, "max-age": 3600})

    debugger;

    let auth_location = `${authEndpoint}?` +
        "response_type=code&" +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURI(redirectUri)}&` +
        `launch=${launchId}&` +
        `scope=${encodeURIComponent("user/Patient.read launch fhirUser openid online_access user/Observation.read user/Immunization.read")}&` +
        "state=98wrghuwuogerg97&" +
        `aud=${fhirUrl}`
    location.assign(auth_location)
}


getWellKnown().then((data) => {
    authorize(data)
}).catch((err) => {
    debugger
    console.log('error fetching well-known')
})



