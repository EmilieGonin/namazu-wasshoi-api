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
app.use("/user", require("./routes/user"));
app.use("/fc", require("./routes/fc"));
app.use("/parameters", require("./routes/parameters"));
app.use("/applicants", require("./routes/applicants"));

app.listen(port, () => console.log("Serveur lancé sur le port " + port + "."));
