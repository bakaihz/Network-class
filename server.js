const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", (req, res) => {
    console.log("Nova requisição recebida");
    console.log("Método:", req.method);
    console.log("Rota:", req.originalUrl);
    console.log("Query:", req.query);
    console.log("Body:", req.body);

    res.status(200).json({
        status: "online",
        method: req.method,
        rota: req.originalUrl,
        query: req.query,
        body: req.body
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
