const mongoose = require('mongoose')

// --------------------------------------------------
// #region Command Arguments

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

if (process.argv.length === 4) {
	console.log(`give both a name and a number as arguments`)
	process.exit()
}

if (process.argv.length > 5) {
	console.log(`too many arguments. Make sure to put quotations around the name if it has whitespace`)
	process.exit()
}

//  now the amount of arguments is now 3 or 5

const password = process.argv[2]
const newPersonName = process.argv[3]
const newPersonNumber = process.argv[4]

// #endregion Command Arguments
// --------------------------------------------------



// --------------------------------------------------
// #region Connections

const url = process.env.MONGODB_URI

console.log("- connected to :>> ", url)

mongoose.set('strictQuery', false)

mongoose.connect(url)
	.then(result => {
		console.log(`connected to MongoDB`)
	})
	.catch(error => {
		console.log("- error connecting to MongoDB :>> ", error.message)
	})

// #endregion Connections
// --------------------------------------------------



// --------------------------------------------------
// #region Schemas

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
	name: `${newPersonName}`,
	number: `${newPersonNumber}`
})

// #endregion Schemas
// --------------------------------------------------



// --------------------------------------------------
// #region Command Line Operations

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person)
		})
		mongoose.connection.close()
	})
}

if (process.argv.length === 5) {
	person.save().then(result => {
		console.log(`added ${newPersonName} number ${newPersonNumber} to phonebook`)
		mongoose.connection.close()
	})
}

// #endregion Command Line Operations
// --------------------------------------------------

module.exports = mongoose.model('Person', personSchema)