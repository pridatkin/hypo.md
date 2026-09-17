const express = require("express");
const { PORT, NOTES_DIR, HOME_NOTE } = require("./src/config");
const homeRouter = require("./src/routes/home");
const noteRouter = require("./src/routes/note");
const notFoundHandler = require("./src/routes/not-found");
const {
  startWatching,
  stopWatching,
  invalidate,
} = require("./src/notes/cache");

const app = express();

// app.get("/", (req, res) => {
//   res.redirect("/index");
// });

app.use(homeRouter);
app.use(noteRouter);
app.use(notFoundHandler);

const server = app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Каталог заметок: ${NOTES_DIR}`);
  console.log(`Главая заметка: ${HOME_NOTE}`);

  // Запускаем слежение за директорией заметок.
  // Если платформа не поддерживает recursive watch —
  // включаем TTL-инвалидацию как запасной вариант.
  const recursiveOk = startWatching();
  if (recursiveOk) {
    console.log("Слежение за изменениями заметок: включено");
  } else {
    const TTL = Number(process.env.NOTES_CACHE_TTL || 30) * 1000;
    setInterval(invalidate, TTL);
    console.log(`Слежение недоступно, TTL-инвалидация кэша: ${TTL / 1000}с`);
  }
});

// Корректное завершение: закрываем HTTP-сервер и watcher
function shutdown(signal) {
  console.log(`\nПолучен ${signal}, останавливаемся...`);
  stopWatching();
  server.close(() => {
    console.log("Сервер остановлен");
    process.exit(0);
  });
  // На случай, если соединения не закрываются — принудительный выход
  setTimeout(() => process.exit(1), 3000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
