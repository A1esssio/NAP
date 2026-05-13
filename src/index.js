const express = require("express");
const path = require("path");
const missionsRouter = require("./routes/missions");
const missionsService = require("./services/missionsService");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "missions.json");

// Инициализируем сервис с путём к файлу данных
missionsService.init(DATA_FILE);

// 1. Парсинг JSON-тела запроса
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// 2. Logging middleware
function loggingMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}
app.use(loggingMiddleware);

// 3. Роуты миссий
app.use("/missions", missionsRouter);

// 4. 404 handler
function notFoundHandler(req, res) {
  res
    .status(404)
    .json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
}
app.use(notFoundHandler);

// 5. Error handler
function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);
  res
    .status(500)
    .json({ error: "Внутренняя ошибка сервера", details: err.message });
}
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SpaceX API запущен на http://localhost:${PORT}`);
  console.log(`📄 Данные читаются из: ${DATA_FILE}`);
});
