window.onload = function () {
  gapi.load('client', gapiStart);
}

function gapiStart() {

  gapi.client.init({
    'apiKey': 'AIzaSyBxaqGnNHGVfwrVoYRQkPfPJ8ywFVAboR0',
    // Your API key will be automatically added to the Discovery Document URLs.
    'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
    // clientId and scope are optional if auth is not required.
    'clientId': '518207079124-ps9bmo6dcjamcfk92kcc24m8tl5ep231.apps.googleusercontent.com',
    'scope': 'profile',
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.people.people.get({
      'resourceName': 'people/me',
      'requestMask.includeField': 'person.names'
    });
  }).then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.log('Error: ' + reason.result);
    console.log(JSON.stringify(reason))
  });


  // gapi.client.init(
  //   {
  //     "apiKey": "AIzaSyBxaqGnNHGVfwrVoYRQkPfPJ8ywFVAboR0",
  //     "clientId": "518207079124-ps9bmo6dcjamcfk92kcc24m8tl5ep231.apps.googleusercontent.com",
  //     "scope": "profile"
  //   }
  // ).then(function () {
  //   return gapi.client.request({
  //     "path": "https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names"
  //   })
  // }).then(function (response) {
  //   console.log(response.result);
  // }, function (reason) {
  //   console.log("Error " + reason.result)
  // })
}




function logout() {

}

function googleIdentityInit() {
  google.accounts.id.initialize(
    {
      client_id: "518207079124-ps9bmo6dcjamcfk92kcc24m8tl5ep231.apps.googleusercontent.com",
      callback: handleCredentialResponse
    }
  );

  let buttonElement = document.querySelector<HTMLElement>("#buttonDiv");

  if (buttonElement instanceof HTMLElement) {
    google.accounts.id.renderButton(
      buttonElement,
      {
        theme: "outline",
        size: "large",
        type: "standard"
      }
    );

  }
  google.accounts.id.prompt();
}


function handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
  console.log("Encoded JWT ID token:" + response.credential);

}

//https://praveenith.medium.com/google-login-for-web-in-2023-fe5f221a033
//https://overclocked.medium.com/seamless-api-access-with-google-identity-services-b9901009a8ce