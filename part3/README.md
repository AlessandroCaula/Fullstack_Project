# Table of Contents

- [Part 3](#part-3)
  - [3a - Node.js and Express](#3a---node.js-and-express)

# Part 3

## 3a - Node.js and Express

In this part, our focus shifts towards the backend: that is, towards implementing functionality on the server side of the stack.

We will be building our backend on top of [NodeJS](https://nodejs.org/en/), which is a JavaScript runtime based on Google's Chrome V8 JavaScript engine.

This course material was written with version _v22.3.0_ of Node.js. Please make sure that your version of Node is at least as new as the version used in the material (you can check the version by running `node -v` in the command line).

As mentioned in part 1, browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be _transpiled_ with e.g. babel. The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code.

Our goal is to implement a backend that will work with the notes application from part 2. However, let's start with the basics by implementing a classic "hello world" application.

**Notice** that the applications and exercises in this part are not all React applications, and we will not use the create `vite@latest -- --template react` utility for initializing the project for this application.

We had already mentioned npm back in part 2, which is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem.

Let's navigate to an appropriate directory, and create a new template for our application with the `npm init` command. We will answer the questions presented by the utility, and the result will be an automatically generated _package.json_ file at the root of the project that contains information about the project.

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```

The file defines, for instance, that the entry point of the application is the _index.js_ file.

Let's make a small change to the _scripts_ object by adding a new script command.

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  // ...
}
```

Next, let's create the first version of our application by adding an _index.js_ file to the root of the project with the following code:

```js
console.log("hello world");
```

We can run the program directly with Node from the command line:

```bash
node index.js
```

Or we can run it as an <u>npm script</u>

```bash
npm start
```

The start npm script works because we defined it in the package.json file:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  // ...
}
```

Even though the execution of the project works when it is started by calling `node index.js` from the command line, it's customary for npm projects to execute such tasks as npm scripts.

By default, the _package.json_ file also defines another commonly used npm script called _npm test_. Since our project does not yet have a testing library, the `npm test` command simply executes the following command:

```json
echo "Error: no test specified" && exit 1
```

### Simple web server

Let's change the application into a web server by editing the `index.js` file as follows:

```js
const http = require("http");

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World");
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

Once the application is running, the following message is printed in the console:

```bash
Server running on port 3001
```

We can open our humble application in the browser by visiting the address http://localhost:3001:

![alt text](assets\image.png)

The server works the same way regardless of the latter part of the URL. Also the address http://localhost:3001/foo/bar will display the same content.

**NB** If port 3001 is already in use by some other application, then starting the server will result in the following error message:

```bash
➜  hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
```

You have two options. Either shut down the application using port 3001 (the JSON Server in the last part of the material was using port 3001), or use a different port for this application.

Let's take a closer look at the first line of the code:

```js
const http = require("http");
```

In the first row, the application imports Node's built-in web server module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:

```js
import http from "http";
```

These days, code that runs in the browser uses ES6 modules. Modules are defined with an export and included in the current file with an import.

Node.js uses [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules. The reason for this is that the Node ecosystem needed modules long before JavaScript supported them in the language specification. Currently, Node also supports the use of ES6 modules, but since the support is not quite perfect yet, we'll stick to CommonJS modules.

CommonJS modules function almost exactly like ES6 modules, at least as far as our needs in this course are concerned.

The next chunk in our code looks like this:

```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World");
});
```

The code uses the `createServer` method of the http module to create a new web server. An _event handler_ is registered to the server that is called _every time_ an HTTP request is made to the server's address http://localhost:3001/.

The request is responded to with the status code 200, with the _Content-Type_ header set to _text/plain_, and the content of the site to be returned set to _Hello World_.

The last rows bind the http server assigned to the `app` variable, to listen to HTTP requests sent to port 3001:

```js
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

The primary purpose of the backend server in this course is to offer raw data in JSON format to the frontend. For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format:

```js
const http = require("http");

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

Let's restart the server (you can shut the server down by pressing `Ctrl+C` in the console) and let's refresh the browser.

The _application/json_ value in the _Content-Type_ header informs the receiver that the data is in the JSON format. The `notes` array gets transformed into JSON formatted string with the `JSON.stringify(notes)` method. This is necessary because the response.end() method expects a string or a buffer to send as the response body.

When we open the browser, the displayed format is exactly the same as in part 2 where we used [json-server](https://github.com/typicode/json-server) to serve the list of notes:

![alt text](assets/image1.png)

### Express

Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.

Many libraries have been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is [Express](https://expressjs.com/).

Let's take Express into use by defining it as a project dependency with the command:

```bash
npm install express
```

The dependency is also added to our package.json file:

```js
{
  // ...
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

The source code for the dependency is installed in the _node_modules_ directory located at the root of the project. In addition to Express, you can find a great number of other dependencies in the directory:

![alt text](assets/image2.png)

These are the dependencies of the Express library and the dependencies of all of its dependencies, and so forth. These are called the transitive dependencies of our project.

Version 4.21.2 of Express was installed in our project. What does the caret in front of the version number in package.json mean?

```json
"express": "^4.21.2"
```

The versioning model used in npm is called [semantic versioning](https://docs.npmjs.com/about-semantic-versioning).

The caret in the front of _^4.21.2_ means that if and when the dependencies of a project are updated, the version of Express that is installed will be at least _4.21.2_. However, the installed version of Express can also have a larger _patch_ number (the last number), or a larger _minor_ number (the middle number). The major version of the library indicated by the first _major_ number must be the same.

We can update the dependencies of the project with the command:

```bash
npm update
```

Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in _package.json_ by running this next command in the project's root directory:

```bash
npm install
```

If the _major_ number of a dependency does not change, then the newer versions should be backwards compatible. This means that if our application happened to use version 4.99.175 of Express in the future, then all the code implemented in this part would still have to work without making changes to the code. In contrast, the future 5.0.0 version of Express may contain changes that would cause our application to no longer work.

### Web and Express

Let's gat back to our application and make the following changes:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

To get the new version of our application into use, first we have to restart it.

The application did not change a whole lot. Right at the beginning of our code, we're importing `express`, which this time is a _function_ that is used to create an Express application stored in the `app` variable:

```js
const express = require("express");
const app = express();
```

Next, we define two _routes_ to the application. The first one defines an event handler that is used to handle HTTP GET requests made to the application's/root:

```js
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
```

The event handler function accepts two parameters. The first [request](https://expressjs.com/en/4x/api.html#req) parameter contains all of the information of the HTTP request, and the second [response](https://expressjs.com/en/4x/api.html#res) parameter is used to define how the request is responded to.

In our code, the request is answered by using the send method of the `response` object. Calling the method makes the server respond to the HTTP request by sending a response containing the string `<h1>Hello World!</h1>` that was passed to the `send` method. Since the parameter is a string, Express automatically sets the value of the _Content-Type_ header to be _text/html_. The status code of the response defaults to 200.

We can verify this from the Network tab in developer tools.

The second route defines an event handler that handles HTTP GET requests made to the _notes_ path of the application:

```js
app.get("/api/notes", (request, response) => {
  response.json(notes);
});
```

The request is responded to with the json method of the `response` object. Calling the method will send the **notes** array that was passed to it as a JSON formatted string. Express automatically sets the _Content-Type_ header with the appropriate value of _application/json_.

![alt text](assets/image3.png)

Next, let's take a quick look at the data sent in JSON format.

In the earlier version where we were only using Node, we had to transform the data into the JSON formatted string with the `JSON.stringify` method:

```js
response.end(JSON.stringify(notes));
```

With Express, this is no longer required, because this transformation happens automatically.

It's worth noting that JSON is a string and not a JavaScript object like the value assigned to `notes`.

The experiment shown below illustrates this point:

![alt text](assets/image4.png)

The experiment above was done in the interactive node-repl. You can start the interactive node-repl by typing in `node` in the command line. The repl is particularly useful for testing how commands work while you're writing application code. I highly recommend this!

### Automatic Change Tracking

If we change the application's code, we first need to stop the application from the console (`ctrl + c`) and then restart it for the changes to take effect. Restarting feels cumbersome compared to React's smooth workflow, where the browser automatically updates when the code changes.

You can make the server track our changes by starting it with the `--watch` option:

```bash
node --watch index.js
```

Now, changes to the application's code will cause the server to restart automatically. Note that although the server restarts automatically, you still need to refresh the browser. Unlike with React, we do not have, nor could we have, a hot reload functionality that updates the browser in this scenario (where we return JSON data).

Let's define a custom npm script in the package.json file to start the development server:

```json
{
  // ..
  "scripts": {
    "start": "node index.js",

    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  // ..
}
```

We can now start the server in development mode with the command

```bash
npm run dev
```

Unlike when running the start or test scripts, the command must include _run_.

### REST

Let's expand our application so that it provides the same RESTful HTTP API as [json-server](https://github.com/typicode/json-server#routes).

Representational State Transfer, aka REST, was introduced in 2000 in Roy Fielding's [dissertation](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). REST is an architectural style meant for building scalable web applications.

We are not going to dig into Fielding's definition of REST or spend time pondering about what is and isn't RESTful. Instead, we take a more narrow view by only concerning ourselves with how RESTful APIs are typically understood in web applications. The original definition of REST is not even limited to web applications.

We mentioned in the previous part that singular things, like notes in the case of our application, are called resources in RESTful thinking. Every resource has an associated URL which is the resource's unique address.

One convention for creating unique addresses is to combine the name of the resource type with the resource's unique identifier.

Let's assume that the root URL of our service is _www.example.com/api._

If we define the resource type of note to be notes, then the address of a note resource with the identifier 10, has the unique address _www.example.com/api/notes/10_.

The URL for the entire collection of all note resources is _www.example.com/api/notes_.

We can execute different operations on resources. The operation to be executed is defined by the HTTP _verb_:

![alt text](assets/image5.png)

This is how we manage to roughly define what REST refers to as a uniform interface, which means a consistent way of defining interfaces that makes it possible for systems to cooperate.

This way of interpreting REST falls under the second level of RESTful maturity in the Richardson Maturity Model. According to the definition provided by Roy Fielding, we have not defined a REST API. In fact, a large majority of the world's purported "REST" APIs do not meet Fielding's original criteria outlined in his dissertation.

In some places (see e.g. Richardson, Ruby: RESTful Web Services) you will see our model for a straightforward CRUD API, being referred to as an example of resource-oriented architecture instead of REST. We will avoid getting stuck arguing semantics and instead return to working on our application.

### Fetching a single resource

Let's expand our application so that it offers a REST interface for operating on individual notes. First, let's create a [route](https://expressjs.com/en/guide/routing.html) for fetching a single resource.

The unique address we will use for an individual note is of the form _notes/10_, where the number at the end refers to the note's unique id number.

We can define [parameters](https://expressjs.com/en/guide/routing.html#route-parameters) for routes in Express by using the colon syntax:

```js
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);
  response.json(note);
});
```

New `app.get('/api/notes/:id', ...)` will handle will handle all HTTP GET requests that are of the form _/api/notes/SOMETHING_, where _SOMETHING_ is an arbitrary string.

The _id_ parameter in the route of a request can be accessed through the <u>request</u> object.

```js
const id = request.params.id;
```

The now familiar `find` method of array is used to find the note with an id that matches the parameter. The note is then returned to the sender of the request.

We can now test our application by going to http://localhost:3001/api/notes/1 in our browser:

![alt text](assets/image6.png)

However, there's another problem with our application.

If we search for a note with an id that does not exist, the server responds with:

![alt text](assets/image7.png)

The HTTP status code that is returned is 200, which means that the response succeeded. There is no data sent back with the response, since the value of the content-length header is 0, and the same can be verified from the browser.

The reason for this behavior is that the `note` variable is set to `undefined` if no matching note is found. The situation needs to be handled on the server in a better way. If no note is found, the server should respond with the status code <u>404 not found</u> instead of 200.

Let's make the following change to our code:

```js
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
```

Since no data is attached to the response, we use the status method for setting the status and the end method for responding to the request without sending any data.

The if-condition leverages the fact that all JavaScript objects are `truthy`, meaning that they evaluate to true in a comparison operation. However, `undefined` is `falsy` meaning that it will evaluate to false.

Our application works and sends the error status code if no note is found. However, the application doesn't return anything to show to the user, like web applications normally do when we visit a page that does not exist. We do not need to display anything in the browser because REST APIs are interfaces that are intended for programmatic use, and the error status code is all that is needed.

Anyway, it's possible to give a clue about the reason for sending a 404 error by [overriding the default NOT FOUND message](https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express/36507614#36507614).

### Deleting resources

Next, let's implement a route for deleting resources. Deletion happens by making an HTTP DELETE request to the URL of the resource:

```js
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});
```

If deleting the resource is successful, meaning that the note exists and is removed, we respond to the request with the status code <u>204 no content</u> and return no data with the response.

There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. The only two options are 204 and 404. For the sake of simplicity, our application will respond with 204 in both cases.

### Postman

So how do we test the delete operation? HTTP GET requests are easy to make from the browser. We could write some JavaScript for testing deletion, but writing test code is not always the best solution in every situation.

Many tools exist for making the testing of backends easier. One of these is a command line program [curl](https://curl.se/). However, instead of curl, we will take a look at using [Postman](https://www.postman.com/) for testing the application.

Let's install the Postman desktop client [from here](https://www.postman.com/downloads/) and try it out:

![alt text](assets/image8.png)

NB: Postman is also available on VS Code which can be downloaded from the Extension tab on the left -> search for Postman -> First result (Verified Publisher) -> Install You will then see an extra icon added on the activity bar below the extensions tab. Once you log in, you can follow the steps below.

Using Postman is quite easy in this situation. It's enough to define the URL and then select the correct request type (DELETE).

The backend server appears to respond correctly. By making an HTTP GET request to http://localhost:3001/api/notes we see that the note with the id 2 is no longer in the list, which indicates that the deletion was successful.

Because the notes in the application are only saved to memory, the list of notes will return to its original state when we restart the application.

### The Visual Studio Code REST client

If you use Visual Studio Code, you can use VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin instead of Postman.

Once the plugin is installed, using it is very simple. We make a directory at the root of the application named _requests_. We save all the REST client requests in the directory as files that end with the _.rest_ extension.

Let's create a new _get_all_notes.rest_ file and define the request that fetches all notes.

![alt text](assets/image14.png)

By clicking the Send Request text, the REST client will execute the HTTP request and the response from the server is opened in the editor.

### Receiving data

Next, let's make it possible to add new notes to the server. Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request body in JSON format.

To access the data easily, we need the help of the Express [json-parser](https://expressjs.com/en/api.html) that we can use with the command `app.use(express.json())`.

Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:

```js
const express = require("express");
const app = express();

app.use(express.json());

//...

app.post("/api/notes", (request, response) => {
  const note = request.body;
  console.log(note);
  response.json(note);
});
```

The event handler function can access the data from the body property of the `request` object.

Without the json-parser, the _body_ property would be undefined. The json-parser takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the _body_ property of the `request` object before the route handler is called.

For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response.

Before we implement the rest of the application logic, let's verify with Postman that the data is in fact received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the body:

![alt text](assets/image9.png)

**NOTE**: When programming the backend, _keep the console running the application visible at all times_. The development server will restart if changes are made to the code, so by monitoring the console, you will immediately notice if there is an error in the application's code:

![alt text](assets/image10.png)

Similarly, it is useful to check the console to make sure that the backend behaves as we expect it to in different situations, like when we send data with an HTTP POST request. Naturally, it's a good idea to add lots of `console.log` commands to the code while the application is still being developed.

A potential cause for issues is an incorrectly set _Content-Type_ header in requests. This can happen with Postman if the type of body is not defined correctly:

![alt text](assets/image11.png)

**The Content-Type header is set to text/plain:**

![alt text](assets/image12.png)

The server appears to only receive an empty object:

![alt text](assets/image13.png)

The server will not be able to parse the data correctly without the correct value in the header. It won't even try to guess the format of the data since there's a massive amount of potential Content-Types.

If you are using VS Code, then you should install the REST client from the previous chapter now, if you haven't already. The POST request can be sent with the REST client like this:

![alt text](assets/image15.png)

We created a new _create_note.rest_ file for the request. The request is formatted according to the [instructions in the documentation](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage).

One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. You can also add multiple requests in the same file using `###` separators:

```rest
GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
```

Postman also allows users to save requests, but the situation can get quite chaotic especially when you're working on multiple unrelated projects.

> **Important sidenote**  
> Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the get method of the `request` object, that can be used for getting the value of a single header. The `request` object also has the _headers_ property, that contains all of the headers of a specific request.
>
> Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.
>
> You will be able to spot this missing Content-Type header if at some point in your code you print all of the request headers with the console.log(request.headers) command.

Let's return to the application. Once we know that the application receives data correctly, it's time to finalize the handling of the request:

```js
app.post("/api/notes", (request, response) => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;

  const note = request.body;
  note.id = String(maxId + 1);

  notes = notes.concat(note);

  response.json(note);
});
```

We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the `maxId` variable. The id of the new note is then defined as `maxId + 1` as a string. This method is not recommended, but we will live with it for now as we will replace it soon enough.

The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. Let's improve the application by defining that the content property may not be empty. The important property will be given a default value of false. All other properties are discarded:

```js
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});
```

The reason you need to use the spread operator `(...)` in `Math.max(...notes.map(n => Number(n.id)))` is that the `Math.max()` function expects individual arguments, not an array.

- `notes.map(n => Number(n.id))` creates an array of numbers (e.g., `[1, 2, 3]`).
- `Math.max()` does not accept an array as input. Instead, it expects individual numbers as arguments (e.g., `Math.max(1, 2, 3)`).
- The spread operator `(...)` is used to "spread" the elements of the array into individual arguments for `Math.max()`.

The logic for generating the new id number for notes has been extracted into a separate `generateId` function.

If the received data is missing a value for the _content_ property, the server will respond to the request with the status code <u>400 bad request</u>:

```js
if (!body.content) {
  return response.status(400).json({
    error: "content missing",
  });
}
```

Notice that calling return is crucial because otherwise the code will execute to the very end and the malformed note gets saved to the application.

If the content property has a value, the note will be based on the received data. If the _important_ property is missing, we will default the value to _false_. The default value is currently generated in a rather odd-looking way:

```js
important: body.important || false,
```

If the data saved in the `body` variable has the _important_ property, the expression will evaluate its value and convert it to a boolean value. If the property does not exist, then the expression will evaluate to false which is defined on the right-hand side of the vertical lines.

> To be exact, when the important property is false, then the `body.important || false` expression will in fact return the _false_ from the right-hand side...

You can find the code for our current application in its entirety in the part3-1 branch of this [GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).

If you clone the project, run the `npm install` command before starting the application with `npm start` or `npm run dev`.

One more thing before we move on to the exercises. The function for generating IDs looks currently like this:

```js
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};
```

The function body contains a row that looks a bit intriguing:

```js
Math.max(...notes.map((n) => Number(n.id)));
```

What exactly is happening in that line of code? `notes.map(n => n.id)` creates a new array that contains all the ids of the notes in number form. Math.max returns the maximum value of the numbers that are passed to it. However, `notes.map(n => Number(n.id))` is an _array_ so it can't directly be given as a parameter to `Math.max`. The array can be transformed into individual numbers by using the "three dot" spread syntax `...`.

### About HTTP request types

[The HTTP standard](https://www.rfc-editor.org/rfc/rfc9110.html#name-common-method-properties) talks about two properties related to request types, **safety** and **idempotency**.

The HTTP GET request should be _safe_:

> In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".

Safety means that the executing request must not cause any _side effects_ on the server. By side effects, we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.

Nothing can ever guarantee that a GET request is _safe_, this is just a recommendation that is defined in the HTTP standard. By adhering to RESTful principles in our API, GET requests are always used in a way that they are _safe_.

The HTTP standard also defines the request type HEAD, which ought to be safe. In practice, HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request.

All HTTP requests except POST should be _idempotent_:

> Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property

This means that if a request does not generate side effects, then the result should be the same regardless of how many times the request is sent.

If we make an HTTP PUT request to the URL _/api/notes/10_ and with the request we send the data `{ content: "no side effects!", important: true }`, the result is the same regardless of how many times the request is sent.

Like safety for the GET request, _idempotence_ is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent.

POST is the only HTTP request type that is neither _safe_ nor _idempotent_. If we send 5 different HTTP POST requests to _/api/notes_ with a body of `{content: "many same", important: true}`, the resulting 5 notes on the server will all have the same content.

### Middleware

The Express json-parser used earlier is a [middleware](https://expressjs.com/en/guide/using-middleware.html).

Middleware are functions that can be used for handling `request` and `response` objects.

The json-parser we used earlier takes the raw data from the requests that are stored in the `request` object, parses it into a JavaScript object and assigns it to the `request` object as a new property _body_.

In practice, you can use several middlewares at the same time. When you have more than one, they're executed one by one in the order that they were listed in the application code.

Let's implement our own middleware that prints information about every request that is sent to the server.

Middleware is a function that receives three parameters:

```js
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
```

At the end of the function body, the `next` function that was passed as a parameter is called. The `next` function yields control to the next middleware.

Middleware is used like this:

```js
app.use(requestLogger);
```

Remember, middleware functions are called in the order that they're encountered by the JavaScript engine. Notice that `json-parser` is listed before `requestLogger`, because otherwise _request.body_ will not be initialized when the logger is executed!

Middleware functions have to be used before routes when we want them to be executed by the route event handlers. Sometimes, we want to use middleware functions after routes. We do this when the middleware functions are only called if no route handler processes the HTTP request.

Let's add the following middleware after our routes. This middleware will be used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```