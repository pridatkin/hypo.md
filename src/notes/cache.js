const fs = require("fs");
const path = require("path");
const { scanDir } = require("./scan");
const { NOTES_DIR } = require("../config");

let cachedTree = null;
let watcher = null;
let debounceTimer = null;
// Отложенный сброс: если за это время прилетит ещё событие — таймер сбросится
const DEBOUNCE_MS = 100;

/**
 * Возвращает дерево заметок. Сканирует директорию только при первом
 * обращении или после сброса кэша watcher'ом.
 */
function getTree() {
  if (!cachedTree) {
    cachedTree = scanDir(NOTES_DIR);
  }
  return cachedTree;
}

/**
 * Сбрасывает кэш. Вызывается watcher'ом с дебаунсом.
 */
function invalidate() {
  cachedTree = null;
}

/**
 * Дебаунс: при массовых изменениях (например, git pull с десятками файлов)
 * событий прилетит много, а пересканировать нужно только один раз.
 */
function scheduleInvalidate() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    invalidate();
  }, DEBOUNCE_MS);
}

/**
 * Запускает отслеживание директории заметок.
 * @returns {boolean} удалось ли запустить рекурсивное отслеживание
 */
function startWatching() {
  if (watcher) return true;

  try {
    watcher = fs.watch(
      NOTES_DIR,
      { recursive: true },
      (eventType, filename) => {
        // filename может быть null — сбрасываем кэш в любом случае
        scheduleInvalidate();
      },
    );

    watcher.on("error", (err) => {
      console.error("[notes-cache] watcher error:", err);
      // Не падаем — просто перестаём получать события,
      // кэш останется жить до следующего ручного сброса или TTL
    });

    return true;
  } catch (err) {
    // recursive: true не поддерживается платформой
    console.warn("[notes-cache] recursive watch not available:", err.message);
    return false;
  }
}

/**
 * Останавливает отслеживание (например, при graceful shutdown).
 */
function stopWatching() {
  if (watcher) {
    watcher.close();
    watcher = null;
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

module.exports = { getTree, invalidate, startWatching, stopWatching };
