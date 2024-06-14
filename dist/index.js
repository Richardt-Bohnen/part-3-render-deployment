// --------------------------------------------------
// #region Imports

require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
var finalhandler = require('finalhandler')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/people.js')

// #endregion Imports
// --------------------------------------------------



// --------------------------------------------------
// #region Error Handling

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// #endregion Error Handling
// --------------------------------------------------



// --------------------------------------------------
// #region App Assigning

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

// #endregion App Assigning
// --------------------------------------------------



// --------------------------------------------------
// #region Fetches

app.get('/', (request, response) => {
	response.send('<h1>Nothing to display for this endpoint</h1>')
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

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

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

// #endregion Fetches
// --------------------------------------------------



// --------------------------------------------------
// #region APP Assign Errors

app.use(unknownEndpoint)
app.use(errorHandler)

// #endregion Assign Errors
// --------------------------------------------------



// --------------------------------------------------
// #region Port Listeners

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

// #endregion Port Listeners
// --------------------------------------------------