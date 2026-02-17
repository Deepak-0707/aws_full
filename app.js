const http = require('http');

const server = http.createServer((req, res) => {
    res.write("CI/CD is working 🚀");
    res.end();
});

server.listen(3000);
