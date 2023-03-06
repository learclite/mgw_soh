const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code')
const state = urlParams.get('state')
const clientId = "7fdc0cd8-36d5-4e4d-830f-c0897f6b6458"

const tokenEndpoint = 'https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/token'
const fhirUrl = 'https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/'

var accessTokenPostBody = {
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': clientId,
    'redirect_uri': 'https://gmodrogan.github.io/mgw_soh/after-auth'
};

function getWwwFormUrlEncodedData(data){
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}

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

async function getPatient(id){
    let response = await fetch(fhirUrl + '/Patient/' + id, {
        headers: {
            Accept: 'application/json'
        }
    })
    return await response.json()
}

getAccessToken().then((data) => {
    debugger
    patient = data.patient
    encounter = data.encounter
    user = data.user
    token = data.access_token
    // initiate patient read call

    getPatient(patient).then((data) => {
        console.log(data)
    }).catch((err) => {
        debugger
        console.log('error fetching patient data')
    })

}).catch((err) => {
    debugger
    console.log('error fetching access token')
})