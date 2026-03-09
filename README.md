# SmartCampus LLM

**SmartCampus LLM** is an AI-powered university assistant that allows **students, faculty, and administrators** to access academic data using natural language queries.  
The system converts user questions into **secure SQL queries** and retrieves insights from a PostgreSQL database.

---

## Features

### Student
- Academic performance insights
- Attendance and subject analytics

### Faculty
- Department-level performance analysis
- Student performance tracking

### Admin
- University-wide analytics
- Faculty and student performance reports

---

## Architecture

User Query  
↓  
Message Router  
↓  
Role-based Prompt Builder  
↓  
LLM SQL Generation  
↓  
SQL Guard + RBAC  
↓  
PostgreSQL Database  
↓  
Readable Results

---


## Project Structure
