const express = require('express');
const app = express();
const cors = require('cors');
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();
app.listen(process.env.PORT, () => console.log('App_started'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const { main_counter, kids_counter, auth_conf } = require('./app_api.js');

app.use(auth(auth_conf));
app.use(cors());

app.post('/logged', (request, response) => {  
    if ( request.oidc.isAuthenticated() ) { 
        const userInfo = JSON.stringify(req.oidc.fetchUserInfo());
        console.log(userInfo);
        response.json({ isLogged: 'true', user: userInfo });
     } else {
        response.json({ isLogged: 'false' });
        console.log('ok');
     }
});

app.post('/api', (request, response) => {
    if ( request.oidc.isAuthenticated() ) { 
        response.json(main_counter(request));
     } else {
        response.json({ isLogged: 'false' });
     }
});

app.post('/kids_api', (request, response) => {

    let answer = kids_counter(request);
    response.json(answer);
}); 