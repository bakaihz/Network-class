const express = require("express");
const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.all("*", (req, res) => {

  const authHeader = req.headers["authorization"] || null;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  const detalhes = {
    status: "requisição recebida",
    timestamp: new Date().toISOString(),
    metodo: req.method,
    rota: req.originalUrl,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
    authorizationHeader: authHeader,
    bearerToken: token,
    headers: req.headers,
    query: req.query,
    body: req.body
  };

  console.log("==== NOVA REQUISIÇÃO ====");
  console.log(JSON.stringify(detalhes, null, 2));

  res.status(200).json(detalhes);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor de inspeção rodando na porta " + PORT);
});
