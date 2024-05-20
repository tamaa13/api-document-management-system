# API Documentation

## Endpoints

### POST /api/users/register

Register a new user.

Request Body:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `username` | string | The username of the user. |
| `password` | string | The password of the user. |
| `email` | string | The email of the user. |

### POST /api/users/login

Log in a user.

Request Body:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `email` | string | The email of the user. |
| `password` | string | The password of the user. |

### POST /api/documents/upload

Upload a document.

Headers:

| Header | Type     | Description |
|--------|----------|-------------|
| `token` | string | The authentication token. |

Request Body:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `title` | string | The title of the document. |
| `file` | png, jpeg, jpg, webp | The file to be uploaded. |

### GET /api/documents?page=page&title=title

Get a list of documents.

Headers:

| Header | Type     | Description |
|--------|----------|-------------|
| `token` | string | The authentication token. |

Query Parameters:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `title` | string | (optional) The title of the document. |
| `page` | number | (optional) The page number of the results. |

### GET /api/documents/:documentId

Get a specific document.

Headers:

| Header | Type     | Description |
|--------|----------|-------------|
| `token` | string | The authentication token. |

Parameters:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `documentId` | number | The ID of the document. |

### DELETE /api/documents/:documentId

Delete a specific document.

Headers:

| Header | Type     | Description |
|--------|----------|-------------|
| `token` | string | The authentication token. |

Parameters:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `documentId` | number | The ID of the document. |

### POST /api/share

Share a document with other users.

Headers:

| Header | Type     | Description |
|--------|----------|-------------|
| `token` | string | The authentication token. |

Request Body:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `documentId` | number | The ID of the document to be shared. |
| `userEmails` | array of strings | The emails of the users to share the document with. |