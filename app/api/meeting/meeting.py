import os
import requests
import json

API_KEY_SECRET = os.getenv("API_KEY_SECRET")
if not API_KEY_SECRET:
    print("Error: API_KEY_SECRET environment variable is not set.")
    exit(1)
# MIROTALK_URL = "http://localhost:3000/api/v1/meeting"
MIROTALK_URL = "https://p2p.mirotalk.com/api/v1/meeting"
# MIROTALK_URL = "https://mirotalk.up.railway.app/api/v1/meeting"

headers = {
    "authorization": API_KEY_SECRET,
    "Content-Type": "application/json",
}

response = requests.post(
    MIROTALK_URL,
    headers=headers
)

print("Status code:", response.status_code)
data = json.loads(response.text)
print("meeting:", data["meeting"])
