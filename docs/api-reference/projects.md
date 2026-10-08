# Projects API

Модуль **Projects** предоставляет API для управления проектами и связанными инженерными данными.

## Список проектов

```http
GET /api/v1/projects
```

### Ответ

```http
200 OK
```

## Создание проекта

```http
POST /api/v1/projects
```

```json
{
  "name": "Analog Device",
  "description": "Project description"
}
```

Используется схема `ProjectCreate`.

### Ответ

```http
201 Created
```

## Получение проекта

```http
GET /api/v1/projects/{project_id}
```

| Параметр | Тип | Описание |
|---|---|---|
| `project_id` | `string` | Идентификатор проекта |

### Ответ

```http
200 OK
```

## Обновление проекта

```http
PUT /api/v1/projects/{project_id}
```

### Ответ

```http
200 OK
```

## Удаление проекта

```http
DELETE /api/v1/projects/{project_id}
```

### Ответ

```http
204 No Content
```

## Изменение статуса

```http
PATCH /api/v1/projects/{project_id}/status
```

Допустимые статусы:

| Значение | Описание |
|---|---|
| `active` | Проект активен |
| `paused` | Работа приостановлена |
| `completed` | Проект завершён |
| `archived` | Проект архивирован |

```json
{
  "status": "active"
}
```

## Обзор проекта

```http
GET /api/v1/projects/{project_id}/overview
```

Возвращает данные для обзора проекта, включая сведения о 3D-модели, паспорте и архитектуре.

## Компоненты проекта

```http
GET /api/v1/projects/{project_id}/components
```

Возвращает BOM проекта.

## Архитектурный граф

Получение:

```http
GET /api/v1/projects/{project_id}/architecture/graph
```

Обновление:

```http
PUT /api/v1/projects/{project_id}/architecture/graph
```

## Журнал изменений

```http
GET /api/v1/projects/{project_id}/changelog
```

Необязательный параметр `type`:

```text
file
schematic
architecture
bom
note
```

Пример:

```http
GET /api/v1/projects/123/changelog?type=architecture
```

### Ответ

```http
200 OK
```
