# bootcamp-room-reservation-api

Pasos para ejecutar la aplicación serverless:
- Instalar dependencias
```bash
    $ npm i
```

- Preparar husky
```bash
    $ npm run prepare
```

- Ejecutar serverless de manera local
```bash
    npm run lambda:offline
```

- Desplegar serverless
```bash
    npm run lambda:online
```

URLs a consultar
- URL local:
    - http://localhost:3000/dev/cake?sick=true
- URL pública:
    - https://srycwadr5m.execute-api.us-east-1.amazonaws.com/dev/cake?sick=true
