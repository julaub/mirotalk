#!/bin/bash

API_KEY_SECRET="${API_KEY_SECRET}"
if [ -z "$API_KEY_SECRET" ]; then
    echo "Error: API_KEY_SECRET environment variable is not set."
    exit 1
fi
# MIROTALK_URL="http://localhost:3000/api/v1/meeting"
MIROTALK_URL="https://p2p.mirotalk.com/api/v1/meeting"
# MIROTALK_URL="https://mirotalk.up.railway.app/api/v1/meeting"

curl $MIROTALK_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --request POST