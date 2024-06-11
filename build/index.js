var finalhandler = require('finalhandler');
const http = require('http');
const url = require('url');
const jsonServer = require('./jsonServer.js'); // mock database server (must `require`. Doesn't work in package.json).
var morgan = require('morgan'); // handled inside the `addEntry` function

const app = http.createServer(async (req, res) => {
	const uri = url.parse(req.url).pathname;
	const lastSegment = Number(uri.split('/').at(-1)); // get last url path segment and check if type Number

	switch (uri) {
		case "/api/persons":
			if (req.method === "GET") getAll();
			else if (req.method === "POST") addEntry();
			return;
		case `/api/persons/${lastSegment}`:
			if (req.method === "GET") getEntry();
			else if (req.method === "DELETE") deleteEntry();
			return;
		case `/api/info`:
			getInfo();
			return;
		case "/favicon.ico": // remove annoying favicon console 404
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end();
			return;
		default:
			pathNotFound();
	}

	async function getAll() {
		try {
			const response = await fetch('http://localhost:3002/api/persons', {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
			if (response.status !== 200) {
				throw new Error();
			}
			const data = await response.json();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(data));
			res.end();
		} catch (error) { pathNotFound(); }
	}

	async function getEntry() {
		try {
			const response = await fetch('http://localhost:3002/api/persons/' + lastSegment, {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
			if (response.status !== 200) {
				throw new Error();
			}
			const data = await response.json();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(data));
			res.end();
		} catch (error) { pathNotFound(); }
	}

	async function deleteEntry() {
		try {
			const response = await fetch('http://localhost:3002/api/persons/' + lastSegment, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			});
			if (response.status !== 204) {
				throw new Error();
			}
			res.writeHead(204);
			res.end();
		} catch (error) { pathNotFound(); }
	}

	async function addEntry() {
		const newPerson = {
			id: Math.round(Math.random() * 1000000),
			name: "John Doe",
			number: Math.round(Math.random() * 10000000000000).toString()
		};
		try {
			const response = await fetch('http://localhost:3002/api/persons', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newPerson)
			});
			const data = await response.json();
			if (response.status === 400) {
				throw new Error(data.message); // name already exists or no name of number provided. Handled on line 61 in jsonServer.js
			}

			var done = finalhandler(req, res);
			var logger = morgan(':method :url :status :res[content-length] - :response-time ms :personAdded');
			morgan.token('personAdded', function getPersonAdded(req) {
				const personAdded = data.find(person => person.name === newPerson.name);
				const { id, ...personDetails } = personAdded; // get person without  id prop for person details
				return JSON.stringify(personDetails);
			});
			logger(req, res, function (err) { // morgan
				if (err) return done(err);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();
			});
		} catch (error) {
			console.log("- error :>> ", error);
			res.writeHead(400, { "Content-Type": "text/html" });
			res.end(`<h1>${res.statusCode} - ${error}</h1>`);
			return;
		}
	}

	async function getInfo() {
		try {
			const response = await fetch('http://localhost:3002/api/info', {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
			if (response.status !== 200) {
				throw new Error();
			}
			const data = await response.json();
			const dateRequested = response.headers.get('date');
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write(`<p>Phonebook has info for ${data} people.<br><br>${dateRequested}</p>`);
			res.end();
		} catch (error) { pathNotFound(); }
	}

	async function pathNotFound() {
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end(`<h1>404 -Not Found</h1>`);
		return;
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});