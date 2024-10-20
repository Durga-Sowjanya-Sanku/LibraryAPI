const http = require('http');
const url = require('url');

let books = [
    {id: '1', title: "The Silent Patient", genre: "Crime/Suspense"},
    {id: '2', title: "Verity", genre: "Crime/Thriller"}
];

const requesthandler = (request, response) => {
    const { method , url} = request;
    const parts = url.split('/');

    console.log(parts); 

    if (method === "GET" && parts[1] === "") {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Hey, welcome");
    } 
    else if (method === "GET" && url === "/books") {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(books));
    } 
    else if (method === "GET" && parts[1] === "books" && parts[2]) {
        const id = parts[2]; 
        const book = books.find((book) => book.id === id); 
        console.log(book);
        if (book) {
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify(book));
        } else {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.end("Book not found");
        }
    } 
    else if (method === "POST" && parts[1] === "books") {
        let data = ""; 

        request.on('data', (chunk) => {
            data += chunk;
        });

        request.on('end', () => {
            try {
                const book = JSON.parse(data);
                books.push(book);
                response.writeHead(201, {"Content-Type": "text/plain"});
                response.end("Book added successfully");
            } catch (error) {
                response.writeHead(400, { "Content-Type": "text/plain" });
                response.end("Invalid JSON");
            }
        });
    } 
    else if (method === "DELETE" && parts[1] === "books") {
        let data = "";

        request.on('data', (chunk) => {
            data += chunk;  
        });

        request.on('end', () => {
            try {
                const bookId = JSON.parse(data); 
                books = books.filter((book) => bookId.id !== book.id);
                response.writeHead(200, { "Content-Type": "text/plain" });
                response.end("Book deleted successfully");
            } catch (error) {
                response.writeHead(400, { "Content-Type": "text/plain" });
                response.end("Invalid JSON");
            }
        });
    }
    else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not Found");
    }
};

const PORT = 4000;

const server = http.createServer(requesthandler);

server.listen(PORT, () => {
    console.log(`The server is listening at http://localhost:${PORT}`);
});
