# SpaceX Mission Control — Project Documentation

> Подробная документация всех файлов проекта: `index.html`, `about.html`, `main.css`, `about.css`

---

## Содержание

1. [index.html](#indexhtml)
2. [about.html](#abouthtml)
3. [main.css](#maincss)
4. [about.css](#aboutcss)

---

## index.html

Главная страница сайта. Содержит два полноэкранных «экрана»: калькулятор (Mission Control) и секцию с видео посадки ракеты (Starship).

---

### `<head>` — Метаданные и подключение ресурсов

```html
<meta charset="UTF-8" />
```

Устанавливает кодировку UTF-8, обеспечивая корректное отображение кириллицы и спецсимволов.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Делает страницу адаптивной (responsive): на мобильных устройствах ширина viewport совпадает с шириной экрана, масштаб по умолчанию — 1.

```html
<title>SpaceX | Mission Control</title>
```

Заголовок вкладки браузера.

```html
<link rel="stylesheet" href="css/main.css" />
```

Подключает основной файл стилей `main.css`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

Предварительное DNS-соединение с серверами Google Fonts — ускоряет загрузку шрифта.

```html
<link
    href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&display=swap"
    rel="stylesheet"
/>
```

Загружает шрифт **Barlow** с начертаниями 300, 400, 600, 700. `display=swap` — пока шрифт грузится, используется системный (без мигания FOIT).

---

### Фоновые эффекты

#### Звёздное небо

```html
<div class="stars-container" id="stars"></div>
```

Контейнер для анимированного звёздного фона. Реализован через CSS-псевдоэлементы `::before` и `::after` с `radial-gradient`. Используется `position: fixed`, чтобы фон оставался на месте при скролле.

#### Метеоритный дождь

```html
<div class="meteor-shower" id="meteors">
    <div class="meteor"></div>
    <!-- × 7 -->
</div>
```

Обёртка `.meteor-shower` содержит 7 элементов `.meteor`. Каждый метеор — тонкая вертикальная линия с градиентом, анимированная через `@keyframes meteor-fall`. Сама обёртка повёрнута на `-25deg` для диагонального падения. Отображение циклически чередуется через `@keyframes shower-cycle`.

#### Фон с планетой Марс

```html
<div class="background-layer" id="mars-bg">
    <div class="mars-planet"></div>
    <div class="vignette"></div>
</div>
```

- `.background-layer` — фиксированный слой-обёртка на весь экран.
- `.mars-planet` — фоновое изображение Марса (`mars.jpg`), занимает 100% блока.
- `.vignette` — полупрозрачное радиальное затемнение по краям экрана (эффект виньетки) для создания ощущения глубины космоса.

---

### `<header>` — Шапка сайта

```html
<header class="spacex-header"></header>
```

Фиксированная шапка (`position: fixed`), всегда видна поверх контента. `z-index: 100`.

```html
<div class="logo">
    <a href="index.html">
        <img src="image/SpaceX_Logo_Black.png" alt="SPACEX" />
    </a>
</div>
```

Логотип SpaceX — изображение, обёрнутое в ссылку на главную страницу. `alt="SPACEX"` — текст для скринридеров и при ошибке загрузки.

```html
<nav class="nav-menu">
    <a href="#">FALCON 9</a>
    <a href="#">FALCON HEAVY</a>
    <a href="#">DRAGON</a>
    <a href="#">STARSHIP</a>
    <a href="about.html">ABOUT ME</a>
</nav>
```

Навигационное меню. Четыре первые ссылки — заглушки (`href="#"`). Последняя ведёт на страницу `about.html`. При наведении появляется анимированное подчёркивание (через CSS `::after` + `transform: scaleX`).

```html
<div class="burger-menu">
    <span></span>
    <span></span>
    <span></span>
</div>
```

Бургер-иконка для мобильных устройств (три горизонтальные полоски). По умолчанию скрыта (`display: none`), появляется при ширине экрана ≤ 768px.

---

### `<main class="mission-control">` — Первый экран: Калькулятор

```html
<main class="mission-control"></main>
```

Семантически основной контент страницы. Занимает 100vh, центрирует содержимое через Flexbox.

```html
<div class="content-wrapper"></div>
```

Внутренний контейнер с `text-align: center` и `margin-top: 60px` (отступ от шапки).

```html
<h2 class="section-subtitle">MISSION CONTROL</h2>
<h1 class="section-title">TRAJECTORY CALCULATION</h1>
```

Заголовки блока. `.section-subtitle` — вторичный заголовок серого цвета с letter-spacing. `.section-title` — основной крупный заголовок, анимируется через `fadeUp` с задержкой `0.2s`.

---

#### Интерфейс калькулятора

```html
<div class="calculator-interface"></div>
```

Контейнер калькулятора. Стилизован как терминал/дисплей: `backdrop-filter: blur(15px)`, тёмный полупрозрачный фон, тонкая рамка. Появляется с анимацией `fadeUp` (задержка 0.4s).

```html
<div class="display-panel">
    <span class="display-label">INPUT STREAM</span>
    <div class="display-value">0</div>
</div>
```

Дисплей калькулятора:

- `.display-label` — маленькая подпись-метка `INPUT STREAM` серым шрифтом.
- `.display-value` — поле вывода результата/введённого числа. Изначально показывает `0`. Обновляется через JavaScript.

```html
<div class="keypad"></div>
```

Клавиатура калькулятора на основе CSS Grid (`grid-template-columns: repeat(4, 1fr)`). Промежутки между кнопками — `gap: 1px` на фоне `rgba(255,255,255,0.1)`, создавая эффект тонких линий-разделителей.

**Кнопки клавиатуры:**

```html
<button class="key action-clear">CLR</button>
```

Кнопка очистки (Clear). Сбрасывает дисплей в `0`.

```html
<button class="key action-op">/</button>
<button class="key action-op">*</button>
<button class="key action-op">-</button>
<button class="key action-op">+</button>
<button class="key action-row2 action-op">%</button>
<button class="key action-row2 action-op">.</button>
```

Кнопки операторов: деление, умножение, вычитание, сложение, процент, десятичная точка. Класс `action-op` выделяет их стилистически.

```html
<button class="key num">7</button>
<!-- ...аналогично 8, 9, 4, 5, 6, 1, 2, 3 -->
```

Цифровые кнопки 1–9.

```html
<button class="key num zero">0</button>
```

Кнопка нуля. Класс `zero` задаёт `grid-column: span 2` — занимает две колонки сетки.

```html
<button class="key action-submit">=</button>
```

Кнопка вычисления результата. Класс `action-submit` делает её слегка светлее остальных.

---

#### Индикатор прокрутки

```html
<div class="scroll-indicator" id="scroll-down">
    <div class="chevron"></div>
    <div class="chevron"></div>
    <div class="chevron"></div>
</div>
```

Три анимированные стрелки-шеврона, указывающие вниз. Абсолютно позиционированы у нижнего края экрана (`bottom: 30px`). Анимация `scroll` создаёт эффект «пульсирующего» движения вниз. Подсказывает пользователю прокрутить страницу. Привязан JS-обработчик (по `id="scroll-down"`) для плавного скролла к следующей секции.

---

### `<section class="landing-section">` — Второй экран: Видео посадки

```html
<section class="landing-section" id="landing-zone"></section>
```

Второй полноэкранный блок (`height: 100vh`). Показывает видео посадки ракеты Starship. Появляется при скролле (через IntersectionObserver в JS).

#### Блок с видео

```html
<div class="video-block" id="rocket-video-container">
    <video id="rocket-video" autoplay loop muted playsinline>
        <source src="video/rocket-landing.mp4" type="video/mp4" />
    </video>
    <div class="video-overlay"></div>
</div>
```

- `.video-block` — абсолютно позиционированный контейнер на весь экран. Изначально прозрачный (`opacity: 0`) и слегка увеличен (`transform: scale(1.1)`). При добавлении класса `visible` через JS — плавно проявляется и «уменьшается» до нормального масштаба.
- `<video>` — видео на весь экран (`object-fit: cover`). Атрибуты:
    - `autoplay` — автозапуск.
    - `loop` — зацикливание.
    - `muted` — обязательно для autoplay в браузерах.
    - `playsinline` — воспроизведение inline на iOS (не открывает fullscreen).
- `.video-overlay` — полупрозрачный чёрный слой поверх видео (`rgba(0,0,0,0.4)`), улучшающий читаемость белого текста.

#### Текст поверх видео

```html
<div class="landing-content" id="landing-text">
    <h2 class="section-subtitle">Fifth Flight Test</h2>
    <h1 class="section-title">STARSHIP</h1>
</div>
```

Контент поверх видео. Изначально прозрачен и смещён вниз. При скролле до секции (через JS) получает класс `visible` → плавно появляется и встаёт на место.

#### Кнопка управления звуком

```html
<button id="mute-btn" class="mute-btn" aria-label="Toggle Sound"></button>
```

Круглая кнопка в правом нижнем углу. `aria-label` — подсказка для скринридеров.

```html
<svg class="icon-muted" ...>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
</svg>
```

SVG-иконка «звук выключен» (динамик с крестиком). Отображается по умолчанию.

```html
<svg class="icon-unmuted" ... style="display: none">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
    ></path>
</svg>
```

SVG-иконка «звук включён» (динамик с волнами). Скрыта по умолчанию (`display: none`). JS-скрипт переключает видимость иконок и состояние `video.muted` при клике.

---

### Подключение скриптов

```html
<script src="js/main.js"></script>
```

Подключён в конце `<body>` — гарантирует, что DOM полностью загружен до исполнения скрипта. Содержит логику: калькулятор, scroll-анимации, ripple-эффект, управление звуком.

---

## about.html

Страница «Обо мне» (Alex Galenko). Структура аналогична `index.html` (шапка, фон), но вместо калькулятора — информационная карточка.

---

### `<head>`

Идентична шапке `index.html`, за исключением подключения стилей:

```html
<link rel="stylesheet" href="css/about.css" />
```

Подключает `about.css` — стили, специфичные для страницы About.

---

### Фоновые эффекты и шапка

Полностью идентичны `index.html`:

- `.stars-container` — звёздный фон.
- `.meteor-shower` + `.meteor` × 7 — метеоритный дождь.
- `.background-layer` → `.mars-planet` + `.vignette` — планета и виньетка.
- `<header class="spacex-header">` — логотип, навигация, бургер.

> Примечание: на этой странице `.mars-planet` не используется (нет `mars.jpg` в CSS `about.css`), поэтому фон — чисто звёздный.

---

### `<main class="about-main">` — Карточка "Обо мне"

```html
<main class="about-main"></main>
```

Полноэкранный блок, центрирует содержимое через Flexbox.

```html
<div class="about-panel"></div>
```

Стеклянная карточка (`backdrop-filter: blur(15px)`, полупрозрачный чёрный фон, тонкая рамка). Ширина 420px, максимум 90% (адаптивность). Анимируется через `fadeUp` при загрузке.

#### Шапка карточки

```html
<div class="about-header">
    <span class="about-label">ABOUT ME</span>
    <span class="about-sub">Alex Galenko</span>
</div>
```

- `.about-header` — блок с нижней разделительной линией (`border-bottom`).
- `.about-label` — маленькая подпись `ABOUT ME` серым цветом с широким letter-spacing.
- `.about-sub` — имя автора, крупнее, белый текст.

#### Содержимое карточки

```html
<div class="about-content">
    <p>This is Alex Galenko, this website founder and CEO.</p>
    <p>Space, science and nvim are my passion...</p>
    <p>End - is the beginning.</p>
</div>
```

Три параграфа с описанием автора. Стилизованы через `.about-content p`: размер 14px, line-height 1.6, серый цвет `#8b939b`, отступ между параграфами 10px (последний без отступа).

---

## main.css

Главный файл стилей для `index.html`. Описывает: CSS-переменные, reset, кнопки калькулятора, фоновые эффекты, шапку, секцию Mission Control, секцию Landing, кнопку звука, адаптивность.

---

### CSS-переменные (`:root`)

```css
:root {
    --bg-color: #000000; /* Основной цвет фона — чёрный */
    --text-white: #ffffff; /* Белый текст */
    --text-gray: #8b939b; /* Серый текст для подзаголовков/меток */
}
```

Глобальные CSS custom properties. Используются во всём проекте для единообразия цветовой схемы.

---

### Reset (`* { ... }`)

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

Обнуляет дефолтные отступы браузера для всех элементов. `box-sizing: border-box` — padding и border включены в ширину элемента.

---

### `body`

```css
body {
    background-color: var(--bg-color);
    font-family: "Barlow", sans-serif;
    color: var(--text-white);
    overflow-x: hidden;
}
```

Чёрный фон, шрифт Barlow, белый текст по умолчанию. `overflow-x: hidden` — скрывает горизонтальный скролл (нужно для анимаций метеоров, выходящих за границы).

---

### Кнопки калькулятора — Liquid Glass эффект

#### `.key` — базовые стили кнопки

```css
.key {
    background: rgba(0, 0, 0, 0.85);
    border: none;
    color: var(--text-white);
    padding: 25px 0;
    font-family: "Barlow", sans-serif;
    font-size: 18px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
}
```

Тёмный полупрозрачный фон. `overflow: hidden` + `position: relative` — нужны для ripple-эффекта. `transition: all 0.2s` — плавные изменения при hover/active.

#### `.ripple-effect` — Ripple (волна) при нажатии

```css
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: rgba(255, 255, 255, 0.1);
    width: 200px;
    height: 200px;
    pointer-events: none;
    backdrop-filter: blur(4px) brightness(1.3);
    animation: liquid-ripple 0.6s linear;
}
```

Создаётся через JS при клике. Круговой элемент, расширяющийся от точки касания. `backdrop-filter: blur + brightness` — эффект «жидкого стекла». `pointer-events: none` — не мешает кликам.

```css
@keyframes liquid-ripple {
    to {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}
```

Анимация: волна расширяется и исчезает за 0.6s.

#### `.key:hover` и `.key:active`

```css
.key:hover {
    background: rgba(40, 40, 40, 0.95);
    box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.05);
}
.key:active {
    background: #000;
}
```

Hover: слегка светлее + внутренняя тень. Active (нажатие): чисто чёрный.

#### Специальные кнопки

```css
.key.zero {
    grid-column: span 2;
}
```

Кнопка `0` занимает 2 колонки CSS Grid.

```css
.key.action-submit {
    background: rgba(255, 255, 255, 0.1);
    font-weight: 600;
}
```

Кнопка `=` — светлее остальных, жирнее шрифт.

---

### Фоновые эффекты

#### `.stars-container` — звёздный фон

```css
.stars-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: -2;
    transition: opacity 0.1s linear;
}
```

Фиксированный чёрный фон на весь экран, под всем контентом (`z-index: -2`). `transition` — для плавного изменения прозрачности через JS.

```css
.stars-container::after,
.stars-container::before {
    content: "";
    position: absolute;
    /* ... */
    background-image: radial-gradient(1px 1px at X% Y%, #fff, transparent), ...;
    background-size: 550px 550px;
    opacity: 0.8;
}
```

Два псевдоэлемента с `radial-gradient` — имитируют звёзды разного размера (1px и 2px). Повторяются тайлингом через `background-size`.

```css
.stars-container::after {
    background-size: 350px 350px;
    transform: rotate(45deg);
    animation: twinkle 4s infinite ease-in-out;
}
.stars-container::before {
    background-size: 450px 450px;
    transform: rotate(-15deg);
    animation: twinkle 6s infinite ease-in-out reverse;
    opacity: 0.6;
}
```

Слои повёрнуты на разные углы — создают более хаотичное расположение звёзд. Разные скорости анимации `twinkle` создают мерцание.

```css
@keyframes twinkle {
    0%,
    100% {
        opacity: 0.4;
    }
    50% {
        opacity: 1;
    }
}
```

Анимация мерцания: плавное изменение прозрачности от 0.4 до 1.

---

#### `.meteor-shower` — метеоритный дождь

```css
.meteor-shower {
    position: fixed;
    /* ... */
    transform: rotate(-25deg);
    opacity: 0;
    animation: shower-cycle 25s infinite ease-in-out;
}
```

Контейнер повёрнут на -25° для диагонального направления падения. `opacity: 0` — изначально невидим. Анимация `shower-cycle` циклически показывает и скрывает дождь.

```css
@keyframes shower-cycle {
    0%,
    40% {
        opacity: 0;
    }
    50%,
    70% {
        opacity: 1;
    }
    80%,
    100% {
        opacity: 0;
    }
}
```

Дождь невидим 0–40% цикла, появляется на 50–70%, исчезает к 80–100%.

#### `.meteor` — отдельный метеор

```css
.meteor {
    position: absolute;
    top: -150px;
    width: 1px;
    height: 150px;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1)
    );
    opacity: 0;
    filter: drop-shadow(0 0 6px white);
    animation: meteor-fall 4s linear infinite;
}
```

Тонкая вертикальная полоса с градиентом (от прозрачного вверху к белому снизу — имитирует хвост). Свечение через `drop-shadow`. Стартовая позиция `-150px` (за экраном сверху).

```css
.meteor:nth-child(1) {
    left: 10%;
    animation-duration: 3s;
    animation-delay: 0s;
}
/* ... аналогично для 2-7 */
```

Каждый метеор имеет уникальное горизонтальное положение и параметры анимации для случайности.

```css
@keyframes meteor-fall {
    0% {
        transform: translateY(-150px);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    80% {
        opacity: 0;
    }
    100% {
        transform: translateY(150vh);
        opacity: 0;
    }
}
```

Метеор появляется (opacity 0→1 на 10%), летит вниз, исчезает к 80%, достигает нижнего края экрана.

---

#### `.background-layer`, `.mars-planet`, `.vignette`

```css
.background-layer {
    position: fixed;
    /* ... */
    z-index: -2;
    transition: opacity 0.1s linear;
}
```

Фиксированный фоновый слой.

```css
.mars-planet {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: url("mars.jpg") no-repeat center center;
    background-size: cover;
}
```

Изображение Марса — центрировано абсолютно, покрывает весь контейнер (`background-size: cover`).

```css
.vignette {
    position: absolute;
    /* ... */
    background: radial-gradient(circle, transparent 40%, #000000 95%);
    pointer-events: none;
}
```

Радиальный градиент: центр прозрачный, края чёрные. Создаёт «затемнение по краям» для атмосферности. `pointer-events: none` — не перехватывает клики.

---

### Шапка `.spacex-header`

```css
.spacex-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 40px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
}
```

Фиксированная шапка на весь экран. Flexbox: лого слева, навигация справа, выровнены по центру вертикально. `z-index: 100` — поверх всего контента.

```css
.logo img {
    height: 24px;
    width: auto;
    display: block;
}
```

Логотип фиксированной высоты 24px, ширина пропорциональна. `display: block` убирает нижний gap от inline-элемента.

```css
.nav-menu {
    display: flex;
    gap: 30px;
}
.nav-menu a {
    color: var(--text-white);
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    position: relative;
}
```

Навигационные ссылки: горизонтальный flex, верхний регистр, без подчёркивания, белые.

```css
.nav-menu a::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 1px;
    background: white;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
}
.nav-menu a:hover::after {
    transform: scaleX(1);
    transform-origin: left;
}
```

Анимированное подчёркивание при hover: линия «выезжает» слева направо (при hover — `transform-origin: left`, изначально `scaleX(0)` с `transform-origin: right` для обратного скрытия).

```css
.burger-menu {
    display: none;
    width: 20px;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
}
.burger-menu span {
    width: 100%;
    height: 2px;
    background: white;
}
```

Бургер-меню: три белые полоски. Скрыто на десктопе, показывается на мобильных.

---

### `.mission-control` — Первый экран

```css
.mission-control {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
}
```

Полноэкранная секция. Flexbox-центрирование по обеим осям. `position: relative` — для абсолютного позиционирования дочернего `.scroll-indicator`.

```css
.content-wrapper {
    text-align: center;
    margin-top: 60px;
}
```

Отступ сверху компенсирует высоту фиксированной шапки.

```css
.section-subtitle {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 2px;
    color: var(--text-gray);
    margin-bottom: 10px;
    animation: fadeUp 1s ease forwards;
}
```

Серый подзаголовок с расширенным межбуквенным интервалом. Анимируется `fadeUp` сразу при загрузке.

```css
.section-title {
    font-size: 48px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 40px;
    text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    animation: fadeUp 1s ease 0.2s forwards;
    opacity: 0;
}
```

Крупный заголовок 48px. `opacity: 0` + `animation` с задержкой 0.2s — появляется после `section-subtitle`.

```css
.calculator-interface {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 2px;
    width: 360px;
    margin: 0 auto;
    opacity: 0;
    animation: fadeUp 1s ease 0.4s forwards;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}
```

Контейнер калькулятора: glassmorphism (blur + полупрозрачность), тонкая белая рамка, тень. Появляется последним (задержка 0.4s).

```css
.display-panel {
    background: rgba(20, 20, 20, 0.9);
    padding: 25px;
    text-align: right;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

Дисплей: тёмный фон, текст выровнен вправо (как на реальном калькуляторе), разделитель снизу.

```css
.display-label {
    display: block;
    font-size: 10px;
    color: var(--text-gray);
    letter-spacing: 2px;
    margin-bottom: 5px;
}
.display-value {
    font-size: 36px;
    font-weight: 300;
    letter-spacing: 2px;
}
```

Подпись `INPUT STREAM` — мелкий серый текст. Значение — крупное, тонкое начертание (300).

```css
.keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(255, 255, 255, 0.1);
    padding-top: 1px;
}
```

CSS Grid 4 колонки. Трюк с разделителями: фон самого `.keypad` — полупрозрачный белый, а кнопки перекрывают его, оставляя видимыми только `gap: 1px` — это и есть тонкие линии сетки.

---

### Анимация `fadeUp`

```css
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

Элемент появляется снизу вверх с одновременным нарастанием прозрачности. Используется для поочерёдного появления заголовков и калькулятора.

---

### `.scroll-indicator` — Стрелки прокрутки

```css
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.6;
    cursor: pointer;
    z-index: 20;
}
.chevron {
    width: 15px;
    height: 15px;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    transform: rotate(45deg);
    margin: -5px;
    animation: scroll 2s infinite;
}
.chevron:nth-child(2) {
    animation-delay: 0.2s;
}
.chevron:nth-child(3) {
    animation-delay: 0.4s;
}
```

Три шеврона — квадраты с двумя белыми гранями, повёрнутые на 45° (стрелка вниз). Расположены вплотную (`margin: -5px`). Каждый следующий запаздывает на 0.2s — создаёт эффект «бегущей» стрелки.

```css
@keyframes scroll {
    0% {
        opacity: 0;
        transform: rotate(45deg) translate(-5px, -5px);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: rotate(45deg) translate(5px, 5px);
    }
}
```

Шеврон смещается по диагонали вниз-вправо (то же направление, что и стрелка вниз после поворота) и затухает.

---

### `.landing-section` — Второй экран

```css
.landing-section {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #000;
    overflow: hidden;
}
```

Полноэкранная секция, чёрный фон, `overflow: hidden` скрывает края видео при анимации scale.

```css
.video-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    transform: scale(1.1);
    transition:
        opacity 1.5s ease-out,
        transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.video-block.visible {
    opacity: 1;
    transform: scale(1);
}
```

Блок с видео скрыт и немного увеличен. При появлении в viewport (JS добавляет `.visible`) — плавно появляется и «уменьшается» до scale(1). Кинематографический эффект.

```css
.video-block video {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    pointer-events: none;
}
```

Видео на весь экран с обрезкой (`cover`). `pointer-events: none` — не перехватывает события мыши.

```css
.video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 2;
}
```

Затемняющий слой поверх видео — повышает контрастность белого текста.

```css
.landing-content {
    position: relative;
    z-index: 3;
    text-align: center;
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s ease 0.6s;
}
.landing-content.visible {
    opacity: 1;
    transform: translateY(0);
}
```

Текст поверх видео (z-index 3 > overlay z-index 2). Появляется с задержкой 0.6s относительно видео.

---

### `.mute-btn` — Кнопка звука

```css
.mute-btn {
    position: absolute;
    bottom: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
}
.mute-btn.visible {
    opacity: 1;
    transform: translateY(0);
    transition:
        opacity 0.5s ease 1s,
        transform 0.5s ease 1s,
        background 0.3s,
        transform 0.3s;
}
.mute-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
}
```

Круглая кнопка, изначально скрыта. Появляется с задержкой 1s (после видео и текста). Hover: светлее фон, более заметная рамка, лёгкое увеличение.

```css
.mute-btn svg {
    width: 22px;
    height: 22px;
}
```

Размер SVG-иконок внутри кнопки.

---

### Адаптивность `@media (max-width: 768px)`

```css
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    .burger-menu {
        display: flex;
    }
    .spacex-header {
        padding: 20px;
    }
    .section-title {
        font-size: 32px;
        margin-bottom: 20px;
    }
    .calculator-interface {
        width: 90%;
    }
    .mute-btn {
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
    }
    .mute-btn svg {
        width: 18px;
        height: 18px;
    }
}
```

На экранах ≤ 768px:

- Навигационное меню скрывается, появляется бургер-иконка.
- Шапка — меньшие отступы.
- Заголовок — меньший размер шрифта.
- Калькулятор — растягивается на 90% ширины.
- Кнопка звука — меньшего размера и ближе к краям.

---

## about.css

Стили для страницы `about.html`. Содержит те же фоновые эффекты (дублированы), стили шапки и уникальные стили карточки About.

---

### `:root`, `*`, `body`

Идентичны `main.css`. Устанавливают CSS-переменные, reset и базовые стили.

---

### Фоновые эффекты и шапка

`.stars-container`, `.meteor-shower`, `.meteor`, `@keyframes twinkle/meteor-fall/shower-cycle`, `.background-layer`, `.vignette`, `.spacex-header`, `.nav-menu`, `.burger-menu` — **полностью идентичны соответствующим блокам в `main.css`** (код продублирован).

> Важное отличие: в `about.css` отсутствует стиль `.mars-planet`, поэтому на странице About изображение Марса не отображается — только звёздное небо.

---

### `.about-main` — Главный блок страницы

```css
.about-main {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
    text-align: left;
}
```

Полноэкранная секция. Flexbox центрирует карточку по горизонтали и вертикали. `text-align: left` — текст внутри карточки выровнен влево.

---

### `.about-panel` — Стеклянная карточка

```css
.about-panel {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    padding: 32px 36px;
    width: 420px;
    max-width: 90%;
    color: var(--text-white);
    animation: fadeUp 0.8s ease forwards;
    opacity: 0;
}
```

Glassmorphism-карточка: blur-фон, полупрозрачность, тонкая рамка, глубокая тень. `max-width: 90%` — на мобильных не выходит за экран. Анимируется `fadeUp` при загрузке.

---

### `.about-header` — Шапка карточки

```css
.about-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    padding-bottom: 12px;
    margin-bottom: 18px;
}
```

Разделитель между шапкой карточки и содержимым. Тонкая полупрозрачная линия снизу.

```css
.about-label {
    display: block;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-gray);
    margin-bottom: 4px;
}
```

Маленькая серая метка `ABOUT ME` с широким letter-spacing.

```css
.about-sub {
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
}
```

Имя автора — крупнее, жирнее, белый.

---

### `.about-content` — Текстовое содержимое

```css
.about-content p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-gray);
    margin-bottom: 10px;
}
.about-content p:last-child {
    margin-bottom: 0;
}
```

Параграфы: серый цвет, комфортный межстрочный интервал 1.6, отступы между абзацами 10px. У последнего параграфа нижний отступ убран.

---

### `@keyframes fadeUp`

```css
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

Дублирует анимацию из `main.css` — необходима, так как `about.css` подключается независимо без `main.css`.

---

## Итоговая структура проекта

```
project/
├── index.html          # Главная страница (калькулятор + видео)
├── about.html          # Страница "Обо мне"
├── css/
│   ├── main.css        # Стили главной страницы
│   └── about.css       # Стили страницы About
├── js/
│   └── main.js         # JavaScript (калькулятор, анимации, звук)
├── image/
│   └── SpaceX_Logo_Black.png
├── video/
│   └── rocket-landing.mp4
└── mars.jpg            # Фоновое изображение Марса
```
