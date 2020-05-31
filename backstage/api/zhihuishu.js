const CryptoJS = require('./CryptoJS.js')
const axios = require('axios')

const https = axios.create({
  baseURL: 'https://www.150s.cn',
  withCredentials: true,
});
module.exports = function zhs(question) {
  const re = new RegExp("\\'","g");
  let title = question.replace(re,'');
  
  let key = '39383033327777772e313530732e636e';
  key = CryptoJS.enc.Hex.parse(key)
  let enc = CryptoJS.AES.encrypt(title ,key)
  let secret = enc.ciphertext.toString()
  https.post('/topic/getSubject', {
    secret: secret,
    title: title
  }).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.log(error);
  });
  return new Promise((resolve, reject) => {
    resolve({
      title,secret
    })
  })
}
