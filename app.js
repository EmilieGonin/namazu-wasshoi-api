const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || "3000";
const emptyTemp = require("./middlewares/emptyTemp");
require('./helpers/festivalJobs');
require('./bot/gyoshoi');

app.use(cors({
	origin: "*",
	credentials: true,
	allowHeaders: "Authorization"
}));
app.options("*", cors());

//Hello World Test
app.get("/", (req, res) => {
	res.send("Hello World");
})

app.use(express.json());
app.use("/applicants", require("./routes/applicants"));
app.use("/fc", require("./routes/fc"));
app.use("/festivals", require("./routes/festivals"));
app.use("/parameters", require("./routes/parameters"));
app.use("/screenshots", require("./routes/screenshots"));
app.use("/users", require("./routes/users"));

app.use((error, req, res, next) => {
	res.status(error.status ? error.status : 500).json({
		error: error.message ? error.message : "Une erreur s'est produite." });
	emptyTemp();
})

app.listen(port, () => console.log("Serveur lancé sur le port " + port + "."));
