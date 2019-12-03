// If the auth2 module hasn't loaded in 10 seconds, something bad has happened and we should alert the user.
const AUTH2_LOAD_TIMEOUT_MS = 10000;

// This assumes that gapi has been loaded onto the window object prior to this module being loaded. Google does not
// provide its javascript libraries as npm packages and therefor recommends always fetching them asynchronously at
// pageload time.
const auth2Load = new Promise((resolve, reject) => {
  const auth2LoadTimer = window.setTimeout(reject, AUTH2_LOAD_TIMEOUT_MS);
  window.gapi.load('auth2', () => {
    window.clearTimeout(auth2LoadTimer);
    resolve();
  });
});

function init(options) {
  return new Promise((resolve, reject) => {
    auth2Load.then(() => window.gapi.auth2.init(options).then(resolve, reject)).catch(reject);
  });
}

function describeUser(user) {
  const profile = user.getBasicProfile();
  const authResponse = user.getAuthResponse(true);
  return {
    name: profile.getName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail(),
    isSignedIn: user.isSignedIn(),
    accessToken: authResponse.access_token,
    accessTokenExpiration: authResponse.expires_at,
  };
}

// return a user object that is not tied to the Google API
export function getUser(options) {
  return new Promise((resolve, reject) => {
    init(options)
      .then(GoogleAuth => {
        const user = GoogleAuth.currentUser.get();
        resolve(user.isSignedIn() ? describeUser(user) : null);
      })
      .catch(reject);
  });
}

export function renderLoginButton(options) {
  return new Promise((resolve, reject) => {
    window.gapi.signin2.render(options.id, {
      scope: options.scopes.join(' '),
      theme: 'dark',
      longtitle: true,
      onsuccess: user => resolve(describeUser(user)),
      onfailure: reject,
    });
  });
}

export function logout(options) {
  return new Promise((resolve, reject) => {
    init(options).then(GoogleAuth => {
      GoogleAuth.signOut()
        .then(resolve)
        .catch(reject);
    });
  });
}
