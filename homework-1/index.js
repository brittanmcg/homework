const http = require("http");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
  // Get the parsed url
  const parsedUrl = url.parse(req.url, true);

  // Get the pathname from the parsed url
  const path = parsedUrl.pathname;

  // Trim the path but keep trailing backslashes
  const trimmedPath = path.replace(/^\/+|\+$/g, "");

  // Get the query string as an object
  const queryString = parsedUrl.query;

  // Get the http METHOD
  const method = req.method.toLowerCase();

  const headers = req.headers;

  const decoder = new StringDecoder("utf-8");

  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryString,
      method,
      headers,
      payload: buffer
    };

    // Use the status code defined by the handler or default to 200
    // Use the payload defined by the handler or default to empty object
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};

      res.writeHead(statusCode);

      res.end(JSON.stringify(payload));
      console.log(
        "Returning this response:  ",
        statusCode,
        JSON.stringify(payload)
      );
    });
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});

const handlers = {};

handlers.hello = (data, cb) => {
  cb(200, { name: "Hello You!" });
};

handlers.notFound = (data, cb) => {
  cb(404);
};
const router = {
  hello: handlers.hello
};
