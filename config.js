/*
module.exports = { 

    DATABASE_URL : "mongodb://localhost/eventsdb",
    PORT : 8080
};
*/
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://admin:fullpower@cluster0-xqgng.mongodb.net/eventsdb?retryWrites=true&w=majority";
//exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/eventsdb';
exports.TOKEN = process.env.API_TOKEN || '2abbf7c3-245b-404f-9473-ade729ed4653';
exports.PORT = process.env.PORT || '8080'; 