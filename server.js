const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const BASE_URL = "https://edusp-api.ip.tv";

app.all("/proxy/*", async (req, res) => {
  const requestId = uuidv4();
  const startTime = Date.now();

  const endpoint = req.params[0];
  const url = `${BASE_URL}/${endpoint}`;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  console.log("===== NOVA REQUISIÇÃO =====");
  console.log("ID:", requestId);
  console.log("Timestamp:", new Date().toISOString());
  console.log("IP:", ip);
  console.log("Método:", req.method);
  console.log("Rota recebida:", req.originalUrl);
  console.log("Rota destino:", url);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));

  try {
    const response = await axios({
      method: req.method,
      url: url,
      headers: {
        ...req.headers,
        host: undefined
      },
      data: req.body
    });

    const duration = Date.now() - startTime;

    console.log("----- RESPOSTA -----");
    console.log("ID:", requestId);
    console.log("Status:", response.status);
    console.log("Tempo (ms):", duration);
    console.log("Tamanho resposta:", JSON.stringify(response.data).length);
    console.log("Resposta:", JSON.stringify(response.data, null, 2));
    console.log("============================");

    res.status(response.status).json(response.data);

  } catch (error) {
    const duration = Date.now() - startTime;

    console.log("----- ERRO -----");
    console.log("ID:", requestId);
    console.log("Tempo (ms):", duration);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Resposta erro:", JSON.stringify(error.response.data, null, 2));
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log("Erro interno:", error.message);
      res.status(500).json({ erro: "falha ao conectar na API externa" });
    }

    console.log("============================");
  }
});

app.get("/", (req, res) => {
  res.json({ status: "proxy com log detalhado ativo" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor proxy avançado rodando na porta " + PORT);
});
