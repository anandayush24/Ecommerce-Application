//importing required files
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//handling uncaught exception
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught exception`);

    process.exit(1);
});

//config
dotenv.config({
    path: "backend/config/config.env"
});

//connecting to database
connectDatabase();

//listening on the provided port
const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost: ${process.env.PORT}`)
});


//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`"shutting down the serverdue to unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    });
});