# SpaceX Mission Archive — Документация Лабораторная №3

> Подробная документация всех файлов проекта: `index.html`, `main.js`, `mock/items.js`, четырёх компонентов, двух страниц и `css/main.css`.

---

## Содержание

1. [Структура проекта](#структура-проекта)
2. [index.html](#indexhtml)
3. [main.js](#mainjs)
4. [mock/items.js](#mockitemsjs)
5. [components/header/index.js](#componentsheaderindexjs)
6. [components/filter/index.js](#componentsfilterindexjs)
7. [components/item-card/index.js](#componentsitem-cardindexjs)
8. [components/item-detail/index.js](#componentsitem-detailindexjs)
9. [pages/main/index.js](#pagesmainindexjs)
10. [pages/detail/index.js](#pagesdetailindexjs)
11. [css/main.css](#cssmaincss)
12. [Карта взаимосвязей](#карта-взаимосвязей)

---

## Структура проекта

```
Lab_3/
├── index.html                      ← точка входа, загружается браузером первой
├── main.js                         ← инициализация приложения
├── mock/
│   └── items.js                    ← массив данных (имитация бекенда)
├── pages/
│   ├── main/index.js               ← страница списка миссий
│   └── detail/index.js             ← страница подробнее
├── components/
│   ├── header/index.js             ← шапка с кнопкой Home (общая)
│   ├── filter/index.js             ← выпадающий список фильтрации
│   ├── item-card/index.js          ← карточка миссии в списке
│   └── item-detail/index.js        ← детальная карточка миссии
├── css/
│   └── main.css                    ← все стили (пространство + Bootstrap overrides)
└── node_modules/                   ← Bootstrap 5 (npm i bootstrap)
```

**Архитектурный принцип:** приложение построено на классах-компонентах. Каждый компонент умеет сам строить свою HTML-разметку (`getHTML`) и навешивать обработчики событий (`addListeners`). Страницы — это тоже классы: они создают дочерние компоненты и передают им данные и колбэки.

---

## index.html

Единственный HTML-файл в проекте. Браузер загружает его первым — это стандартное поведение веб-сервера. Весь остальной контент (карточки, заголовки, фильтры) генерирует JavaScript в рантайме.

---

### `<head>` — метаданные и подключение ресурсов

```html
<meta charset="UTF-8" />
```
Кодировка UTF-8 — корректное отображение всех символов.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
Адаптивность: на мобильных устройствах ширина viewport = ширина экрана.

```html
<title>SpaceX | Mission Archive</title>
```
Заголовок вкладки браузера.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&display=swap" rel="stylesheet" />
```
Подключение шрифта **Barlow** (начертания 300, 400, 600, 700). `preconnect` — ускоряет загрузку, открывая DNS-соединение заранее. `display=swap` — пока шрифт грузится, используется системный шрифт, без пустого мигания.

```html
<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
```
Подключение **Bootstrap 5** из локальной папки `node_modules`. Bootstrap был установлен командой `npm i bootstrap`. Даёт готовые утилиты: сетку, кнопки, модальные окна, бейджи.

```html
<link rel="stylesheet" href="css/main.css" />
```
Кастомные стили поверх Bootstrap — переопределяют Bootstrap-классы и добавляют специфичные для проекта стили (звёздный фон, glassmorphism-карточки, шапка).

---

### `<body>` — тело документа

#### Космический фон (тот же, что в лабах 1 и 2)

```html
<div class="stars-container"></div>
```
Контейнер звёздного неба. Сами звёзды реализованы через CSS-псевдоэлементы `::before` и `::after` с паттерном `radial-gradient`. `position: fixed` — фон остаётся на месте при скролле.

```html
<div class="meteor-shower">
    <div class="meteor"></div> <!-- × 7 -->
</div>
```
Метеоритный дождь: 7 элементов `.meteor`, каждый — тонкая вертикальная полоса с градиентом. Обёртка повёрнута на -25° для диагонального направления. Циклически появляется и исчезает через CSS-анимацию `shower-cycle`.

```html
<div class="background-layer">
    <div class="vignette"></div>
</div>
```
`.background-layer` — фиксированный слой-обёртка. `.vignette` — радиальный градиент, затемняющий края экрана. Создаёт ощущение глубины.

#### Корневой элемент приложения

```html
<div id="root"></div>
```
Пустой `<div>` — точка монтирования приложения. Весь контент (шапка, страницы, компоненты) будет вставлен сюда через JavaScript с помощью `insertAdjacentHTML`. На момент загрузки `index.html` этот элемент пуст — это видно во вкладке **Response** в DevTools.

#### Подключение скриптов

```html
<script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
```
JavaScript-часть Bootstrap 5 (включает Popper.js). Подключён **до** `main.js`, чтобы глобальный объект `bootstrap` был доступен в коде приложения — он используется для управления модальным окном.

```html
<script src="main.js" type="module"></script>
```
Точка входа в JavaScript-приложение. Атрибут `type="module"` включает ES Modules — это позволяет использовать `import/export` между файлами. Скрипты подключены в конце `<body>`: к моменту исполнения JS весь DOM уже построен.

---

## main.js

Минимальный файл-инициализатор. Запускает приложение.

```javascript
import { MainPage } from "./pages/main/index.js";
```
ES Module import — загружает класс `MainPage` из файла страницы. Браузер сам загрузит файл по этому пути при исполнении скрипта.

```javascript
const root = document.getElementById('root');
```
Находит корневой элемент по `id="root"` — тот самый пустой `<div>` из `index.html`. Это родительский элемент для всего приложения.

```javascript
const mainPage = new MainPage(root);
mainPage.render();
```
Создаёт экземпляр главной страницы, передавая `root` как родительский элемент. Вызов `render()` запускает отрисовку всего приложения: шапки, фильтра, сетки карточек.

---

## mock/items.js

Файл с тестовыми данными — имитирует ответ бекенда. В реальном приложении этот файл заменяется на `fetch`-запрос к серверу.

```javascript
export const items = [
    {
        id: 1,
        title: "Falcon 9 — CRS-26",
        category: "Cargo",
        year: "2022",
        status: "Success",
        description: "...",      // короткое описание для карточки в списке
        fullDescription: "...",  // полное описание для страницы подробнее
        src: "https://..."       // URL изображения
    },
    // ... ещё 9 объектов
];
```

**Поля каждого объекта:**

| Поле | Тип | Использование |
|---|---|---|
| `id` | `number` | Уникальный идентификатор. Используется для поиска (`find`), удаления (`filter`), формирования `id` кнопок |
| `title` | `string` | Название миссии. Отображается в заголовке карточки и детальной страницы |
| `category` | `string` | Тип миссии. Используется для построения фильтра через `Set` |
| `year` | `string` | Год запуска. Метаданные на карточке |
| `status` | `string` | Статус: `"Success"`, `"Partial"`, `"Failure"`. Определяет цвет бейджа |
| `description` | `string` | Краткое описание — для карточки в списке |
| `fullDescription` | `string` | Полное описание — только для страницы подробнее |
| `src` | `string` | URL изображения миссии |

`export const` — экспортирует массив как именованный экспорт. Он импортируется в `pages/main/index.js` и `pages/detail/index.js` через `import { items } from "../../mock/items.js"`.

---

## components/header/index.js

Компонент шапки. Присутствует на обеих страницах. Содержит логотип и кнопку «← HOME».

### `constructor(parent)`

```javascript
constructor(parent) {
    this.parent = parent;
}
```
Принимает и сохраняет родительский DOM-элемент, в который будет вставлена шапка.

### `addListeners(onHomeClick)`

```javascript
addListeners(onHomeClick) {
    document
        .getElementById('home-button')
        .addEventListener('click', onHomeClick);
}
```
Находит кнопку по `id="home-button"` и вешает на неё обработчик клика. Функция `onHomeClick` приходит снаружи — со страницы, которая создала хедер. Сам компонент не знает, что именно произойдёт при клике — это принцип разделения ответственности.

### `getHTML()`

```javascript
getHTML() {
    return `
    <nav class="navbar navbar-dark spacex-header sticky-top">
        <div class="container-fluid px-4">
            <span class="navbar-brand header-logo mb-0">SPACE<span class="text-secondary">X</span> ARCHIVE</span>
            <button id="home-button" class="btn btn-outline-secondary btn-sm btn-home">
                &#8592; HOME
            </button>
        </div>
    </nav>
    `;
}
```
Возвращает HTML-строку. Использует Bootstrap-классы:
- `navbar navbar-dark` — тёмная навигационная панель Bootstrap.
- `sticky-top` — шапка залипает вверху экрана при скролле.
- `container-fluid px-4` — растягивает содержимое на всю ширину с отступами.
- `navbar-brand` — Bootstrap-класс для логотипа.
- `&#8592;` — HTML-сущность стрелки влево ←.

### `render(onHomeClick)`

```javascript
render(onHomeClick) {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    this.addListeners(onHomeClick);
}
```
Вставляет HTML в конец родительского элемента, затем навешивает слушатели. Порядок важен: `addEventListener` должен вызываться после того, как элемент появился в DOM.

---

## components/filter/index.js

Компонент фильтрации по категории миссии.

### `getHTML(categories)`

```javascript
getHTML(categories) {
    const options = categories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join('');

    return `
    <div class="d-flex align-items-center gap-2">
        <label for="filter-select" class="filter-label col-form-label-sm">
            Mission type
        </label>
        <select id="filter-select" class="form-select form-select-sm filter-select">
            <option value="all">All missions</option>
            ${options}
        </select>
    </div>
    `;
}
```
Принимает массив категорий. `Array.map()` преобразует каждую строку-категорию в HTML-тег `<option>`. `Array.join('')` склеивает массив строк в одну строку без разделителей. Первый вариант `"All missions"` с `value="all"` — специальное значение для сброса фильтра.

Используются Bootstrap-классы:
- `form-select form-select-sm` — стилизованный `<select>`.
- `d-flex align-items-center gap-2` — горизонтальное выравнивание подписи и селекта.

### `addListeners(onChangeListener)` и `render(categories, onChangeListener)`

```javascript
addListeners(onChangeListener) {
    document
        .getElementById('filter-select')
        .addEventListener('change', onChangeListener);
}

render(categories, onChangeListener) {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML(categories));
    this.addListeners(onChangeListener);
}
```
Событие `change` срабатывает при выборе нового значения в `<select>`. Функция-обработчик `onChangeListener` прокидывается со страницы — она знает, как перефильтровать массив карточек.

> **Замечание:** в `pages/main/index.js` FilterComponent создаётся без `parent` (`new FilterComponent(null)`) и HTML вставляется вручную через `insertAdjacentHTML('beforebegin', ...)` — это позволяет точно разместить фильтр перед кнопкой «+ Add Mission» внутри toolbar.

---

## components/item-card/index.js

Компонент карточки миссии для страницы списка.

### `getStatusBadgeClass(status)`

```javascript
getStatusBadgeClass(status) {
    if (status === 'Success') return 'badge-success-custom';
    if (status === 'Failure') return 'badge-failure-custom';
    return 'badge-partial-custom';
}
```
Вспомогательный метод: определяет CSS-класс для цветного бейджа статуса. Если статус не `Success` и не `Failure` — возвращает жёлтый `badge-partial-custom`. Эти классы описаны в `css/main.css`.

### `getHTML(data)`

```javascript
getHTML(data) {
    const statusClass = this.getStatusBadgeClass(data.status);
    return `
    <div class="col">
        <div class="card mission-card h-100" id="card-${data.id}">
            <div class="mission-card__img-wrap">
                <img src="${data.src}" ... loading="lazy" />
                <span class="mission-card__year">${data.year}</span>
            </div>
            <div class="card-body d-flex flex-column gap-2">
                <span class="badge badge-category">${data.category}</span>
                <span class="badge ${statusClass}">${data.status}</span>
                <h5 class="card-title mission-card__title">${data.title}</h5>
                <p class="card-text mission-card__text flex-grow-1">${data.description}</p>
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-outline-light btn-sm flex-grow-1 btn-detail"
                        id="detail-btn-${data.id}" data-id="${data.id}">Details →</button>
                    <button class="btn btn-outline-danger btn-sm btn-delete"
                        id="delete-btn-${data.id}" data-id="${data.id}">✕</button>
                </div>
            </div>
        </div>
    </div>
    `;
}
```

Ключевые детали:

- `id="card-${data.id}"` — уникальный `id` всего блока карточки. Используется в `onDeleteClick` для анимации исчезновения перед удалением.
- `loading="lazy"` — браузер загружает изображение только когда оно появляется в viewport (ленивая загрузка). Оптимизирует начальную загрузку страницы.
- `flex-grow-1` на тексте описания — описание растягивается, занимая всё доступное пространство, кнопки всегда остаются у нижнего края карточки.
- `id="detail-btn-${data.id}"` и `id="delete-btn-${data.id}"` — уникальные `id` для подписки на события.
- `data-id="${data.id}"` — атрибут, через который обработчик узнаёт, какую именно карточку нажали: `e.target.dataset.id`.
- Карточка обёрнута в `<div class="col">` — это ячейка Bootstrap-сетки (`row-cols-*`), что позволяет главной странице управлять количеством колонок через CSS.

### `addListeners(data, onDetailClick, onDeleteClick)`

```javascript
addListeners(data, onDetailClick, onDeleteClick) {
    document
        .getElementById(`detail-btn-${data.id}`)
        .addEventListener('click', onDetailClick);
    document
        .getElementById(`delete-btn-${data.id}`)
        .addEventListener('click', onDeleteClick);
}
```
Находит обе кнопки по их уникальным `id` и вешает переданные снаружи обработчики.

### `render(data, onDetailClick, onDeleteClick)`

```javascript
render(data, onDetailClick, onDeleteClick) {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    this.addListeners(data, onDetailClick, onDeleteClick);
}
```
Метод принимает три аргумента: данные карточки и два колбэка. Вставляет HTML, затем навешивает слушатели.

---

## components/item-detail/index.js

Компонент детальной карточки миссии. Используется только на странице подробнее.

### `getStatusBadgeClass(status)`

Идентичен методу из `ItemCardComponent` — возвращает CSS-класс для бейджа статуса.

### `getHTML(data)`

```javascript
getHTML(data) {
    return `
    <div class="card detail-card">
        <div class="row g-0">
            <div class="col-md-6">
                <img src="${data.src}" class="detail-card__img img-fluid" ... />
            </div>
            <div class="col-md-6">
                <div class="card-body detail-card__body d-flex flex-column gap-3 h-100 p-4">
                    <span class="badge badge-category">${data.category}</span>
                    <h2 class="card-title detail-card__title">${data.title}</h2>

                    <div class="d-flex gap-4 flex-wrap">
                        <div class="detail-card__meta-item">
                            <span class="detail-card__meta-label">Year</span>
                            <strong class="detail-card__meta-value">${data.year}</strong>
                        </div>
                        <div class="detail-card__meta-item">
                            <span class="detail-card__meta-label">Status</span>
                            <span class="badge ${statusClass}">${data.status}</span>
                        </div>
                        <div class="detail-card__meta-item">
                            <span class="detail-card__meta-label">Mission ID</span>
                            <strong class="detail-card__meta-value">#${String(data.id).padStart(3, '0')}</strong>
                        </div>
                    </div>

                    <hr class="border-secondary" />
                    <p class="card-text detail-card__text">${data.fullDescription}</p>
                </div>
            </div>
        </div>
    </div>
    `;
}
```

Ключевые детали:

- `row g-0` — Bootstrap-сетка без gutters (отступов): фотография вплотную к тексту.
- `col-md-6` — на экранах ≥ 768px изображение и текст занимают по половине ширины. На мобильных — складываются вертикально.
- `data.fullDescription` — здесь используется полное описание из mock-данных, а не краткое `description`, которое было на карточке.
- `String(data.id).padStart(3, '0')` — форматирует id с ведущими нулями: `1` → `#001`, `10` → `#010`.

### `render(data)`

```javascript
render(data) {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
}
```
Простейший рендер: только вставка HTML. Кнопок нет — обработчики не нужны.

---

## pages/main/index.js

Главная страница. Управляет состоянием всего списка: хранит данные, обрабатывает фильтрацию, добавление и удаление.

### Переменные состояния (`constructor`)

```javascript
constructor(parent) {
    this.parent = parent;
    this.masterData = [...items];   // оригинальный каталог (никогда не меняется)
    this.data = [...items];         // текущий список (меняется при добавлении/удалении)
    this.filteredData = [...items]; // отображаемые карточки (меняется при фильтрации)
    this.bsModal = null;            // ссылка на экземпляр Bootstrap Modal
}
```

Три массива данных:

| Переменная | Назначение |
|---|---|
| `masterData` | Неизменяемый полный каталог. Нужен для модального окна добавления — чтобы показывать список всех когда-либо доступных миссий |
| `data` | Текущий «живой» список. Карточки удаляются из него. При открытии `DetailPage` передаётся этот массив |
| `filteredData` | Подмножество `data` после применения фильтра. Именно из него рисуются карточки |

### DOM-акцессоры (геттеры)

```javascript
get cardsContainer() {
    return document.getElementById('cards-container');
}
```
Геттер — каждый раз при обращении к `this.cardsContainer` делает свежий запрос в DOM. Это важно: после `renderCards()` старый DOM-узел уничтожается (через `innerHTML = ''`) и создаётся новый с тем же `id`.

### `getCategories()`

```javascript
getCategories() {
    return [...new Set(this.data.map(item => item.category))];
}
```
- `this.data.map(item => item.category)` — массив всех категорий с дублями: `["Cargo", "Starship", "Cargo", "Crew", ...]`.
- `new Set(...)` — убирает дубликаты (Set хранит только уникальные значения).
- `[...]` — spread-оператор конвертирует Set обратно в массив.

Результат передаётся в `FilterComponent` для построения `<option>`.

### `getHTML()` — разметка страницы

```javascript
getHTML() {
    return `
    <div class="container-fluid page-wrapper">
        <div class="row mb-4">
            <div class="col">
                <p class="page-subtitle">Mission Archive</p>
                <h1 class="page-title">All Missions</h1>
            </div>
        </div>

        <div class="d-flex align-items-center gap-3 flex-wrap mb-4" id="toolbar">
            <!-- FilterComponent вставится сюда через insertAdjacentHTML('beforebegin') -->
            <button id="add-btn" class="btn btn-light btn-add ms-auto"
                data-bs-toggle="modal" data-bs-target="#addMissionModal">
                + Add Mission
            </button>
        </div>

        <div id="cards-container" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4"></div>
    </div>

    <!-- Bootstrap Modal -->
    <div class="modal fade" id="addMissionModal" ...>
        ...
    </div>
    `;
}
```

- `container-fluid` — Bootstrap-контейнер на всю ширину.
- `row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4` — адаптивная сетка: 1 колонка на мобильных, 2 на планшетах, 3 на десктопах, 4 на широких экранах.
- `ms-auto` — Bootstrap-утилита `margin-start: auto` — прижимает кнопку «+ Add Mission» вправо.
- `data-bs-toggle="modal" data-bs-target="#addMissionModal"` — Bootstrap-атрибуты, открывающие модальное окно при клике на кнопку без JS-кода.

### `renderCards()`

```javascript
renderCards() {
    this.cardsContainer.innerHTML = '';

    if (this.filteredData.length === 0) {
        this.cardsContainer.innerHTML = `<div class="col-12 text-center py-5">...</div>`;
        return;
    }

    this.filteredData.forEach(item => {
        const card = new ItemCardComponent(this.cardsContainer);
        card.render(item, this.onDetailClick.bind(this), this.onDeleteClick.bind(this));
    });
}
```
Очищает контейнер и перерисовывает карточки из `filteredData`. Вызывается при: первом рендере, смене фильтра, удалении карточки, добавлении карточки через модал. Если массив пуст — показывает заглушку «No missions found».

### `renderModalList()`

```javascript
renderModalList() {
    const list = document.getElementById('modal-list');
    list.innerHTML = '';
    const existingIds = new Set(this.data.map(i => i.id));
    const available = this.masterData.filter(i => !existingIds.has(i.id));
    ...
    available.forEach(item => {
        const el = document.createElement('div');
        el.innerHTML = `...`;
        el.querySelector('.modal-add-btn').addEventListener('click', () => this.onModalAdd(item.id));
        list.appendChild(el);
    });
}
```
Строит список доступных для добавления миссий в модальном окне. `existingIds` — Set уже добавленных `id`. `available` — только те миссии из `masterData`, которых нет в текущем `data`. При клике на кнопку `+` вызывается `onModalAdd`.

### `onModalAdd(id)`

```javascript
onModalAdd(id) {
    const mission = this.masterData.find(i => i.id === id);
    if (!mission || this.data.find(i => i.id === id)) return;

    const masterIndex = this.masterData.findIndex(i => i.id === id);
    let insertIndex = this.data.length;
    for (let i = 0; i < this.data.length; i++) {
        const di = this.masterData.findIndex(m => m.id === this.data[i].id);
        if (di > masterIndex) { insertIndex = i; break; }
    }
    this.data.splice(insertIndex, 0, mission);
    ...
    this.renderCards();
    this.renderModalList();
}
```
Добавляет миссию в `data`, сохраняя оригинальный порядок из `masterData` (а не просто `push` в конец). Логика: находит позицию в `data`, перед которой стоит элемент с бо́льшим индексом в `masterData`. `splice(insertIndex, 0, mission)` — вставляет без удаления.

### `onFilterChange(e)`

```javascript
onFilterChange(e) {
    const value = e.target.value;
    this.filteredData = value === 'all'
        ? [...this.data]
        : this.data.filter(item => item.category === value);
    this.renderCards();
}
```
`e.target.value` — выбранное значение `<select>`. Если `"all"` — копируем весь `data`. Иначе — фильтруем по категории. `renderCards()` перерисовывает.

### `onDetailClick(e)`

```javascript
onDetailClick(e) {
    const id = Number(e.target.dataset.id);
    import("../detail/index.js").then(({ DetailPage }) => {
        const page = new DetailPage(this.parent, id, this.data);
        page.render();
    });
}
```
Динамический `import()` — загружает модуль страницы только при первом клике (не при старте приложения). `this.data` передаётся в `DetailPage` — живой массив, отражающий актуальные удаления.

### `onDeleteClick(e)`

```javascript
onDeleteClick(e) {
    const id = Number(e.target.dataset.id);
    const cardWrapper = document.getElementById(`card-${id}`)?.closest('.col');
    if (cardWrapper) {
        cardWrapper.style.transition = 'opacity 0.25s, transform 0.25s';
        cardWrapper.style.opacity = '0';
        cardWrapper.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.data = this.data.filter(item => item.id !== id);
            this.filteredData = this.filteredData.filter(item => item.id !== id);
            this.renderCards();
        }, 250);
    } else { ... }
}
```
- `?.closest('.col')` — опциональная цепочка + поиск ближайшего предка с классом `.col` (Bootstrap-обёртка карточки).
- Сначала запускает CSS-анимацию исчезновения через inline-стиль (opacity → 0, scale → 0.95).
- `setTimeout(..., 250)` — ждёт окончания анимации (250ms), затем удаляет из массивов и перерисовывает.

### `render()`

```javascript
render() {
    this.parent.innerHTML = '';

    const header = new HeaderComponent(this.parent);
    header.render(() => {
        const page = new MainPage(this.parent);
        page.render();
    });

    this.parent.insertAdjacentHTML('beforeend', this.getHTML());

    // Bootstrap Modal
    const modalEl = document.getElementById('addMissionModal');
    this.bsModal = new bootstrap.Modal(modalEl);
    modalEl.addEventListener('show.bs.modal', () => this.renderModalList());

    // Filter
    const addBtn = document.getElementById('add-btn');
    const filter = new FilterComponent(null);
    addBtn.insertAdjacentHTML('beforebegin', filter.getHTML(this.getCategories()));
    document.getElementById('filter-select').addEventListener('change', this.onFilterChange.bind(this));

    this.renderCards();
}
```

Порядок действий:
1. Очищает `root` (`innerHTML = ''`).
2. Рендерит шапку, передавая анонимную функцию — при клике на «HOME» создаётся новая `MainPage` (полный сброс состояния).
3. Вставляет HTML-скелет страницы.
4. Инициализирует Bootstrap Modal: `new bootstrap.Modal(modalEl)` — создаёт экземпляр. Событие `show.bs.modal` срабатывает перед открытием модала — обновляет список доступных миссий.
5. Вставляет FilterComponent перед кнопкой Add через `insertAdjacentHTML('beforebegin', ...)`.
6. Рисует карточки.

---

## pages/detail/index.js

Страница подробнее. Отображает полную информацию об одной миссии.

### `constructor(parent, id, data)`

```javascript
constructor(parent, id, data) {
    this.parent = parent;
    this.id = Number(id);
    this.data = data;
}
```
Принимает три аргумента:
- `parent` — корневой элемент.
- `id` — идентификатор миссии (приводится к числу через `Number()`).
- `data` — живой массив карточек из `MainPage`. Передаётся по ссылке, поэтому удалённые карточки в нём уже не будут.

### `getData()`

```javascript
getData() {
    return this.data.find(item => item.id === this.id);
}
```
`Array.find()` — возвращает первый объект, у которого `id` совпадает с `this.id`. Если миссия была удалена — вернёт `undefined`.

### `onHomeClick()`

```javascript
onHomeClick() {
    const page = new MainPage(this.parent);
    page.render();
}
```
Создаёт и рендерит `MainPage` заново. Данные перечитываются из mock-файла — это сброс к начальному состоянию.

### `render()`

```javascript
render() {
    this.parent.innerHTML = '';

    const header = new HeaderComponent(this.parent);
    header.render(this.onHomeClick.bind(this));

    this.parent.insertAdjacentHTML('beforeend', this.getHTML());

    const data = this.getData();

    if (!data) {
        this.pageRoot.innerHTML = `<p>Mission not found.</p>`;
        return;
    }

    this.pageRoot.insertAdjacentHTML('beforeend', `
        <div class="mb-4">
            <p class="page-subtitle">Mission Details</p>
            <h1 class="page-title">${data.title}</h1>
        </div>
    `);

    const detail = new ItemDetailComponent(this.pageRoot);
    detail.render(data);
}
```
Проверка `if (!data)` — защита на случай, если пользователь открыл страницу подробнее, затем удалил миссию и нажал «Назад» в браузере. Заголовок страницы вставляется динамически — включает `data.title`, поэтому его нельзя положить в статичный `getHTML()`.

---

## css/main.css

Файл стилей состоит из двух частей: **CSS custom properties** + **космический фон** (идентично лабам 1 и 2) и **Bootstrap overrides** — переопределение Bootstrap-классов для SpaceX-эстетики.

---

### CSS-переменные (`:root`)

```css
:root {
    --bg-color: #000000;                    /* основной фон — чёрный */
    --text-gray: #8b939b;                   /* серый для подзаголовков и меток */
    --border: rgba(255,255,255,0.12);       /* тонкая полупрозрачная рамка */
    --card-bg: rgba(12, 14, 18, 0.88);     /* glassmorphism фон карточек */
    --header-bg: rgba(0, 0, 0, 0.75);      /* полупрозрачный фон шапки */
}
```

---

### Базовые стили `body`

```css
body {
    background-color: var(--bg-color);
    font-family: "Barlow", sans-serif;
    color: #fff;
    overflow-x: hidden;
    min-height: 100vh;
}
```
Шрифт Barlow, белый текст, скрытый горизонтальный скролл (для метеоров), минимальная высота 100vh.

---

### Космический фон

Блоки `.stars-container`, `.meteor-shower`, `.meteor`, `.background-layer`, `.vignette` и анимации `twinkle`, `shower-cycle`, `meteor-fall` — **идентичны лабам 1 и 2**. Подробное описание см. в документации к ЛР 1.

Единственное отличие: в этой лабе `.background-layer` имеет `z-index: -1` (а не -2), а `.vignette` использует `radial-gradient(ellipse ...)` вместо `circle` — более вытянутый эффект.

---

### Шапка

```css
.spacex-header {
    background: var(--header-bg) !important;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    height: 64px;
    z-index: 100;
}
```
`!important` — переопределяет Bootstrap-класс `.navbar`. `backdrop-filter: blur(20px)` — размытие фона под шапкой (glassmorphism). `sticky-top` из Bootstrap + `z-index: 100` — шапка поверх всего контента при скролле.

```css
.header-logo {
    font-size: 15px !important;
    font-weight: 700 !important;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}
.btn-home {
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}
```
`!important` нужен, чтобы переопределить Bootstrap-классы `.navbar-brand` и `.btn`.

---

### Страница и заголовки

```css
.page-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 48px 32px 80px;
}
.page-title {
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.1;
}
```
`clamp(28px, 5vw, 48px)` — адаптивный размер шрифта: минимум 28px, максимум 48px, в промежутке — 5% от ширины viewport.

---

### Сетка карточек

Сетка управляется Bootstrap-классами прямо в HTML (`row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4`), а в CSS переопределяется только визуал самих карточек.

```css
.mission-card.card {
    background: var(--card-bg) !important;
    border: 1px solid var(--border) !important;
    border-radius: 12px !important;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    animation: card-in 0.35s ease both;
}
@keyframes card-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
}
.mission-card.card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.25) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important;
}
```
`card-in` — анимация появления каждой карточки снизу. Запускается при добавлении элемента в DOM (в том числе при каждом `renderCards()`).

```css
.mission-card__img-wrap {
    position: relative;
    overflow: hidden;
    height: 200px;
}
.mission-card__img.card-img-top {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}
.mission-card.card:hover .mission-card__img {
    transform: scale(1.04);
}
.mission-card__year {
    position: absolute;
    bottom: 10px; right: 12px;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(6px);
    padding: 3px 8px;
    border-radius: 4px;
}
```
При hover карточка «приподнимается» (`translateY(-4px)`), а изображение внутри плавно увеличивается (`scale(1.04)`). Год отображается поверх изображения через `position: absolute`, не нарушая поток документа. `overflow: hidden` на обёртке изображения скрывает края при масштабировании.

---

### Цветные бейджи статуса

```css
.badge-success-custom {
    color: #4ade80 !important;
    background: rgba(74, 222, 128, 0.12) !important;
    border: 1px solid rgba(74, 222, 128, 0.3) !important;
}
.badge-partial-custom {
    color: #f59e0b !important;
    background: rgba(245, 158, 11, 0.12) !important;
    border: 1px solid rgba(245, 158, 11, 0.3) !important;
}
.badge-failure-custom {
    color: #f87171 !important;
    background: rgba(248, 113, 113, 0.12) !important;
    border: 1px solid rgba(248, 113, 113, 0.3) !important;
}
```
Три цветовых состояния: зелёный (успех), жёлтый (частичный), красный (неудача). Полупрозрачный фон + цветная рамка — тот же glassmorphism-подход. Соответствующий класс выбирается динамически через `getStatusBadgeClass()` в компонентах.

---

### Bootstrap Modal override

```css
.modal-custom {
    background: #0d0f13 !important;
    border: 1px solid var(--border) !important;
    border-radius: 16px !important;
    color: #fff;
}
.modal-mission-item:hover {
    background: rgba(255,255,255,0.06) !important;
    border-color: var(--border) !important;
}
.modal-mission-img {
    width: 64px; height: 46px;
    object-fit: cover;
    flex-shrink: 0;
}
```
Стандартное Bootstrap-модальное окно переопределено под тёмную SpaceX-тему. Каждый элемент списка в модале подсвечивается при наведении.

---

### Адаптивность

```css
@media (max-width: 768px) {
    .page-wrapper { padding: 28px 16px 60px; }
    .detail-card__img { min-height: 220px; }
}
```
На мобильных устройствах уменьшаются отступы страницы и высота изображения на детальной странице. Адаптивность карточечной сетки обеспечивается Bootstrap-классами (`row-cols-*`) без дополнительного CSS.

---

## Карта взаимосвязей

```
index.html
    │
    ├── подключает Bootstrap CSS/JS (node_modules)
    ├── подключает css/main.css
    └── <div id="root"> ← точка монтирования
            │
            └── main.js
                    │
                    └── MainPage(root).render()
                            │
                            ├── HeaderComponent(root)
                            │       └── кнопка HOME → new MainPage(root).render()
                            │
                            ├── <div page-wrapper>
                            │       ├── FilterComponent
                            │       │       └── <select> onChange → onFilterChange()
                            │       │                               → filteredData перефильтровать
                            │       │                               → renderCards()
                            │       │
                            │       ├── кнопка + Add Mission (Bootstrap Modal trigger)
                            │       │       └── show.bs.modal → renderModalList()
                            │       │               └── modal-add-btn onClick → onModalAdd(id)
                            │       │                                           → data.splice()
                            │       │                                           → renderCards()
                            │       │
                            │       └── #cards-container
                            │               └── ItemCardComponent × N
                            │                       ├── кнопка "Details →"
                            │                       │       data-id → onDetailClick(e)
                            │                       │       → dynamic import('../detail/index.js')
                            │                       │       → DetailPage(parent, id, data).render()
                            │                       │               │
                            │                       │               ├── HeaderComponent
                            │                       │               │       └── HOME → new MainPage
                            │                       │               └── ItemDetailComponent
                            │                       │                       └── data.find(id)
                            │                       │                           → getHTML(data)
                            │                       │
                            │                       └── кнопка "✕"
                            │                               data-id → onDeleteClick(e)
                            │                               → CSS-анимация 250ms
                            │                               → data.filter() + filteredData.filter()
                            │                               → renderCards()
                            │
                            └── mock/items.js
                                    └── export const items = [...] ← импортируется в MainPage и DetailPage
```
