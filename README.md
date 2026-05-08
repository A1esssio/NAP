# 🚀 SpaceX Missions API

REST API для управления космическими миссиями SpaceX. Данные хранятся в JSON-файле.

## Структура проекта

```
spacex-express-api/
├── src/
│   ├── index.js                        # Точка входа: сервер, middleware, роуты
│   ├── routes/
│   │   └── missions.js                 # Маршруты /missions
│   ├── controllers/
│   │   └── missionsController.js       # Обработка req/res
│   ├── services/
│   │   ├── missionsService.js          # Бизнес-логика (CRUD + фильтрация)
│   │   └── fileService.js              # Чтение/запись JSON
│   └── data/
│       └── missions.json               # Хранилище данных
├── package.json
└── README.md
```

## Установка и запуск

```bash
npm install
npm run dev     # с nodemon (автоперезапуск)
# или
npm start       # без nodemon
```

Сервер запускается на `http://localhost:3000`

---

## API Endpoints

| Метод  | URL                             | Описание               |
| ------ | ------------------------------- | ---------------------- |
| GET    | /missions                       | Список всех миссий     |
| GET    | /missions?mission_name=Starlink | Фильтрация по названию |
| GET    | /missions/:id                   | Одна миссия по ID      |
| POST   | /missions                       | Создать новую миссию   |
| PATCH  | /missions/:id                   | Обновить поля миссии   |
| DELETE | /missions/:id                   | Удалить миссию         |

---

## Тестирование (Postman)

**1. Получить все миссии**

```
GET http://localhost:3000/missions
```

**2. Фильтрация по названию**

```
GET http://localhost:3000/missions?mission_name=Starlink
```

**3. Получить одну миссию**

```
GET http://localhost:3000/missions/1
```

**4. Создать новую миссию** (Body → raw → JSON)

```
POST http://localhost:3000/missions
```

```json
{
  "image": "https://example.com/img.png",
  "mission_name": "Dragon CRS-25",
  "description": "Грузовая миссия к МКС"
}
```

**5. Изменить миссию** (Body → raw → JSON)

```
PATCH http://localhost:3000/missions/1
```

```json
{
  "mission_name": "Starlink Updated"
}
```

**6. Удалить миссию**

```
DELETE http://localhost:3000/missions/3
```

---

## Тестирование (curl + ожидаемые ответы)

### 1. GET /missions — получить все миссии

```bash
curl http://localhost:3000/missions
```

**Ожидаемый ответ (200):**

```json
[
  {
    "id": 1,
    "image": "...",
    "mission_name": "Starlink Mission 1",
    "description": "..."
  },
  {
    "id": 2,
    "image": "...",
    "mission_name": "Crew Dragon Demo-2",
    "description": "..."
  },
  {
    "id": 3,
    "image": "...",
    "mission_name": "Falcon Heavy Test",
    "description": "..."
  },
  {
    "id": 4,
    "image": "...",
    "mission_name": "Starship SN15",
    "description": "..."
  }
]
```

---

### 2. GET /missions?mission_name=Starlink — фильтрация по названию

```bash
curl "http://localhost:3000/missions?mission_name=Starlink"
```

**Ожидаемый ответ (200):**

```json
[
  {
    "id": 1,
    "image": "https://images2.imgbox.com/3f/8b/Gt9AlhY6_o.png",
    "mission_name": "Starlink Mission 1",
    "description": "Первый запуск группы спутников Starlink для глобального интернета"
  }
]
```

---

### 3. POST /missions — создать новую миссию

```bash
curl -X POST http://localhost:3000/missions \
  -H "Content-Type: application/json" \
  -d '{
    "image": "https://images2.imgbox.com/example.png",
    "mission_name": "Dragon CRS-25",
    "description": "Грузовая миссия к МКС с научным оборудованием"
  }'
```

**Ожидаемый ответ (201):**

```json
{
  "id": 5,
  "image": "https://images2.imgbox.com/example.png",
  "mission_name": "Dragon CRS-25",
  "description": "Грузовая миссия к МКС с научным оборудованием"
}
```

---

### 4. GET /missions/2 — получить миссию по ID

```bash
curl http://localhost:3000/missions/2
```

**Ожидаемый ответ (200):**

```json
{
  "id": 2,
  "image": "https://images2.imgbox.com/40/e3/GP1FkTYb_o.png",
  "mission_name": "Crew Dragon Demo-2",
  "description": "Первая пилотируемая миссия SpaceX с астронавтами NASA"
}
```

---

### 5. PATCH /missions/1 — изменить поля миссии

```bash
curl -X PATCH http://localhost:3000/missions/1 \
  -H "Content-Type: application/json" \
  -d '{ "mission_name": "Starlink Mission 1 — Updated" }'
```

**Ожидаемый ответ (200):**

```json
{
  "id": 1,
  "image": "https://images2.imgbox.com/3f/8b/Gt9AlhY6_o.png",
  "mission_name": "Starlink Mission 1 — Updated",
  "description": "Первый запуск группы спутников Starlink для глобального интернета"
}
```

---

### 6. DELETE /missions/1 — удалить миссию

```bash
curl -X DELETE http://localhost:3000/missions/1
```

**Ожидаемый ответ: `204 No Content` (пустое тело)**

---

## Edge Cases

### Несуществующий ID

```bash
curl http://localhost:3000/missions/999
```

```json
{ "error": "Миссия с ID 999 не найдена" }
```

Статус: **404**

---

### Пустая фильтрация (нет совпадений)

```bash
curl "http://localhost:3000/missions?mission_name=Apollo"
```

```json
[]
```

Статус: **200** (пустой массив — норма)

---

### POST без обязательных полей

```bash
curl -X POST http://localhost:3000/missions \
  -H "Content-Type: application/json" \
  -d '{ "mission_name": "Incomplete" }'
```

```json
{ "error": "Поля image, mission_name и description обязательны" }
```

Статус: **400**

---

### Несуществующий маршрут

```bash
curl http://localhost:3000/rockets
```

```json
{ "error": "Маршрут GET /rockets не найден" }
```

Статус: **404**

---

### PATCH с пустым телом

```bash
curl -X PATCH http://localhost:3000/missions/1 \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{ "error": "Тело запроса не должно быть пустым" }
```

Статус: **400**

---

## Тестирование в Postman / Insomnia

1. Создайте коллекцию **SpaceX API**
2. Установите переменную окружения `base_url = http://localhost:3000`
3. Добавьте запросы из таблицы выше
4. Для POST/PATCH: выберите Body → raw → JSON и вставьте JSON-тело

---

## Технические детали

- **Хранилище**: `src/data/missions.json` (синхронный `fs.readFileSync`)
- **Фильтрация**: регистронезависимая, подстрочная (`.toLowerCase().includes()`)
- **Генерация ID**: `Math.max(...ids) + 1`
- **Логирование**: `[ISO timestamp] METHOD /path` в консоль
