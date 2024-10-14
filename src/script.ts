// https://console.cloud.google.com/apis/dashboard
// https://developers.google.com/identity/protocols/oauth2/scopes

// https://getmdl.io/index.html


import { jwtDecode } from "jwt-decode";

// krank23's stuff
// const APIKEY = 'AIzaSyBxaqGnNHGVfwrVoYRQkPfPJ8ywFVAboR0';
// const CLIENTID = '518207079124-ps9bmo6dcjamcfk92kcc24m8tl5ep231.apps.googleusercontent.com';

// @ga.ntig stuff
const APIKEY = 'AIzaSyCFRPpwvxxNpQF7CZ_0uWW6SrpeKrZHuVY';
const CLIENTID = '360610471664-0n756lc9klvv8d0iotej8a3bkudndbs8.apps.googleusercontent.com';

// Generic
const DISCOVERY = 'https://people.googleapis.com/$discovery/rest';
const SCOPE = 'https://www.googleapis.com/auth/classroom.courses.readonly';

window.onload = function () {
  loadLibraries(CLIENTID, APIKEY, DISCOVERY).then((value) => {
    button("buttonDiv");
  });
}


function loadLibraries(client_id: string, api_key: string, discovery: string) {

  let googReady = false;
  let gapiReady = false;

  let pass: (value?: unknown) => void;
  let fail: (reason?: any) => void;

  fail = () => { };

  let ready = new Promise((resolve, reject) => {
    pass = resolve;
    fail = reject;
  });

  function _allReady() {
    if (googReady && gapiReady) {
      pass();
    }
  }

  function _gapiSetup() {
    let _gapi = window.gapi;
    _gapi.load('client', async () => {
      await gapi.client.init({
        apiKey: api_key,
        discoveryDocs: [discovery],
      });
      gapiReady = true;
      _allReady();
    });
  }

  function _googReady() {
    let _google = window.google;

    google.accounts.id.initialize({
      client_id: client_id,
      auto_select: true,
      callback: on_response
    });

    googReady = true;
    _allReady();
  }

  // GIS Library, loads itself onto the window as 'google'
  const googscr = document.createElement('script');
  googscr.type = 'text/javascript';
  googscr.src = 'https://accounts.google.com/gsi/client';
  googscr.defer = true;
  googscr.onload = _googReady;
  googscr.onerror = fail;
  document.getElementsByTagName('head')[0].appendChild(googscr);

  // GAPI Library, loads itself onto the window object as 'gapi'
  const gapiscr = document.createElement('script');
  gapiscr.type = 'text/javascript';
  gapiscr.src = 'https://apis.google.com/js/api.js';
  gapiscr.defer = true;
  gapiscr.onload = _gapiSetup;
  gapiscr.onerror = fail;
  document.getElementsByTagName('head')[0].appendChild(gapiscr);

  return ready;

}

interface GoogleToken {
  email: string;
  family_name: string;
  given_name: string;
  picture: string;
  name: string;
}

// Runs when user has been auth:ed
async function on_response(response) {
  if (response && response.credential) {
    const rawdata = jwtDecode<GoogleToken>(response.credential);
    const user = (({ email, family_name, given_name, picture, name }) => ({ email, family_name, given_name, picture, name }))(rawdata);
    console.log(user.name);
    window.localStorage.setItem('gothic-id', 'loaded');

    console.log("Successfully got authentication token.");
    console.log("Now trying for authorization");

    authorizeApiUsage(CLIENTID, SCOPE, user)
      .then((value) => {
        console.log("Yes, you may");
        console.log("looking for courses…");
        gapi.client.load('https://classroom.googleapis.com/$discovery/rest').then((value) => {
          gapi.client.classroom.courses.list()
            .then((value) => {
              console.log(value);
            })
            .catch((reason) => {
              console.log(reason);
            });
        });
      })
      .catch((reason) => {
        console.log("No, you may not");
        console.log(reason);
      });
  }
}

function button(parentId: string, params = {}) {
  const container = document.getElementById(parentId);
  if (!container) return;

  const options: google.accounts.id.GsiButtonConfiguration = {
    type: "standard",
    theme: 'outline',
    size: 'medium',
    shape: 'pill',
    ...params
  };

  google.accounts.id.renderButton(container, options);
}

function authorizeApiUsage(clientId: string, scope: string, user) {
  return new Promise((res, rej) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope,
      hint: user.email,
      callback: (response) => {
        if (!response.access_token) {
          return rej('authorization-failed');
        }
        res(response.access_token);
      }
    });

    tokenClient.requestAccessToken({ prompt: '' });
  })
}