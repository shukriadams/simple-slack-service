
    curl -X POST http://localhost:4311/send
        -H 'Content-Type: application/json'
        -H 'Authorization: bearer 1234'
        -d '{ "text":"Hello  world", "channel":"< slack user or channel>" }' 
