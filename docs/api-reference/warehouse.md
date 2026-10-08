# Warehouse API

Модуль **Warehouse** предназначен для программной работы с элементной базой и связанными инженерными данными.

## Список компонентов

```http
GET /api/v1/warehouse/components
```

| Параметр | Тип | Описание |
|---|---|---|
| `page` | `integer` | Номер страницы |
| `limit` | `integer` | Количество элементов |
| `manufacturer` | `string` | Фильтр по производителю |
| `category` | `string` | Фильтр по категории |
| `low_stock_only` | `boolean` | Только компоненты с низким остатком |

По умолчанию `page=1`, `limit=50`; максимальное значение `limit` — `200`.

### Ответ

```http
200 OK
```

## Создание компонента

```http
POST /api/v1/warehouse/components
```

Поддерживается JSON и загрузка данных через `multipart/form-data`.

```json
{
  "name": "ATmega328P",
  "manufacturer": "Microchip",
  "mpn": "ATMEGA328P-PU",
  "category": "Microcontroller"
}
```

### Ответ

```http
201 Created
```

## Получение компонента

```http
GET /api/v1/warehouse/components/{component_id}
```

### Ответ

```http
200 OK
```

## Обновление компонента

```http
PUT /api/v1/warehouse/components/{component_id}
```

### Ответ

```http
200 OK
```

## Удаление компонента

```http
DELETE /api/v1/warehouse/components/{component_id}
```

### Ответ

```http
204 No Content
```

## Datasheet

Получение:

```http
GET /api/v1/warehouse/components/{component_id}/datasheet
```

Загрузка:

```http
POST /api/v1/warehouse/components/{component_id}/datasheet
```

Для загрузки используется `multipart/form-data`, поле `file`.

## 3D-модель

```http
GET /api/v1/warehouse/components/{component_id}/model-3d
```

Ответ содержит архив с 3D-моделью.

## Импорт CSV

```http
POST /api/v1/warehouse/import/csv
```

Файл передаётся через `multipart/form-data`.

Ожидаемые колонки:

```text
Designator
Comment
Footprint
Quantity
Manufacturer
MPN
```

## Импорт из Digi-Key

```http
POST /api/v1/warehouse/import/digikey
```

```json
{
  "url": "https://www.digikey.ru/products/ru/detail/..."
}
```

## Коды ответа

| Код | Описание |
|---|---|
| `200` | Запрос выполнен успешно |
| `201` | Ресурс создан |
| `204` | Операция выполнена успешно |
| `400` | Некорректные параметры |
| `401` | Требуется авторизация |
| `404` | Компонент не найден |
