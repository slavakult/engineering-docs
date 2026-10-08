# API Reference

API SASCOM предоставляет программный интерфейс для взаимодействия с основными функциональными модулями платформы.

## Основные модули

| Модуль | Назначение |
|---|---|
| **Authentication** | Аутентификация пользователей и управление сессиями |
| **Warehouse** | Работа с элементной базой, импортом компонентов, datasheet и 3D-моделями |
| **Projects** | Управление проектами, BOM, архитектурой и журналом изменений |
| **Tasks** | Управление задачами и представление задач в режимах списка и Kanban |

## Базовые сведения

### Base URL

```text
https://sascom.ddns.net
```

### Версия API

```text
v1
```

Префикс endpoint'ов:

```text
/api/v1
```

## Авторизация

Большинство операций API требуют Bearer-токен:

```http
Authorization: Bearer <token>
```

Подробности: [Authentication](authentication.md).

## Документация OpenAPI

Полная спецификация API представлена в формате OpenAPI. Swagger UI может использовать эту спецификацию для интерактивного просмотра API.

## Разделы

- [Authentication](authentication.md)
- [Warehouse](warehouse.md)
- [Projects](projects.md)
- [Tasks](tasks.md)
