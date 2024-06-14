/* === Imports === */
require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
var finalhandler = require('finalhandler')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/people.js')

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}


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

app.get('/', (request, response) => {
	response.send('<h1>Nothing to display for this endpoint</h1>')
})

app.get('/api/info', (request, response) => {
	response.setHeader('date', new Date().toISOString())
	response.send(`<p>The phonebook has ${persons.length} people.<br>${response.getHeaders().date}</p>`)
})

// app.get('/api/persons', (request, response) => {
// 	response.json(persons)
// })

// app.get('/api/persons', (request, response) => {
// 	Person.find({})
// 		.then(persons => {
// 			response.json(persons)
// 		})
// })

// app.get('/api/persons', (request, response) => {
//     Person.find({}).then(persons => {
//         response.json(persons.map(person => ({
//             ...person,
//             _id: person._id.toString() // Convert _id to string for the response
//         })))
//     })
// })

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

// app.get('/api/persons', (request, response) => {
// 	Person.find({}).then(person => {
// 		response.json(person)
// 	})
// })

/* === Fetchers Post === */
// Obselete. Don't use until updated
app.post('/api/persons', (request, response) => {
	const person = new Person({
		id: Math.round(Math.random() * 10000000),
		name: "John Doe",
		number: Math.round(Math.random() * 10000000000000).toString()
	})
	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})


/* ---
This is exercise 3.15.
Main issue is getting :id. 
Confusion getting _id vs id.
---
1) node index.js COOLgun101 anameofperson 555446
2) npm run dev COOLgun101 
3) get_person.rest Ctrl+Alt+R
4) "Cast to ObjectId failed for value "3200621" (type string) at path "_id" for model "Person""
OR
if using the _id value "666ae3ad53ce31c00d043754" it crashes the program.
---
Stuck at this point. Tried:
Person.findOne({id: request.params.id}) 
and 
Person.findById({id:request.params.id})
and variations there of (_id) etc
tried exactly the same as this too:
https://github.com/fullstack-hy2020/part3-notes-backend/blob/part3-5/index.js
---*/
app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})


/* === Fetchers Delete === */

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})


/* === Fallthroughs and Errors === */

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)


/* === Initializers === */
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})