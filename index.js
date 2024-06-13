
/* === Imports === */
require('dotenv').config({ path: './env' });
// require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
var finalhandler = require('finalhandler')
const cors = require('cors')
const Person = require('./models/person.js')

/* === Database === */

let persons = [
	{ "id": 1, "name": "Arto Hellas", "number": "040-123456" },
	{ "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
	{ "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
	{ "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122" },
]

/* === Assign app usages === */

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

/* === Fetchers Get === */

app.get('/api/info', (request, response) => {
	response.setHeader('date', new Date().toISOString())
	response.send(`<p>The phonebook has ${persons.length} people.<br>${response.getHeaders().date}</p>`)
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(person => {
		response.json(person)
	})
	// const id = Number(request.params.id)
	// const person = persons.find(person => person.id === id)
	// if (person) {
	// 	response.json(person)
	// } else {
	// 	response.status(404).end()
	// }
})

/* === Fetchers Post === */

app.post('/api/persons', (request, response) => {
	const person = new Person({
		id: Math.round(Math.random() * 10000000),
		name: "John Doe",
		number: Math.round(Math.random() * 10000000000000).toString()
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})

	// var done = finalhandler(request, response)
	// var logger = morgan(':method :url :status :res[content-length] - :response-time ms :personAdded')
	// morgan.token('personAdded', function getPersonAdded(request) {
	// 	const personAdded = persons.find(entry => entry.name === person.name)
	// 	const { id, ...personDetails } = personAdded // get person without  id prop for person details
	// 	return JSON.stringify(personDetails)
	// })
	// logger(request, response, function (err) { // morgan

	// 	if (!person.name) {
	// 		response.status(400).send({ error: "no name given" })
	// 		return
	// 	}

	// 	if (!person.number) {
	// 		response.status(400).send({ error: "no number given" })
	// 		return
	// 	}

	// 	if (persons.find(entry => entry.name === person.name)) {
	// 		response.status(400).send({ error: `name must be unique` })
	// 		return
	// 	}

	// 	persons = persons.concat(person)
	// 	response.json(person)
	// })
})

/* === Fetchers Delete === */

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

/* === Fallthroughs === */

app.get('/', (request, response) => {
	response.send('<h1>Nothing to display for this endpoint</h1>')
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

/* === Initializers === */
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

/* === bin === */

// const requestLogger = (request, response, next) => {
// 	console.log('Method:', request.method);
// 	console.log('Path:  ', request.path);
// 	console.log('Body:  ', request.body);
// 	console.log('---');
// 	next();
// };
// app.use(requestLogger);



// app.get('/api/persons/:id', (request, response) => {
// 	const id = Number(request.params.id)
// 	const person = persons.find(person => person.id === id)
// 	if (person) {
// 		response.json(person)
// 	} else {
// 		response.status(404).end()
// 	}
// })



// app.get('/api/info', (request, response) => {
// 	response.setHeader('date', new Date().toISOString())
// 	response.send(`<p>The phonebook has ${persons.length} people.<br>${response.getHeaders().date}</p>`)
// })

// app.get('/api/persons', (request, response) => {
// 	response.json(persons)
// })

// app.get('/api/persons/:id', (request, response) => {
// 	const id = Number(request.params.id)
// 	const person = persons.find(person => person.id === id)
// 	if (person) {
// 		response.json(person)
// 	} else {
// 		response.status(404).end()
// 	}
// })


// app.post('/api/persons', (request, response) => {
// 	const newPerson = {
// 		id: Math.round(Math.random() * 10000000),
// 		name: "John Doe",
// 		number: Math.round(Math.random() * 10000000000000).toString()
// 	};
// 	var done = finalhandler(request, response);
// 	var logger = morgan(':method :url :status :res[content-length] - :response-time ms :personAdded');
// 	morgan.token('personAdded', function getPersonAdded(request) {
// 		const personAdded = persons.find(person => person.name === newPerson.name);
// 		const { id, ...personDetails } = personAdded; // get person without  id prop for person details
// 		return JSON.stringify(personDetails);
// 	});

// 	logger(request, response, function (err) { // morgan

// 		if (!newPerson.name) {
// 			response.status(400).send({ error: "no name given" });
// 			return;
// 		}

// 		if (!newPerson.number) {
// 			response.status(400).send({ error: "no number given" });
// 			return;
// 		}

// 		if (persons.find(entry => entry.name === newPerson.name)) {
// 			response.status(400).send({ error: `name must be unique` });
// 			return;
// 		}

// 		persons = persons.concat(newPerson);
// 		response.json(newPerson);
// 	});
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });