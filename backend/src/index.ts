import "dotenv/config";
import "./db/seed.js";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`API do Marketplace Campus rodando em http://localhost:${port}`);
});
