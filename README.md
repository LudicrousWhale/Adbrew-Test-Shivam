# 📝 TODO App (Full-Stack with Docker)

This is a simple full-stack TODO app built with:

- **React** frontend
- **Django REST Framework** backend
- **MongoDB** database
- Fully containerized using **Docker**

---

## 📦 Prerequisites

- Docker
- Docker Compose
- Node.js (for development without Docker)
- Python 3.8+ (for development without Docker)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-root>
```

### 2. Set the Environment Variable

Make sure the following environment variable is set in your shell or `.env` file:

```bash
export ADBREW_CODEBASE_PATH=$(pwd)/src  #command for mac
```

---

## 🐳 Running the App with Docker

### Build and Start Containers

```bash
docker-compose up --build
```

### Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/todos/](http://localhost:8000/todos/)
- MongoDB: [localhost:27017](mongodb://localhost:27017) (for dev tools)

---

## 🧪 Running Tests

### 🔙 Backend Tests (Django)

Make sure you're inside the `src/rest` directory:

```bash
cd src/rest
python manage.py test
```

This will run all unit tests located inside `src/rest/rest/test/`.

> If you see `Ran 0 tests`, ensure your test file is named with the pattern `test_*.py` and is inside a folder named `test`.

---

### 🌐 Frontend Tests (React)

```bash
cd src/app
yarn install
yarn test
```

This will launch the interactive test runner (powered by Jest).

To run tests in non-interactive CI mode:

```bash
CI=true yarn test
```

---

## 🧰 Dev Commands

### Restart a specific container

```bash
docker restart app        # or api, mongo
```

### Check container logs

```bash
docker logs -f app
```

---

## 🛠️ Tech Stack

| Layer    | Tech                   |
| -------- | ---------------------- |
| Frontend | React, Yarn, CSS       |
| Backend  | Django REST, Python    |
| Database | MongoDB                |
| DevOps   | Docker, Docker Compose |

---

## 📂 Project Structure

```
src/
├── app/              # React frontend
├── rest/             # Django backend
│   ├── rest/         # Django app
│   ├── test/         # Backend unit tests
│   └── manage.py     # Django entry point
├── db/               # MongoDB data
├── requirements.txt  # Backend dependencies
```

---

## 🙌 Contributing

PRs are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📃 License

MIT License