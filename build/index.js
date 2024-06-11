const express = require('express');
const app = express();
var morgan = require('morgan');
var finalhandler = require('finalhandler');


let persons = [
	{ "id": 1, "name": "Arto Hellas", "number": "040-123456" },
	{ "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
	{ "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
	{ "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122" },
];

app.use(express.static('dist'));

// const requestLogger = (request, response, next) => {
// 	console.log('Method:', request.method);
// 	console.log('Path:  ', request.path);
// 	console.log('Body:  ', request.body);
// 	console.log('---');
// 	next();
// };

const cors = require('cors');

app.use(cors());

app.use(express.json());
// app.use(requestLogger);

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/', (request, response) => {
	response.send('<h1>Nothing to display for this endpoint</h1>');
});

app.get('/api/info', (request, response) => {
	response.setHeader('date', new Date());
	response.send(`<p>The phonebook has ${persons.length} people.<br>${response.getHeaders().date}</p>`);
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.post('/api/persons', (request, response) => {
	const newPerson = {
		id: Math.round(Math.random() * 10000000),
		name: "John Doe",
		number: Math.round(Math.random() * 10000000000000).toString()
	};
	var done = finalhandler(request, response);
	var logger = morgan(':method :url :status :res[content-length] - :response-time ms :personAdded');
	morgan.token('personAdded', function getPersonAdded(request) {
		const personAdded = persons.find(person => person.name === newPerson.name);
		const { id, ...personDetails } = personAdded; // get person without  id prop for person details
		return JSON.stringify(personDetails);
	});

	logger(request, response, function (err) { // morgan


		if (!newPerson.name) {
			response.status(400).send({ error: "no name given" });
			return;
		}

		if (!newPerson.number) {
			response.status(400).send({ error: "no number given" });
			return;
		}

		if (persons.find(entry => entry.name === newPerson.name)) {
			response.status(400).send({ error: `name must be unique` });
			return;
		}

		persons = persons.concat(newPerson);
		response.json(newPerson);
	});
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(person => person.id !== id);

	response.status(204).end();
});

app.use(unknownEndpoint);

app.listen(3001);

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });