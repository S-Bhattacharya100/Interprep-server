const app = require("./app");

// Initialization of server
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running in ${port} port`);
});