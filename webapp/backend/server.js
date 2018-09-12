const express = require('express');
const app = express();
const db_config = require('./configuration/dev.js');
const EntityService = require('./services/EntityService.js');
const PhraseService = require('./services/PhraseService.js');
const ClientService = require('./services/ClientService.js');
const TweetService = require('./services/TweetService.js');
const CORSService = require('./services/CORSService.js');
const bodyParser  = require('body-parser');


app.use(CORSService.handler);
app.use(bodyParser.json());

app.get('/api/entityTypes', (req, res) => {
	let clientService = new ClientService(db_config.db);
	EntityService.entityTypes(clientService.client, res.json.bind(res));
});

app.get('/api/entities', (req, res) => {
	let clientService = new ClientService(db_config.db);
	let options ={
		term : req.query.term || '*',
		types : req.query.eTypes || [],
		lang : req.query.lang || [],
		mincount : req.query.mincount ? parseInt(req.query.mincount) : 2
	}

	EntityService.entities(clientService.client, options, res.json.bind(res));
});

app.get('/api/phrases', (req, res) => {
	let clientService = new ClientService(db_config.db);
	let options ={
		term : req.query.term || '*',
		lang : req.query.lang || [],
		mincount : req.query.mincount ? parseInt(req.query.mincount) : 2
	}
	PhraseService.phrases(clientService.client, options, res.json.bind(res));
});

// app.get('/api/text', (req, res) => {
// 	let clientService = new ClientService(db_config.db);
// 	let options ={
// 		text : req.query.term || '*',
// 		lang : req.query.lang || []
// 	}
// 	PhraseService.phrases(clientService.client, options, res.json.bind(res));
// });

app.post('/api/tweets', (req, res) => {
	let clientService = new ClientService(db_config.db);
	TweetService.tweets(clientService.client, req.body, res.send.bind(res))
});

app.listen(3000, () => console.log('Orion rest server listening on port 3000!'))
