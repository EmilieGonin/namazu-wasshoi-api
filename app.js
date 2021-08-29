const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || "3000";
require('./helpers/festivalJobs');

//Hello World Test
app.get("/", (req, res) => {
	res.send("Hello World");
})

app.use(cors({
	origin: "*",
	credentials: true
}));

app.use(express.json());
app.use("/applicants", require("./routes/applicants"));
app.use("/fc", require("./routes/fc"));
app.use("/festivals", require("./routes/festivals"));
app.use("/parameters", require("./routes/parameters"));
app.use("/screenshots", require("./routes/screenshots"));
app.use("/users", require("./routes/users"));

app.use((error, req, res, next) => {
	if (error.status && error.message) {
		return res.status(error.status).json({ error: error.message });
	} else {
		return res.status(500).json({ error: "Une erreur s'est produite." });
	}
})

app.listen(port, () => console.log("Serveur lancé sur le port " + port + "."));
