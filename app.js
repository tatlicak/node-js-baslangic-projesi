const express = require("express");
const app = express();
require("dotenv").config();
require("./src/db/dbConnection");
const port = process.env.PORT || 5001

app.get("/", (req, res) => {
    res.json({
        messsage: "Hoş Geldiniz"
    });
});

app.listen(port, () =>{
    console.log(`Server ${port} portunu dinlemektedir...`);
});