const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const PORT = 3001;
const BASE_URL = '/api/persons';

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
  {
    name: 'Nestor Arguello',
    number: '22-3333-2222',
    id: 5,
  },
];

app.get('/info', (request, response) => {
  const actualDate = new Date();
  const infoMessage = `<p>Phonebook has info for ${persons.length} people</p><p>${actualDate}</p>`;

  response.send(infoMessage);
});

app.get(BASE_URL, (request, response) => {
  response.json(persons);
});

app.get(`${BASE_URL}/:id`, (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete(`${BASE_URL}/:id`, (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const generateId = persons => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const repeatedPerson = persons.find(person => person.id === randomNumber);

  if (!repeatedPerson) {
    return randomNumber;
  } else {
    return generateId(persons);
  }
};

app.post(`${BASE_URL}`, (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'Name is missing',
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number is missing',
    });
  }

  const repeatedName = persons.find(
    person => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (repeatedName) {
    return response.status(400).json({
      error: 'Name must be unique',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(persons),
  };

  persons = persons.concat(person);

  response.status(201).json(person);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
