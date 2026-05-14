# Лабораторная работа №5

## Добавление AJAX запросов к API

---

## Цель работы

Подключить фронтенд-приложение (разработанное в ЛР №3) к реальному REST API бэкенду (разработанному в ЛР №4) с помощью XHR-запросов. Добавить страницу создания и редактирования миссий.

---

## Структура проекта

```
Lab_5/
├── components/
│   ├── filter/index.js       — компонент фильтрации
│   ├── header/index.js       — компонент шапки
│   ├── item-card/index.js    — компонент карточки
│   └── item-detail/index.js  — компонент детального просмотра
├── modules/                  ← НОВЫЙ слой (добавлен в ЛР5)
│   ├── ajax.js               — класс для XHR-запросов
│   └── stockUrls.js          — класс для хранения URL эндпоинтов
├── pages/
│   ├── main/index.js         — главная страница (переработана)
│   ├── detail/index.js       — страница детали (переработана)
│   └── edit/index.js         ← НОВАЯ страница добавления/редактирования
├── css/main.css
├── index.html
└── main.js
```

Ключевое изменение по сравнению с ЛР №3 — появился слой `modules/`. Раньше данные хранились прямо в коде (в файле `mock/items.js`). Теперь они приходят с сервера по сети через HTTP-запросы.

---

## 1. Модуль `modules/ajax.js` — обёртка над XMLHttpRequest

### Зачем нужен

XMLHttpRequest — браузерный API для отправки HTTP-запросов без перезагрузки страницы. Его код достаточно многословный, поэтому все повторяющиеся части вынесены в отдельный класс `Ajax`, чтобы не писать одно и то же в каждом месте.

### Код и объяснение

```js
class Ajax {
    get(url, callback) {
        const xhr = new XMLHttpRequest(); // создаём объект запроса
        xhr.open('GET', url);            // указываем метод и адрес
        xhr.send();                      // отправляем запрос

        xhr.onreadystatechange = () => {
            // readyState === 4 означает, что ответ полностью получен
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }
```

`readyState` проходит через 5 состояний:

| Значение | Смысл                     |
| -------- | ------------------------- |
| 0        | Запрос не инициализирован |
| 1        | Соединение установлено    |
| 2        | Запрос отправлен          |
| 3        | Получение ответа          |
| 4        | Ответ полностью получен   |

Нас интересует только состояние `4` — когда данные уже пришли.

```js
    post(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // Для POST/PATCH обязательно указываем Content-Type,
        // чтобы сервер знал что мы отправляем JSON, а не форму
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data)); // объект → строка JSON
        // ...
    }
```

```js
    _handleResponse(xhr, callback) {
        try {
            // responseText — строка, JSON.parse превращает её в объект
            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            // вызываем коллбек и передаём данные + HTTP статус (200, 404 и т.д.)
            callback(data, xhr.status);
        } catch (e) {
            // если ответ не JSON — не крашимся, просто передаём null
            console.error('Ошибка парсинга JSON:', e);
            callback(null, xhr.status);
        }
    }
}

export const ajax = new Ajax(); // экспортируем один экземпляр на весь проект
```

### Паттерн callback

Поскольку XHR работает **асинхронно** (запрос уходит, а код продолжает выполняться), результат нельзя получить через `return`. Вместо этого используется **функция обратного вызова (callback)** — она будет вызвана, когда ответ придёт:

```js
// Пример использования
ajax.get("http://localhost:3000/missions", (data, status) => {
  // этот код выполнится КОГДА придёт ответ, а не сразу
  if (status === 200) {
    console.log(data); // массив миссий
  }
});
// этот код выполнится СРАЗУ, не дожидаясь ответа
console.log("Запрос отправлен...");
```

---

## 2. Модуль `modules/stockUrls.js` — хранилище URL

### Зачем нужен

Чтобы не писать `'http://localhost:3000/missions'` в каждом файле. Если адрес сервера изменится — поправить нужно будет только в одном месте.

### Код и объяснение

```js
class MissionUrls {
  constructor() {
    this.baseUrl = "http://localhost:3000"; // базовый адрес сервера
  }

  getMissions() {
    return `${this.baseUrl}/missions`; // GET /missions
  }

  getMissionById(id) {
    return `${this.baseUrl}/missions/${id}`; // GET /missions/1
  }

  createMission() {
    return `${this.baseUrl}/missions`; // POST /missions
  }

  removeMissionById(id) {
    return `${this.baseUrl}/missions/${id}`; // DELETE /missions/1
  }

  updateMissionById(id) {
    return `${this.baseUrl}/missions/${id}`; // PATCH /missions/1
  }
}

export const stockUrls = new MissionUrls();
```

Использование в других файлах:

```js
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';

// Получить все миссии
ajax.get(stockUrls.getMissions(), (data, status) => { ... });

// Получить миссию с id = 3
ajax.get(stockUrls.getMissionById(3), (data, status) => { ... });
```

---

## 3. Главная страница `pages/main/index.js`

### Что изменилось по сравнению с ЛР3

В ЛР3 данные брались из локального объекта:

```js
// ЛР3 — данные из файла
import { items } from "../../mock/items.js";
this.data = items;
this.renderCards();
```

В ЛР5 данные запрашиваются с сервера:

```js
// ЛР5 — данные из API
getData() {
    ajax.get(stockUrls.getMissions(), (data, status) => {
        if (status === 200 && data) {
            this.data = data;
            this.filteredData = [...this.data];
            this.renderCards();
        } else {
            this.renderError(); // показываем сообщение об ошибке
        }
    });
}
```

### Состояния загрузки

Пока данные грузятся — пользователь видит спиннер (индикатор загрузки). Он задаётся прямо в HTML шаблоне страницы и заменяется карточками когда данные пришли:

```js
// В getHTML() — начальное состояние (спиннер)
<div class="mission-carousel-track" id="carousel-track">
  <div class="spinner-border text-light" role="status"></div>
  <p class="text-secondary mt-3">Loading missions...</p>
</div>;

// В renderCards() — спиннер заменяется карточками
track.innerHTML = ""; // очищаем (убираем спиннер)
this.filteredData.forEach((item) => {
  // создаём и добавляем карточки
});
```

### Обработка ошибки

Если сервер недоступен или вернул не 200 — показываем понятное сообщение:

```js
renderError() {
    const track = document.getElementById('carousel-track');
    track.innerHTML = `
        <p>Не удалось загрузить миссии</p>
        <p>Убедитесь, что сервер запущен на http://localhost:3000
           и включено расширение CORS Unblock.</p>`;
}
```

### Новые кнопки на карточках

В ЛР5 на каждой карточке появились кнопки редактирования (✎) и удаления (✕), помимо кнопки Details:

```js
getCardHTML(item) {
    return `
    <div class="card mission-card">
        ...
        <button id="detail-btn-${item.id}" data-id="${item.id}">Details →</button>
        <button id="edit-btn-${item.id}"   data-id="${item.id}">✎</button>
        <button id="delete-btn-${item.id}" data-id="${item.id}">✕</button>
    </div>`;
}
```

Атрибут `data-id` позволяет узнать ID карточки при клике:

```js
slide.querySelector(`#edit-btn-${item.id}`)
    .addEventListener('click', (e) => this.onEditClick(e));

onEditClick(e) {
    const id = Number(e.target.dataset.id); // читаем data-id
    import('../edit/index.js').then(({ EditPage }) => {
        const page = new EditPage(this.parent, id);
        page.render();
    });
}
```

---

## 4. Страница детали `pages/detail/index.js`

### Что изменилось

В ЛР3 данные карточки передавались при переходе (из памяти). В ЛР5 страница сама запрашивает данные по ID через API:

```js
export class DetailPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = Number(id); // сохраняем ID
  }

  getData() {
    // запрашиваем конкретную миссию: GET /missions/3
    ajax.get(stockUrls.getMissionById(this.id), (data, status) => {
      if (status === 200 && data) {
        this.renderData(data); // рисуем страницу с данными
      } else {
        // миссия не найдена или сервер упал
        this.pageRoot.innerHTML = `<p>Mission not found</p>`;
      }
    });
  }

  render() {
    this.parent.innerHTML = "";
    // ...рисуем шапку...

    // Сначала показываем спиннер
    this.pageRoot.innerHTML = `<div class="spinner-border text-light"></div>`;

    // Затем запрашиваем данные — спиннер заменится контентом
    this.getData();
  }
}
```

Это важный принцип: страница не зависит от того, откуда на неё перешли. Она всегда сама получает актуальные данные с сервера.

---

## 5. Страница редактирования `pages/edit/index.js` (новая)

### Два режима работы

Страница умеет работать в двух режимах, определяемых при создании:

```js
export class EditPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id !== null && id !== undefined ? Number(id) : null;
        this.isNew = this.id === null; // true = добавление, false = редактирование
    }
```

При вызове:

```js
new EditPage(parent, null); // → режим добавления (пустая форма)
new EditPage(parent, 3); // → режим редактирования (загрузит миссию #3)
```

### Загрузка данных для редактирования

```js
render() {
    // ...шапка...

    if (this.isNew) {
        // Добавление — сразу рисуем пустую форму
        this.renderForm({});
    } else {
        // Редактирование — сначала спиннер, потом запрос
        this.pageRoot.innerHTML = `<div class="spinner-border text-light"></div>`;
        this.getData(); // запросит GET /missions/:id и заполнит форму
    }
}

getData() {
    ajax.get(stockUrls.getMissionById(this.id), (data, status) => {
        if (status === 200 && data) {
            this.renderForm(data); // передаём данные в форму
        }
    });
}
```

### Заполнение формы данными

```js
getFormHTML(data = {}) {
    // Если data пустой — поля будут пустые (режим добавления)
    // Если data заполнен — поля заполнятся данными миссии
    const mission_name = data.mission_name || '';
    const description  = data.description  || '';
    const image        = data.image        || '';

    return `
    <input type="text" id="edit-name"  value="${mission_name}" />
    <input type="url"  id="edit-image" value="${image}" />
    <textarea id="edit-description">${description}</textarea>
    `;
}
```

### Живое превью изображения

При вводе URL картинки превью обновляется в реальном времени без перезагрузки:

```js
document.getElementById("edit-image").addEventListener("input", (e) => {
  const preview = document.getElementById("edit-img-preview");
  if (preview && e.target.value) {
    preview.src = e.target.value; // меняем src — браузер сразу загружает новое фото
  }
});
```

### Заглушка вместо кнопки "Сохранить"

По условию ЛР5 кнопка сохранения отсутствует — она появится в ЛР6. Вместо неё — информационная плашка:

```html
<div class="edit-notice">
  <span class="edit-notice__icon">ℹ</span>
  Кнопка <strong>Сохранить</strong> появится в следующей лабораторной работе.
</div>
```

---

## 6. CORS — политика ограничения запросов

### Проблема

Браузер блокирует запросы между разными источниками (origin). Фронтенд работает на `http://localhost:8080`, а API на `http://localhost:3000` — это разные порты, значит разные источники. При попытке выполнить XHR-запрос браузер выдаст ошибку:

```
Access to XMLHttpRequest at 'http://localhost:3000/missions'
from origin 'http://localhost:8080' has been blocked by CORS policy
```

### Решение 1 — заголовки на сервере (рекомендуется)

В `src/index.js` бэкенда добавляется middleware:

```js
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
```

Сервер сам говорит браузеру: "разрешаю запросы с любого домена".

### Решение 2 — расширение CORS Unblock

Расширение для Chrome перехватывает ответы сервера и добавляет нужные заголовки на стороне браузера. Удобно для разработки, но не работает в Safari.

---

## 7. Схема работы приложения

```
Браузер (localhost:8080)
        │
        │  XHR запрос: GET /missions
        ▼
Сервер (localhost:3000)
        │
        │  JSON ответ: [{id:1, mission_name:...}, ...]
        ▼
ajax._handleResponse()  →  JSON.parse()  →  callback(data, 200)
        │
        ▼
MainPage.getData()  →  this.data = data  →  renderCards()
        │
        ▼
Карточки отрисовываются в DOM
```

---

## 8. Запуск проекта

```bash
# Терминал 1 — бэкенд
cd Lab_4
npm run start
# → Сервер запущен на http://localhost:3000

# Терминал 2 — фронтенд
cd Lab_5
live-server .
# → Сайт открылся на http://localhost:8080
```

---

## Вывод

В ходе лабораторной работы было реализовано:

1. **Слой `modules/`** — отдельный уровень для работы с API, что делает код чище и переиспользуемым.
2. **Класс `Ajax`** — универсальная обёртка над XMLHttpRequest для GET, POST, PATCH, DELETE запросов с обработкой ошибок.
3. **Класс `MissionUrls`** — централизованное хранение URL эндпоинтов.
4. **Главная страница** — данные теперь приходят с API, добавлены состояния загрузки и ошибки.
5. **Страница детали** — самостоятельно запрашивает данные по ID, не зависит от способа перехода.
6. **Страница редактирования/добавления** — новая страница с двумя режимами, живым превью изображения и заполнением полей из API.
7. **CORS** — настроен на уровне бэкенда через middleware заголовки.
