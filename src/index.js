const database = require('./db.js');
const server = require('./server');

const port = process.env.PORT || 3000;

database.connect();

server.create()
    .then(app => {
        app.listen(port, () => {
            console.log(`Server has started on port ${port}!`);
        });
    }).catch(err => console.log(err));

const exit = () => {
    console.log("Exit");
    server.close(async () => {
        await db.close()
        process.exit(0)
    })
}
process.on('SIGINT', exit)
process.on('SIGTERM', exit)