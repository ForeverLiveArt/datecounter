require('dotenv').config();

const express = require('express'),
    app = express(),
    cors = require('cors'),
    { GoogleSpreadsheet } = require('google-spreadsheet'),
    { auth, requiresAuth } = require('express-openid-connect'),
    { main_counter, health_counter, kids_counter, auth_conf } = require('./app_api.js');


app.listen(process.env.PORT, () => console.log('App_started'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(auth(auth_conf));
app.use(cors());
app.set('view engine', 'ejs');


app.get("/", function(request, response){
    response.render('home');
});

app.get("/kids", function(request, response){
    response.render('kids');
});

app.get("/health", function(request, response){
    response.render('health');
});

app.get("/karma", function(request, response){
    response.render('karma');
});


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
    response.json(kids_counter(request));
}); 


app.post('/health_api', (request, response) => {
    //if ( request.oidc.isAuthenticated() ) { 
        response.json(health_counter(request));
    // } else {
    //    response.json({ isLogged: 'false' });
    // }
});



/*
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
*/