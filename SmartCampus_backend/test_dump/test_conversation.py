from conversation_memory import init_session, get_history, add_message
from message_router import classify_message

session_id = "demo_user"

# System greets first
init_session(session_id)
print(get_history(session_id))

# User says hi
user_msg = "Hi"
add_message(session_id, "user", user_msg)
print("Route:", classify_message(user_msg))

# User asks data question
user_msg = "Show average GPA by department"
add_message(session_id, "user", user_msg)
print("Route:", classify_message(user_msg))
