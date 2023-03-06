
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const clientId = "7fdc0cd8-36d5-4e4d-830f-c0897f6b6458"

const fhirUrl = urlParams.get('iss')
const launchId = urlParams.get('launch')

async function getWellKnown(){
    let response = await fetch(fhirUrl + '/.well-known/smart-configuration', {
        headers: {
            Accept: 'application/json'
        }
    })
    let wellKnown = await response.json()

    return wellKnown
}

function authorize(data){
    //.replace
    authEndpoint = data.authorization_endpoint;
    debugger;

    let auth_location = `${authEndpoint}?` +
        "response_type=code&" +
        `client_id=${clientId}&` +
        "redirect_uri=https%3A%2F%2Fgmodrogan.github.io%2Fmgw_soh%2Fafter-auth&" +
        `launch=${launchId}&` +
        "scope=user%2FPatient.read%20launch&" +
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



