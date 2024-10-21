// Required modules
const http = require("http");
const fs = require("fs");
const path = require("path");
const socketIO = require("socket.io");

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Serve the main HTML file
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
  // Serve the socket.io client library
  else if (req.url === "/socket.io/socket.io.js") {
    fs.readFile(
      path.join(
        __dirname,
        "node_modules",
        "socket.io",
        "client-dist",
        "socket.io.js"
      ),
      (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error loading socket.io.js");
        } else {
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.end(data);
        }
      }
    );
  }
  // Serve the CSS file (if it exists)
  else if (req.url === "/style.css") {
    fs.readFile(path.join(__dirname, "style.css"), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Error loading style.css");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
  }
  // Handle 404 for other files
  else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

// Attach socket.io to the server
const io = socketIO(server);

// Listen for socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for the "send name" event
  socket.on("send name", (user) => {
    io.emit("send name", user);
  });

  // Listen for the "send message" event
  socket.on("send message", (chat) => {
    io.emit("send message", chat);
  });

  // Handle user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server on port 5000
const port = 5000;
server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
