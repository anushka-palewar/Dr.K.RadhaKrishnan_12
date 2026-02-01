# Full-Stack Project (Frontend + Backend + AI)

This repo contains the full application: frontend, backend, and SEVADRISHTI (AI chatbot logic).

## Folder structure

```
fronted_backedn_connection/
├── Backend/          # Express API (auth, AI route, service requests, MySQL + MongoDB)
├── Frontend/         # React app (Vite)
├── SEVADRISHTI/      # AI chatbot pipeline (SQL generation, validation, execution, interpretation)
└── README.md
```

- **Backend** uses **SEVADRISHTI** as a library: it loads `SEVADRISHTI/chatbot` and `SEVADRISHTI/.env` for the AI Assistance and analytics DB.
- **SEVADRISHTI** must have dependencies installed: run `npm install` inside `SEVADRISHTI/`.

## Run the project

1. **Backend:** `cd Backend && npm install && npm run dev`
2. **Frontend:** `cd Frontend && npm install && npm run dev`
3. Open http://localhost:5173 (Frontend talks to Backend on port 5001).

Ensure MongoDB (auth) and MySQL (SERVICE_REQUESTS + AI) are running and `.env` files are set in Backend and SEVADRISHTI as needed.
