const express = require("express");
const { PORT, NOTES_DIR } = require("./src/config");
const homeRouter = require("./src/routes/home");
const noteRouter = require("./src/routes/note");

const app = express();

app.use(homeRouter);
app.use(noteRouter);

app.use((req, res) => res.status(404).send("Заметка не найдена"));

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Каталог заметок: ${NOTES_DIR}`);
});
