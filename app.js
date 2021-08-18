const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || "3000";

//Hello World Test
app.get("/", (req, res) => {
	res.send("Hello World");
})

app.use(cors({
	credentials: true
}));

app.use(express.json());
app.use("/applicants", require("./routes/applicants"));
app.use("/fc", require("./routes/fc"));
app.use("/festivals", require("./routes/festivals"));
app.use("/parameters", require("./routes/parameters"));
app.use("/screenshots", require("./routes/screenshots"));
app.use("/users", require("./routes/users"));

app.listen(port, () => console.log("Serveur lancé sur le port " + port + "."));
