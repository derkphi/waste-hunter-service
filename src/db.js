const MongoClient = require('mongodb').MongoClient;

const password = 'r3V4mcMWbiCxmh3'
const dbName = 'WasteHunter'
const dbURI = "mongodb+srv://WasteHunter:"+ password + "@cluster0.rtoax.mongodb.net/" + dbName + "?retryWrites=true&w=majority";

let dbClient = MongoClient(dbURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
})

let dbo = false

let getObjectId = (id) => {
    return dbDriver.ObjectID(id)
}

let connect = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await dbClient.connect();
            dbo = dbClient.db(dbName);
            if (!dbo) throw new Error('Unable to connect to database'); else resolve(dbo)
        } catch (e) {
            reject(e)
        }
    })
}

let get = () => dbo

let close = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await dbClient.close()
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    connect,
    close,
    get
};