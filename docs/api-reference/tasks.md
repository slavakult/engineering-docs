# Tasks API

Модуль **Tasks** предоставляет API для управления задачами и их представления в рабочих режимах.

## Список задач

```http
GET /api/v1/tasks
```

| Параметр | Тип | Описание |
|---|---|---|
| `project_id` | `string` | Фильтр по проекту |
| `assignee_id` | `string` | Фильтр по исполнителю |
| `status` | `string` | Фильтр по статусу |
| `my_tasks_only` | `boolean` | Только задачи текущего пользователя |
| `view` | `string` | Режим отображения |

Допустимые значения `status`:

```text
todo
in_progress
review
done
```

Допустимые значения `view`:

```text
board
list
```

По умолчанию используется `board`.

### Примеры

```http
GET /api/v1/tasks?project_id=123
```

```http
GET /api/v1/tasks?my_tasks_only=true
```

```http
GET /api/v1/tasks?status=review
```

```http
GET /api/v1/tasks?view=list
```

### Ответ

```http
200 OK
```

Используется схема `TaskList`.

## Создание задачи

```http
POST /api/v1/tasks
```

```json
{
  "title": "Проверить элементную базу",
  "project_id": "123",
  "assignee_id": "456",
  "status": "todo"
}
```

Используется схема `TaskCreate`.

### Ответ

```http
201 Created
```

## Получение задачи

```http
GET /api/v1/tasks/{task_id}
```

| Параметр | Тип | Описание |
|---|---|---|
| `task_id` | `string` | Идентификатор задачи |

### Ответ

```http
200 OK
```

## Представления задач

### List

```http
GET /api/v1/tasks?view=list
```

### Board

```http
GET /api/v1/tasks?view=board
```

Задачи группируются по статусам:

- `todo`;
- `in_progress`;
- `review`;
- `done`.

## Фильтрация

Параметры можно комбинировать:

```http
GET /api/v1/tasks?project_id=123&assignee_id=456
```

```http
GET /api/v1/tasks?project_id=123&status=review
```

```http
GET /api/v1/tasks?my_tasks_only=true&view=list
```

## Коды ответа

| Код | Описание |
|---|---|
| `200` | Запрос выполнен успешно |
| `201` | Задача создана |
| `400` | Некорректные параметры |
| `401` | Требуется авторизация |
| `404` | Задача не найдена |
