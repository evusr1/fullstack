 ```mermaid
sequenceDiagram
   participant browser
   participant server
    
   browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
   
   Note right of browser: The browser POSTs form data as JSON in body, content-type: application/json

   Note right of browser: The browser executes the callback function that renders the notes
```