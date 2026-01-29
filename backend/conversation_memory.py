# In-memory session storage (sufficient for demo + viva)
sessions = {}

def get_history(session_id: str):
    return sessions.get(session_id, [])

def add_message(session_id: str, role: str, content: str):
    sessions.setdefault(session_id, []).append({
        "role": role,
        "content": content
    })

def init_session(session_id: str):
    if session_id not in sessions:
        sessions[session_id] = [{
            "role": "assistant",
            "content": "Hi! 😊 I’m SmartCampus. How can I help you today?"
        }]
