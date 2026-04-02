# SpaceX Mission Control — Документация Лабораторная №2

> Подробная документация проекта с акцентом на **`main.js`** и его взаимосвязях с HTML и CSS.

---

## Содержание

1. [Архитектура взаимодействия JS ↔ HTML ↔ CSS](#архитектура)
2. [main.js — Полная документация](#mainjs)
    - [Блок 1: Ripple-эффект (Liquid Glass)](#блок-1-ripple-эффект)
    - [Блок 2: Исчезновение фона при скролле](#блок-2-исчезновение-фона-при-скролле)
    - [Блок 3: IntersectionObserver — появление видео-секции](#блок-3-intersectionobserver)
    - [Блок 4: Управление звуком](#блок-4-управление-звуком)
    - [Блок 5: Логика калькулятора](#блок-5-логика-калькулятора)
3. [HTML — взаимосвязи с JS](#html--взаимосвязи-с-js)
4. [CSS — взаимосвязи с JS](#css--взаимосвязи-с-js)
5. [Полная карта зависимостей](#полная-карта-зависимостей)

---

## Архитектура

JS не хранит состояние визуала самостоятельно — он **читает DOM**, **слушает события** и **манипулирует классами/стилями**, а CSS выполняет все визуальные переходы. Это классический подход: JS управляет логикой, CSS — анимациями.

```
Пользователь
    │
    ▼
[Событие: click / scroll / viewport]
    │
    ▼
main.js — обработчик
    │
    ├──► Изменяет inline style      →  мгновенный эффект (opacity при скролле)
    ├──► Добавляет/удаляет класс    →  CSS-анимация срабатывает автоматически
    └──► Создаёт/удаляет DOM-узел   →  появление ripple-span
```

---

## main.js — Полная документация

---

### Блок 1: Ripple-эффект

```javascript
const buttons = document.querySelectorAll(".key");
```

**Что делает:** Находит все кнопки калькулятора в DOM и возвращает `NodeList`.

**Связь с HTML:** Ищет все элементы с классом `.key` — это 18 кнопок внутри `<div class="keypad">` в `index.html`:

```html
<button class="key action-clear">CLR</button>
<button class="key action-op">/</button>
<!-- ... и так далее -->
```

---

```javascript
buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
```

**Что делает:** Вешает обработчик события `click` на каждую кнопку. Используется `function` (не стрелочная), чтобы `this` внутри указывал на саму кнопку.

Параметр `e` — объект события `MouseEvent`, содержащий координаты клика.

---

```javascript
const ripple = document.createElement("span");
ripple.classList.add("ripple-effect");
```

**Что делает:** Создаёт новый `<span>` и добавляет ему класс `ripple-effect`.

**Связь с CSS:** Класс `.ripple-effect` описан в `main.css`:

```css
.ripple-effect {
    position: absolute;
    border-radius: 50%; /* круглая форма */
    transform: translate(-50%, -50%) scale(0); /* начальный размер = 0 */
    background: rgba(255, 255, 255, 0.1);
    width: 200px;
    height: 200px;
    backdrop-filter: blur(4px) brightness(1.3);
    animation: liquid-ripple 0.6s linear; /* запускается сразу при добавлении класса */
}
```

Как только `<span>` получает этот класс — CSS автоматически запускает анимацию `liquid-ripple` без участия JS.

---

```javascript
const rect = this.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
```

**Что делает:**

- `getBoundingClientRect()` — возвращает координаты кнопки относительно viewport (расположение кнопки на экране).
- `e.clientX / e.clientY` — координаты клика мыши в viewport.
- `x, y` — координаты клика **относительно кнопки** (локальные). Это точка, из которой «вырастет» волна.

---

```javascript
ripple.style.left = x + "px";
ripple.style.top = y + "px";
```

**Что делает:** Позиционирует `<span>` точно в месте клика внутри кнопки. Работает в паре с CSS-свойством `transform: translate(-50%, -50%)` — которое сдвигает круг на половину своего размера, центрируя его относительно точки клика.

---

```javascript
this.appendChild(ripple);

setTimeout(() => {
    ripple.remove();
}, 600);
```

**Что делает:** Добавляет `<span>` внутрь кнопки → CSS-анимация запускается. Через 600ms (равно длительности `animation: liquid-ripple 0.6s`) элемент удаляется из DOM.

**Почему 600ms:** Именно столько длится анимация в CSS. Если удалить раньше — анимация оборвётся; позже — элементы будут накапливаться в DOM.

**Связь с HTML:** Кнопки имеют `position: relative; overflow: hidden` — без этого ripple выходил бы за границы кнопки.

---

### Блок 2: Исчезновение фона при скролле

```javascript
const stars = document.getElementById("stars");
const meteors = document.getElementById("meteors");
const marsBg = document.getElementById("mars-bg");
const scrollBtn = document.getElementById("scroll-down");
```

**Что делает:** Получает ссылки на фоновые элементы по `id`.

**Связь с HTML:** Эти `id` прописаны в `index.html`:

```html
<div class="stars-container" id="stars"></div>
<div class="meteor-shower" id="meteors">...</div>
<div class="background-layer" id="mars-bg">...</div>
<div class="scroll-indicator" id="scroll-down">...</div>
```

---

```javascript
window.addEventListener("scroll", () => {
    const scrollFraction = Math.min(window.scrollY / window.innerHeight, 1);
    const fadeOut = 1 - scrollFraction;
    stars.style.opacity = fadeOut;
    meteors.style.opacity = fadeOut;
    marsBg.style.opacity = fadeOut;
});
```

**Что делает:** Слушает событие `scroll` на всём окне. При каждом кадре прокрутки:

- `window.scrollY` — сколько пикселей прокручено вниз.
- `window.innerHeight` — высота видимой области (равна высоте первого экрана, т.к. он `100vh`).
- `scrollFraction` — дробь от 0 до 1: 0 = не прокручено, 1 = прокручено на весь экран. `Math.min(..., 1)` ограничивает сверху значением 1.
- `fadeOut = 1 - scrollFraction` — обратная величина: 1 в начале, 0 когда прокручено полностью.
- Три строки применяют это значение как `opacity` к фоновым элементам через inline-стиль.

**Связь с CSS:** В CSS у этих элементов прописан `transition: opacity 0.1s linear` — плавное изменение прозрачности при изменении значения. JS меняет значение, CSS плавно переходит.

**Итог:** При скролле вниз космический фон (звёзды, метеоры, Марс) постепенно растворяется, открывая тёмный фон второго экрана.

---

### Блок 3: IntersectionObserver

```javascript
const landingSection = document.getElementById("landing-zone");
const videoBlock = document.getElementById("rocket-video-container");
const landingText = document.getElementById("landing-text");
const muteBtn = document.getElementById("mute-btn");
```

**Связь с HTML:** Соответствующие элементы в `index.html`:

```html
<section class="landing-section" id="landing-zone">
    <div class="video-block" id="rocket-video-container">...</div>
    <div class="landing-content" id="landing-text">...</div>
    <button id="mute-btn" class="mute-btn">...</button>
</section>
```

---

```javascript
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                videoBlock.classList.add("visible");
                landingText.classList.add("visible");
                muteBtn.classList.add("visible");
            } else {
                videoBlock.classList.remove("visible");
                landingText.classList.remove("visible");
                muteBtn.classList.remove("visible");
            }
        });
    },
    { threshold: 0.4 },
);

observer.observe(landingSection);
```

**Что делает:** `IntersectionObserver` — браузерное API, которое отслеживает, когда элемент попадает в/выходит из viewport. Не требует `scroll`-событий, работает эффективно.

- `threshold: 0.4` — коллбэк вызывается когда 40% секции видно на экране.
- `entry.isIntersecting` — `true` если секция попала в viewport.
- При появлении — JS добавляет класс `visible` трём элементам.
- При исчезновении — убирает класс. Это позволяет анимации повторяться при повторном скролле.

**Связь с CSS:** Классы `visible` описаны в `main.css`:

```css
/* Исходное состояние */
.video-block {
    opacity: 0;
    transform: scale(1.1);
    transition:
        opacity 1.5s ease-out,
        transform 2s cubic-bezier(...);
}
/* После добавления JS-класса .visible */
.video-block.visible {
    opacity: 1;
    transform: scale(1);
}

.landing-content {
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s ease 0.6s; /* задержка 0.6s */
}
.landing-content.visible {
    opacity: 1;
    transform: translateY(0);
}

.mute-btn {
    opacity: 0;
    transform: translateY(20px);
}
.mute-btn.visible {
    opacity: 1;
    transform: translateY(0);
    transition:
        opacity 0.5s ease 1s,
        transform 0.5s ease 1s,
        ...; /* задержка 1s */
}
```

**Итоговая цепочка появления:**

```
40% секции в viewport
    │
    ▼ JS добавляет .visible
    │
    ├─ videoBlock:    задержки нет  → появляется первым (opacity + scale)
    ├─ landingText:   задержка 0.6s → появляется вторым
    └─ muteBtn:       задержка 1s   → появляется последним
```

---

### Блок 4: Управление звуком

```javascript
const video = document.getElementById("rocket-video");
const iconMuted = muteBtn.querySelector(".icon-muted");
const iconUnmuted = muteBtn.querySelector(".icon-unmuted");
```

**Связь с HTML:**

```html
<video id="rocket-video" autoplay loop muted playsinline>...</video>

<button id="mute-btn">
    <svg class="icon-muted" ...>   <!-- крестик на динамике, виден по умолчанию -->
    <svg class="icon-unmuted" ... style="display: none">  <!-- волны, скрыт -->
</button>
```

`muteBtn.querySelector()` ищет SVG только внутри кнопки — не по всему документу.

---

```javascript
muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;

    if (video.muted) {
        iconMuted.style.display = "block";
        iconUnmuted.style.display = "none";
    } else {
        iconMuted.style.display = "none";
        iconUnmuted.style.display = "block";
    }
});
```

**Что делает:**

- `video.muted = !video.muted` — переключает булево свойство видеоэлемента.
- Два условия меняют видимость SVG-иконок через inline-стиль `display`.

**Почему видео изначально `muted`:** Браузеры блокируют `autoplay` для видео со звуком. `muted` — единственный способ запустить автовоспроизведение без взаимодействия пользователя. Поэтому кнопка при загрузке показывает иконку «звук выключен».

---

### Блок 5: Логика калькулятора

#### Переменные состояния

```javascript
const display = document.querySelector(".display-value");

let displayValue = "0"; // строка, отображаемая на дисплее
let firstOperand = null; // первое число операции (число или null)
let operator = null; // текущий оператор: "+", "-", "*", "/", "%" или null
let waitingForNext = false; // true = оператор нажат, ждём ввода второго числа
```

**Связь с HTML:** `display` — ссылка на `<div class="display-value">0</div>` — элемент дисплея калькулятора.

Четыре переменные образуют **конечный автомат** калькулятора. Все функции читают и изменяют именно их.

---

#### `updateDisplay()`

```javascript
function updateDisplay() {
    display.textContent = waitingForNext ? operator : displayValue;
}
updateDisplay();
```

**Что делает:** Единственная точка записи в DOM. Если ждём второй операнд — показывает символ оператора (чтобы пользователь видел, что нажал). Иначе — текущее число.

`updateDisplay()` вызывается в конце каждого обработчика клика — это гарантирует синхронность DOM с состоянием.

---

#### Обработчик кликов на кнопки (диспетчер)

```javascript
buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("num")) inputDigit(btn.textContent.trim());
        else if (btn.classList.contains("action-op"))
            chooseOperator(btn.textContent.trim());
        else if (btn.classList.contains("action-clear")) clearAll();
        else if (btn.classList.contains("action-submit")) compute();

        updateDisplay();
    });
});
```

**Что делает:** Читает CSS-класс кнопки и маршрутизирует действие в нужную функцию. `btn.textContent.trim()` — извлекает текст кнопки (цифру или символ оператора), обрезая пробелы.

**Связь с HTML:** Маршрутизация построена на классах из HTML:

| Класс в HTML     | Функция в JS       | Примеры кнопок               |
| ---------------- | ------------------ | ---------------------------- |
| `.num`           | `inputDigit()`     | `0`–`9`, `.`                 |
| `.action-op`     | `chooseOperator()` | `+`, `-`, `*`, `/`, `%`, `.` |
| `.action-clear`  | `clearAll()`       | `CLR`                        |
| `.action-submit` | `compute()`        | `=`                          |

> Замечание: кнопка `.` имеет класс `action-op` в HTML, но обрабатывается в `inputDigit()` как особый случай — это намеренное архитектурное решение, так как точка — часть числа, а не оператор.

---

#### `inputDigit(digit)` — ввод цифры или точки

```javascript
function inputDigit(digit) {
    if (waitingForNext) {
        displayValue = digit === "." ? "0." : digit;
        waitingForNext = false;
        return;
    }

    if (digit === ".") {
        if (!displayValue.includes(".")) displayValue += ".";
        return;
    }

    displayValue = displayValue === "0" ? digit : displayValue + digit;
}
```

**Разбор каждой ветки:**

```
Если waitingForNext = true (оператор уже нажат):
    └─ Начинаем новое число.
       Если нажата точка → "0." (чтобы не начинать с просто ".")
       Иначе → цифра как первый символ.
       Сбрасываем waitingForNext = false.

Если нажата точка (и не ждём нового числа):
    └─ Добавляем "." только если её ещё нет (защита от "3.1.4")

Иначе (обычная цифра):
    └─ Если на дисплее "0" → заменяем (не "07", а "7")
       Иначе → дописываем к строке
```

---

#### `chooseOperator(op)` — нажатие оператора

```javascript
function chooseOperator(op) {
    const current = parseFloat(displayValue);

    if (firstOperand !== null && !waitingForNext) {
        const result = calculate(firstOperand, current, operator);
        displayValue = String(round(result));
        firstOperand = round(result);
    } else {
        firstOperand = current;
    }

    operator = op;
    waitingForNext = true;
}
```

**Что делает:**

- `parseFloat(displayValue)` — конвертирует строку дисплея в число.
- Если уже есть `firstOperand` и введено второе число (`!waitingForNext`) — это **цепочка операций** (например: `2 + 3 *`). Сразу считаем `2 + 3 = 5`, сохраняем как новый `firstOperand`.
- Если нет накопленного результата — просто сохраняем текущее число как `firstOperand`.
- Запоминаем новый оператор, ставим флаг `waitingForNext = true`.

**Пример цепочки:**

```
Нажали: 2 → firstOperand=null, display="2"
Нажали: + → firstOperand=2, operator="+", waitingForNext=true
Нажали: 3 → waitingForNext сброшен, display="3"
Нажали: * → calculate(2, 3, "+") = 5, firstOperand=5, operator="*"
Нажали: 4 → display="4"
Нажали: = → calculate(5, 4, "*") = 20
```

---

#### `compute()` — вычисление результата

```javascript
function compute() {
    if (operator === null || firstOperand === null || waitingForNext) return;

    const result = calculate(firstOperand, parseFloat(displayValue), operator);
    displayValue = String(round(result));
    firstOperand = null;
    operator = null;
    waitingForNext = false;
}
```

**Что делает:**

- Защитная проверка: если нет оператора, первого числа или ввод второго числа не начат — ничего не делаем.
- Вычисляет результат, записывает в `displayValue`.
- Сбрасывает все переменные состояния — калькулятор готов к новому вводу.

---

#### `clearAll()` — сброс

```javascript
function clearAll() {
    displayValue = "0";
    firstOperand = null;
    operator = null;
    waitingForNext = false;
}
```

**Что делает:** Возвращает все переменные в начальное состояние. `displayValue = "0"` — дисплей вернётся к нулю после `updateDisplay()`.

---

#### `calculate(a, b, op)` — арифметика

```javascript
function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? 0 : a / b;
        case "%":
            return a % b;
        default:
            return b;
    }
}
```

**Что делает:** Чистая функция — принимает два числа и оператор, возвращает результат. Не обращается ни к DOM, ни к переменным состояния.

- `"/"` — защита от деления на ноль: возвращает 0.
- `default` — возвращает `b` (на случай неизвестного оператора).

---

#### `round(n)` — округление

```javascript
function round(n) {
    return parseFloat(n.toPrecision(10));
}
```

**Что делает:** Исправляет погрешность числел с плавающей точкой в JavaScript.

**Проблема:** В JS `0.1 + 0.2 = 0.30000000000000004` из-за двоичного представления чисел.

**Решение:** `toPrecision(10)` оставляет 10 значимых цифр — этого достаточно для калькулятора. `parseFloat()` убирает незначащие нули (`"1.0000000000"` → `1`).

---

## HTML — взаимосвязи с JS

### `index.html` — все точки подключения к JS

| Атрибут / Класс в HTML        | Используется в JS                          | Назначение                         |
| ----------------------------- | ------------------------------------------ | ---------------------------------- |
| `id="stars"`                  | `getElementById("stars")`                  | Изменение opacity при скролле      |
| `id="meteors"`                | `getElementById("meteors")`                | Изменение opacity при скролле      |
| `id="mars-bg"`                | `getElementById("mars-bg")`                | Изменение opacity при скролле      |
| `id="scroll-down"`            | `getElementById("scroll-down")`            | Получение ссылки (резерв)          |
| `id="landing-zone"`           | `getElementById("landing-zone")`           | Цель для IntersectionObserver      |
| `id="rocket-video-container"` | `getElementById("rocket-video-container")` | Добавление класса `visible`        |
| `id="landing-text"`           | `getElementById("landing-text")`           | Добавление класса `visible`        |
| `id="mute-btn"`               | `getElementById("mute-btn")`               | Слушатель клика, класс `visible`   |
| `id="rocket-video"`           | `getElementById("rocket-video")`           | Переключение `.muted`              |
| `.key`                        | `querySelectorAll(".key")`                 | Ripple + обработка нажатий         |
| `.num`                        | `classList.contains("num")`                | Маршрутизация к `inputDigit()`     |
| `.action-op`                  | `classList.contains("action-op")`          | Маршрутизация к `chooseOperator()` |
| `.action-clear`               | `classList.contains("action-clear")`       | Маршрутизация к `clearAll()`       |
| `.action-submit`              | `classList.contains("action-submit")`      | Маршрутизация к `compute()`        |
| `.display-value`              | `querySelector(".display-value")`          | Вывод результата                   |
| `.icon-muted`                 | `querySelector(".icon-muted")`             | Переключение иконки звука          |
| `.icon-unmuted`               | `querySelector(".icon-unmuted")`           | Переключение иконки звука          |

### Порядок подключения скрипта

```html
<!-- В конце <body>, после всего HTML -->
<script src="js/main.js"></script>
```

Скрипт подключён **в конце `<body>`**. Это критически важно: когда JS исполняется, весь DOM уже построен, поэтому `querySelector` и `getElementById` находят элементы без ошибок. Если подключить в `<head>` — элементы ещё не существуют в момент исполнения.

---

## CSS — взаимосвязи с JS

JS добавляет и удаляет классы, а CSS-правила для этих классов описывают визуальное поведение.

### Классы, добавляемые JS динамически

| Класс            | Добавляется к             | Когда                   | Что делает в CSS                                        |
| ---------------- | ------------------------- | ----------------------- | ------------------------------------------------------- |
| `.ripple-effect` | `<span>` (созданный JS)   | При клике на кнопку     | Запускает анимацию `liquid-ripple`, blur-эффект         |
| `.visible`       | `#rocket-video-container` | Секция в viewport (40%) | `opacity: 1`, `transform: scale(1)`                     |
| `.visible`       | `#landing-text`           | Секция в viewport (40%) | `opacity: 1`, `transform: translateY(0)`, задержка 0.6s |
| `.visible`       | `#mute-btn`               | Секция в viewport (40%) | `opacity: 1`, `transform: translateY(0)`, задержка 1s   |

### Inline-стили, устанавливаемые JS напрямую

| Элемент         | Свойство  | Когда               | Диапазон               |
| --------------- | --------- | ------------------- | ---------------------- |
| `#stars`        | `opacity` | При каждом `scroll` | от `1` до `0`          |
| `#meteors`      | `opacity` | При каждом `scroll` | от `1` до `0`          |
| `#mars-bg`      | `opacity` | При каждом `scroll` | от `1` до `0`          |
| `.icon-muted`   | `display` | При клике mute-btn  | `"block"` или `"none"` |
| `.icon-unmuted` | `display` | При клике mute-btn  | `"none"` или `"block"` |

### Почему CSS обрабатывает `transition`, а не JS

В CSS у фоновых элементов есть:

```css
.stars-container {
    transition: opacity 0.1s linear;
}
.meteor-shower {
    transition: opacity 0.1s linear;
}
.background-layer {
    transition: opacity 0.1s linear;
}
```

JS меняет значение `opacity` при каждом событии `scroll`. Браузер вызывает `scroll` очень часто — до 60 раз в секунду. CSS `transition` сглаживает резкие скачки между соседними значениями, делая переход плавным без лишней логики в JS.

---

## Полная карта зависимостей

```
main.js
│
├── [Блок 1: Ripple]
│   ├── HTML: кнопки .key (querySelectorAll)
│   ├── HTML: создаёт <span> и вставляет в кнопку
│   └── CSS:  класс .ripple-effect → анимация liquid-ripple
│
├── [Блок 2: Скролл]
│   ├── HTML: id="stars", id="meteors", id="mars-bg"
│   ├── JS:   window.scrollY / window.innerHeight → вычисление fadeOut
│   └── CSS:  transition: opacity → плавный fade при изменении JS-значения
│
├── [Блок 3: IntersectionObserver]
│   ├── HTML: id="landing-zone" — наблюдаемый элемент
│   ├── HTML: id="rocket-video-container", id="landing-text", id="mute-btn"
│   └── CSS:  .visible → CSS-переходы с разными задержками (0s / 0.6s / 1s)
│
├── [Блок 4: Звук]
│   ├── HTML: id="rocket-video" → video.muted
│   ├── HTML: .icon-muted, .icon-unmuted → display toggle
│   └── (нет CSS-зависимостей, только inline style)
│
└── [Блок 5: Калькулятор]
    ├── HTML: .key → forEach + addEventListener
    ├── HTML: .num, .action-op, .action-clear, .action-submit → маршрутизация
    ├── HTML: .display-value → textContent = результат
    └── CSS:  (нет, только чтение textContent кнопки)
```

---

## Поток данных калькулятора

```
Клик на кнопку
      │
      ▼
Определение типа кнопки (по CSS-классу)
      │
      ├── .num       → inputDigit(digit)
      │                    └─ изменяет displayValue (строка)
      │
      ├── .action-op → chooseOperator(op)
      │                    ├─ вычисляет цепочку (если нужно)
      │                    ├─ сохраняет firstOperand
      │                    └─ ставит waitingForNext = true
      │
      ├── .action-clear → clearAll()
      │                    └─ сбрасывает все переменные
      │
      └── .action-submit → compute()
                           ├─ вычисляет результат
                           └─ сбрасывает состояние
                                     │
                                     ▼
                              updateDisplay()
                                     │
                                     ▼
                         display.textContent = значение
                         (единственное обращение к DOM)
```
