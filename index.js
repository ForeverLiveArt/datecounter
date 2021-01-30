const express = require('express');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
var { DateTime } = require('luxon');
DateTime.local();

app.post('/api', (request, response) => {
	console.log(request.body);
});