require("dotenv").config();
const express = require("express");
const Note = require("./models/note");

const app = express();

// Notes collection.
let notes = [];

// Middleware that prints information about every request that is sent to the server
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);
app.use(express.static("dist"));
app.use(express.json());

// Route to handle the GET request for the main "Hello World"
app.get("/", (request, response) => {
  response.send("<h1>Hello World!!!!!!</h1>");
});

// Route to handle the GET request for all the notes from mongoDB.
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Route to handle the GET request and retrieve a specific note by ID
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

// Route to DELETE a note by ID
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// Function used to generate the note Id
const generateId = () => {
  const maxId =
    notes.length > 0
      ? Math.max(...notes.map((n) => Number(n.id))) //The spread operator `(...)` is used to "spread" the elements of the array into individual arguments for `Math.max()`
      : 0;
  return String(maxId + 1);
};

// Handling the POST request and creation of a new note to the server
app.post("/api/notes", (request, response) => {
  const body = request.body; // Accessing the data from the body property of the request object

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  console.log(note); // { content: 'Postman is good in testing backend', important: true }

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// Middleware used for catching requests made to non-existent routes.
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "unknown endpoint",
  });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
});
