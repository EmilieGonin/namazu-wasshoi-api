const express = require('express');
const app = express();
const port = process.env.PORT || "3000";

app.get("/", (req, res) => {
	res.send("Hello World");
})

app.use("/user", require("./routes/user"));
app.use("/fc", require("./routes/fc"));

app.listen(port, () => console.log("Serveur lancé sur le port " + port + "."));
