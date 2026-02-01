# College Service Operations Analytics Chatbot

A 4-agent SQL analytics chatbot for analyzing college service request data.

## Architecture

- **Agent 1 (SQL Generator)**: Converts natural language to MySQL SELECT queries using Groq AI
- **Agent 2 (SQL Validator)**: Validates SQL queries for security and compliance
- **Agent 3 (SQL Executor)**: Executes validated queries on the database
- **Agent 4 (Result Interpreter)**: Uses AI to provide natural language interpretation of results
- **Insight Generator**: Fallback rule-based insights

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MySQL database with the SERVICE_REQUESTS table as per the schema.

3. Get a Groq API key from https://console.groq.com/

4. Create a `.env` file based on `.env.example` and set your API key and database credentials.

   **⚠️ IMPORTANT:** Get your Groq API key from https://console.groq.com/ and replace `your_groq_api_key_here` in `.env`. The app will not work without a valid API key.

   **⚠️ SECURITY WARNING:** Never commit your `.env` file to version control. It contains sensitive information like API keys and passwords. Make sure `.env` is in your `.gitignore` file.

   Required environment variables:
   - `GROQ_API_KEY`: Your Groq API key from https://console.groq.com/
   - `GROQ_API_URL`: API endpoint (default: https://api.groq.com/openai/v1/chat/completions)
   - `GROQ_MODEL`: Model to use (default: llama-3.1-8b-instant)
   - Database credentials as shown
   - `GROQ_API_KEY`: Your Groq API key
   - `DB_HOST`: Database host (default: localhost)
   - `DB_USER`: Read-only database user
   - `DB_PASSWORD`: Database password
   - `DB_NAME`: Database name (default: college_service_db)
   - `PORT`: Server port (default: 3000)

5. Run the web interface:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.

## CLI Testing

Run the CLI version with example queries:
```bash
npm start
```

## Database Schema

The chatbot uses the SERVICE_REQUESTS table with the following columns:
- RequestID VARCHAR(20) PRIMARY KEY
- SubmittedDate DATETIME
- Category ENUM('IT Support','Facilities','HR','Academic','Finance')
- SubCategory VARCHAR(100)
- Priority ENUM('Critical','High','Medium','Low')
- Status ENUM('New','In Progress','Pending Info','Resolved','Closed')
- AssignedTeam VARCHAR(50)
- AssignedTo VARCHAR(100)
- ResolutionDate DATETIME
- SLA_Hours INT
- ActualResolutionHours DECIMAL(6,2)
- SLA_Status ENUM('Met','Breached','At Risk')
- RequesterDepartment ENUM('Engineering','Admin','Faculty','Student Services','Management')
- Description TEXT
- ReopenCount INT
- FirstResponseHours DECIMAL(5,2)
- CreatedAt TIMESTAMP

## Example Queries

- "Which team breached SLA the most?"
- "Average resolution time by category"
- "SLA trend over time"
- "Which department raises most requests?"
- "Which priorities cause delays?"
- "Teams with highest reopen count"
- "Open vs resolved requests"

## Security

- Only SELECT queries are allowed
- Read-only database user
- SQL validation prevents injection and unauthorized operations
- Timeout and row limits enforced