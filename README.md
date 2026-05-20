# Collaborative Document Store

A production-ready collaborative wiki backend built using Node.js, Express.js, MongoDB, and Docker.
This project implements advanced backend concepts such as Optimistic Concurrency Control (OCC), full-text search, analytics aggregation pipelines, schema migration strategies, and Dockerized deployment.

---

# Features

* CRUD APIs for collaborative documents
* Optimistic Concurrency Control (OCC)
* Conflict detection with version handling
* Revision history tracking
* Full-text search using MongoDB text indexes
* Tag-based filtering
* Most edited documents analytics
* Tag co-occurrence analytics
* Lazy schema migration
* Background migration script
* Seed script for generating 1000+ documents
* Dockerized setup using Docker Compose
* MongoDB integration with Mongoose

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Docker
* Docker Compose

---

# Project Structure

```text
Collaborative-Document-Store
│
├── scripts
│   ├── migrate_author_schema.js
│   └── seed.js
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   └── documentController.js
│   │
│   ├── models
│   │   └── documentModel.js
│   │
│   ├── routes
│   │   └── documentRoutes.js
│   │
│   └── server.js
│
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Santhoshi003/Collaborative_Document_Store.git
```

## Open Project

```bash
cd Collaborative_Document_Store
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/wikiDB
DATABASE_NAME=wikiDB
```

---

# Run Using Docker

```bash
docker-compose up --build
```

Server will run on:

```text
http://localhost:5000
```

---

# Seed Database

Run seed script:

```bash
npm run seed
```

This generates 1000 sample documents automatically.

---

# Run Migration Script

```bash
npm run migrate
```

This converts old author schema into new structured schema.

---

# API Endpoints

## Create Document

### POST

```text
/api/documents
```

### Request Body

```json
{
  "title": "MongoDB Guide",
  "content": "MongoDB database tutorial",
  "tags": ["mongodb", "guide"],
  "authorName": "Santhoshi",
  "authorEmail": "santhoshi@gmail.com"
}
```

---

## Get Document

### GET

```text
/api/documents/:slug
```

Example:

```text
/api/documents/mongodb-guide
```

---

## Update Document with OCC

### PUT

```text
/api/documents/:slug
```

### Request Body

```json
{
  "title": "Updated Title",
  "content": "Updated Content",
  "version": 1
}
```

### OCC Behavior

* If version matches → update succeeds
* If version mismatches → returns `409 Conflict`

---

## Delete Document

### DELETE

```text
/api/documents/:slug
```

---

## Full Text Search

### GET

```text
/api/search?q=mongodb
```

---

## Search with Tags

### GET

```text
/api/search?q=mongodb&tags=guide
```

---

## Most Edited Documents Analytics

### GET

```text
/api/analytics/most-edited
```

---

## Tag Co-occurrence Analytics

### GET

```text
/api/analytics/tag-cooccurrence
```

---

# Optimistic Concurrency Control (OCC)

This project uses version-based OCC to prevent lost updates during simultaneous document editing.

### Workflow

1. Client fetches document with current version
2. Client sends update request with version number
3. Server updates document only if versions match
4. If versions mismatch:

   * update fails
   * API returns `409 Conflict`
   * latest document version is returned

---

# Full Text Search

MongoDB text indexes are used on:

* title
* content

Search results are sorted using MongoDB text relevance score.

---

# Analytics

## Most Edited Documents

Uses MongoDB aggregation pipelines to:

* calculate revision counts
* sort documents
* return top edited documents

## Tag Co-occurrence

Calculates frequently appearing tag combinations across documents.

---

# Schema Migration

## Lazy Migration

Old schema:

```json
"author": "Santhoshi"
```

New schema:

```json
"author": {
  "id": null,
  "name": "Santhoshi",
  "email": null
}
```

Documents are automatically transformed during reads.

---

# Background Migration Script

File:

```text
scripts/migrate_author_schema.js
```

This script:

* scans old documents
* converts author schema
* updates database records

---

# Seed Script

File:

```text
scripts/seed.js
```

Generates:

* 1000+ sample documents
* sample metadata
* sample tags

---

# Docker Setup

The application is fully containerized using Docker Compose.

Includes:

* MongoDB container
* API container
* persistent database volume
* health checks

---

# Author

Santhoshi

GitHub Repository:

[Collaborative_Document_Store Repository](https://github.com/Santhoshi003/Collaborative_Document_Store?utm_source=chatgpt.com)
