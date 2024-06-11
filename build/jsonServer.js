const http = require('http');

let persons = [
	{ "id": 1, "name": "Arto Hellas", "number": "040-123456" },
	{ "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
	{ "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
	{ "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122" }
];

const server = http.createServer((req, res) => {
	const lastSegment = req.url.toString().split('/').at(-1); // get last url path segment

	if (lastSegment === 'persons') {
		if (req.method === "GET") getAllPersons();
		else if (req.method === "POST") addEntry();
		return;
	}

	if (Number(lastSegment)) {
		if (req.method === "GET") getEntry();
		else if (req.method === "DELETE") deleteEntry();
		return;
	}

	if (lastSegment === 'info') {
		getInfo();
		return;
	}

	function getAllPersons() {
		const responseData = JSON.stringify(persons);
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(responseData); // don't stringify (don't know why).
		res.end();
	}

	function getEntry() {
		const responseData = persons.find(person => person.id === Number(lastSegment));
		if (!responseData) {
			res.writeHead(404);
			res.end();
		} else {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(responseData));
			res.end();
		}
	}

	function deleteEntry() {
		const responseData = persons.filter(person => person.id !== Number(lastSegment));
		if (responseData.length === persons.length) { // no match found
			res.writeHead(404);
			res.end();
		} else {
			persons = [...responseData];
			res.writeHead(204);
			res.end();
		}
	}

	function addEntry() {
		// get request body:
		// For some reason, `req.body` always returns an empty object,
		// even when using the `express` library with proper imports.
		let body = "";
		req.on('data', chunk => {
			body += chunk;
		});
		req.on('end', () => {
			const bodyJson = JSON.parse(body);
			if (!bodyJson.name) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ message: 'No name provided' }));
			} else if (!bodyJson.number) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ message: 'No number provided' }));
			} else if (persons.find(person => person.name === bodyJson.name)) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ message: 'Name must be unique' }));
			} else {
				persons = persons.concat(JSON.parse(body));
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(persons)); // unlike before, `persons` must be stringified here (don't know why).
			}
		});
	}

	function getInfo() {
		const responseData = persons.length;
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.write(JSON.stringify(responseData));
		res.end();
	}
});

server.listen(3002);
console.log(`Json Server running on port ${3002}`);