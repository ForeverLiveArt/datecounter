const express = require('express');
const app = express();
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');
const { main_counter, kids_counter, auth_conf } = require('./app_api.js');


app.listen(process.env.PORT, () => console.log('App_started'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(auth(auth_conf));
app.use(cors());

async function accesssheet() {
    const doc = new GoogleSpreadsheet('1WhVKkrvFJH2lZnqiUbEX9_EzAl-hPHHBpubG8o04IHI');
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    }); 
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();  
    console.log(rows);
}

accesssheet();

app.post('/logged', (request, response) => {  
    if ( request.oidc.isAuthenticated() ) { 
        let userInfo = request.oidc.user;
        console.log(userInfo);
        response.json({ isLogged: 'true', user: userInfo });
     } else {
        response.json({ isLogged: 'false' });
     }
});

app.post('/api', (request, response) => {
    //if ( request.oidc.isAuthenticated() ) { 
        response.json(main_counter(request));
    // } else {
    //    response.json({ isLogged: 'false' });
    // }
});

app.post('/kids_api', (request, response) => {

    let answer = kids_counter(request);
    response.json(answer);
}); 