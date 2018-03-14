import base64 from 'base-64';

const CLIENT_ID = 'da8839c7cf3bc018dd42';
const CLIENT_SECRET = '8a007f131c97c937532910627748a984a876d1e0';
const GITHUB_AUTH_API = 'https://api.github.com/authorizations';

/**
 * Create and fetch the a token from github api. Reference:
 * https://github.com/apollographql/GitHub-GraphQL-API-Example/blob/master/githubLogin.js
 * @param  {String} username the username of the user
 * @param  {String} password the password of the user
 * @return {Promise}         the Promise, when resolve, either return the token or get an error
 */
export default (username = '', password = '') => {
  const bytes = username.trim() + ':' + password.trim();
  const encoded = base64.encode(bytes);

  return fetch(GITHUB_AUTH_API, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + encoded,
      'User-Agent': 'React Native GitHub Client',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scopes: ['user', 'repo', 'notifications'],
    }),
  }).then(response => {
    const isValid = response.status < 400;
    return response.json().then(json => {
      if (isValid) {
        return json.token;
      } else {
        throw new Error(json.message);
      }
    });
  });
};
