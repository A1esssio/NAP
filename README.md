# Лабораторная работа №6

## Промисы, fetch и сборка клиентской части

---

## Цель работы

Две части:

1. Заменить все XHR-запросы из ЛР5 на современный `fetch` с использованием `async/await`. Добавить кнопку **Сохранить** на странице редактирования.
2. Собрать фронтенд через `Vite` и настроить бэкенд (ЛР4) для раздачи собранного фронта в качестве статики — чтобы всё работало на одном порту без CORS.

---

## Часть 1. Promise, fetch, async/await

### 1. Что такое Promise

**Promise** (промис) — специальный объект JavaScript для работы с асинхронными операциями. Асинхронная операция — та, результат которой будет известен не сразу, а в будущем (например, запрос к серверу).

У промиса три состояния:

| Состояние   | Смысл                                                 |
| ----------- | ----------------------------------------------------- |
| `pending`   | Ожидание — операция выполняется, результат неизвестен |
| `fulfilled` | Успех — операция завершилась, результат получен       |
| `rejected`  | Ошибка — что-то пошло не так                          |

```js
const promise = new Promise((resolve, reject) => {
  // resolve() → переводит в fulfilled
  // reject()  → переводит в rejected

  fetch("http://localhost:3000/missions").then(resolve).catch(reject);
});

// Обработка результата через .then() / .catch()
promise
  .then((data) => console.log("Успех:", data))
  .catch((err) => console.log("Ошибка:", err))
  .finally(() => console.log("Завершено"));
```

### 2. async/await — синтаксический сахар над Promise

`async/await` — более удобный способ работать с промисами. Вместо цепочек `.then().catch()` код пишется как обычный последовательный:

```js
// Старый способ — .then() цепочка
fetch("/api/missions")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// Новый способ — async/await
async function loadMissions() {
  try {
    const response = await fetch("/api/missions");
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
```

`await` приостанавливает выполнение функции до получения результата промиса. Функция обязана быть помечена `async`. Ошибки ловятся через стандартный `try/catch`.

### 3. fetch — замена XMLHttpRequest

`fetch` — встроенная браузерная функция для HTTP-запросов, возвращает промис.

Сравнение с XHR из ЛР5:

```js
// ЛР5 — XMLHttpRequest + callback
get(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const data = JSON.parse(xhr.responseText);
            callback(data, xhr.status);
        }
    };
}

// ЛР6 — fetch + async/await
async get(url) {
    const response = await fetch(url);
    const data = await response.json();
    return { data, status: response.status };
}
```

Ключевые отличия:

- `fetch` возвращает промис, не требует коллбеков
- `response.json()` тоже возвращает промис — нужен второй `await`
- Ошибки сети ловятся через `try/catch`
- Код значительно короче и читабельнее

---

## Часть 1. Изменения в коде

### `modules/ajax.js` — полная переработка

```js
class Ajax {
  async get(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return { data, status: response.status };
    } catch (e) {
      console.error("Ошибка GET запроса:", e);
      return { data: null, status: 0 };
    }
  }

  async post(url, body) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (e) {
      console.error("Ошибка POST запроса:", e);
      return { data: null, status: 0 };
    }
  }

  async patch(url, body) {
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (e) {
      console.error("Ошибка PATCH запроса:", e);
      return { data: null, status: 0 };
    }
  }

  async delete(url) {
    try {
      const response = await fetch(url, { method: "DELETE" });
      // DELETE возвращает 204 No Content — тела нет
      const data = response.status !== 204 ? await response.json() : null;
      return { data, status: response.status };
    } catch (e) {
      console.error("Ошибка DELETE запроса:", e);
      return { data: null, status: 0 };
    }
  }
}

export const ajax = new Ajax();
```

Интерфейс изменился — вместо коллбека методы теперь возвращают объект `{ data, status }`:

```js
// ЛР5 — коллбек
ajax.get(url, (data, status) => {
    if (status === 200) { ... }
});

// ЛР6 — async/await
const { data, status } = await ajax.get(url);
if (status === 200) { ... }
```

### Обновление вызовов в страницах

Все методы `getData()` стали `async`:

```js
// pages/main/index.js
async getData() {
    const { data, status } = await ajax.get(stockUrls.getMissions());
    if (status === 200 && data) {
        this.data = data;
        this.filteredData = [...this.data];
        this.renderCards();
    } else {
        this.renderError();
    }
}

// pages/detail/index.js
async getData() {
    const { data, status } = await ajax.get(stockUrls.getMissionById(this.id));
    if (status === 200 && data) {
        this.renderData(data);
    } else {
        this.pageRoot.innerHTML = `<p>Mission not found</p>`;
    }
}
```

### `pages/edit/index.js` — кнопка Сохранить

В ЛР5 кнопки сохранения не было. В ЛР6 она появляется и выполняет POST (создание) или PATCH (обновление):

```js
async onSave() {
    const mission_name = document.getElementById('edit-name').value.trim();
    const image        = document.getElementById('edit-image').value.trim();
    const description  = document.getElementById('edit-description').value.trim();

    // Валидация обязательных полей
    if (!mission_name || !description) {
        this.showStatus('error', 'Mission Name and Description are required.');
        return;
    }

    const payload = { mission_name, image, description };

    let result;
    if (this.isNew) {
        // Новая миссия → POST /api/missions
        result = await ajax.post(stockUrls.createMission(), payload);
    } else {
        // Существующая → PATCH /api/missions/:id
        result = await ajax.patch(stockUrls.updateMissionById(this.id), payload);
    }

    if (result.status === 200 || result.status === 201) {
        this.showStatus('success', this.isNew ? 'Mission created!' : 'Changes saved!');
        // Через секунду возвращаемся на главную
        setTimeout(() => new MainPage(this.parent).render(), 1000);
    } else {
        this.showStatus('error', `Error ${result.status}. Please try again.`);
    }
}
```

Логика определения режима (`isNew`):

```js
constructor(parent, id) {
    this.id   = id !== null && id !== undefined ? Number(id) : null;
    this.isNew = this.id === null; // null = добавление, число = редактирование
}
```

---

## Часть 2. Сборка через Vite

### Зачем нужна сборка

В dev-режиме браузер загружает каждый JS-файл отдельно — десятки запросов. Сборщик (bundler) объединяет все файлы в один оптимизированный бандл: минифицирует код, убирает лишнее, хэширует имена файлов для кэширования.

### Установка и настройка Vite

```bash
npm install -D vite
```

`package.json` — добавляем скрипты и меняем `type` на `module`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "bootstrap": "^5.3.8"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  }
}
```

`vite.config.js`:

```js
export default {
  build: {
    outDir: "./public", // папка с результатом сборки
    emptyOutDir: true, // очищать перед каждой сборкой
  },
  server: {
    port: 5173,
    proxy: {
      // В dev-режиме /api/* проксируется на localhost:3000/*
      // Это решает CORS при локальной разработке
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
```

Прокси в dev-режиме работает так: запрос с фронта на `/api/missions` Vite перенаправляет на `http://localhost:3000/missions`. Браузер думает что запрос идёт на тот же сервер — CORS не срабатывает.

### Изменения в index.html

Bootstrap больше не подключается через `node_modules` напрямую — Vite сам обработает импорты из `node_modules`. Тег `<script>` для bootstrap убирается:

```html
<!-- ЛР5 — прямые пути к node_modules -->
<link
  rel="stylesheet"
  href="node_modules/bootstrap/dist/css/bootstrap.min.css"
/>
<script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

<!-- ЛР6 — только один скрипт, bootstrap импортируется через main.js -->
<script src="main.js" type="module"></script>
```

### Изменения в main.js

Bootstrap теперь импортируется как npm-пакет:

```js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { MainPage } from "./pages/main/index.js";

const root = document.getElementById("root");
const mainPage = new MainPage(root);
mainPage.render();
```

### Команды

```bash
# Запуск в режиме разработки (с hot reload)
npm run dev
# → http://localhost:5173

# Сборка для продакшена
npm run build
# → создаётся папка public/ со всеми файлами

# Превью собранной версии
npm run preview
# → http://localhost:4173
```

---

## Часть 2. Раздача фронта с бэкенда

### Зачем

После сборки фронт — это набор статических файлов (HTML, JS, CSS). Бэкенд может раздавать их как обычные файлы. Тогда и фронт и API работают на одном домене `localhost:3000` — CORS-проблем нет вообще.

### Порядок действий

1. В папке ЛР6 собрать фронт:

```bash
npm run build
# появится папка public/
```

2. Скопировать папку `public/` в корень проекта ЛР4:

```
Lab_4/
├── src/
│   └── index.js
└── public/        ← скопировать сюда
    ├── index.html
    └── assets/
```

3. В `src/index.js` бэкенда добавить раздачу статики:

```js
// После CORS middleware, до роутов API
app.use(express.static(path.join(__dirname, "..", "public")));
```

`path.join(__dirname, '..', 'public')` — здесь:

- `__dirname` — папка `src/`
- `..` — поднимаемся в корень ЛР4
- `public` — папка со сборкой

4. Роут API переименовать с `/missions` на `/api/missions`:

```js
// было:
app.use("/missions", missionsRouter);

// стало:
app.use("/api/missions", missionsRouter);
```

5. Перезапустить бэкенд:

```bash
npm run start
```

6. Открыть `http://localhost:3000` — фронт открывается прямо с бэкенда.

### Схема работы после сборки

```
Браузер → http://localhost:3000/
              │
              ▼
        Express сервер
              │
         ┌────┴────┐
         │         │
    /assets/*   /api/*
    статика     API роуты
    из public/  → missionsRouter
```

Все запросы на одном домене — никакого CORS.

---

## Итог

|                  | ЛР5                       | ЛР6                                   |
| ---------------- | ------------------------- | ------------------------------------- |
| Запросы          | XMLHttpRequest + callback | fetch + async/await                   |
| Запуск           | live-server / npm start   | npm run dev (Vite)                    |
| Сборка           | нет                       | npm run build → public/               |
| CORS             | расширение браузера       | прокси Vite (dev) / один домен (prod) |
| Кнопка Сохранить | отсутствует               | POST / PATCH запрос                   |
| Раздача фронта   | отдельный сервер          | бэкенд раздаёт public/                |
