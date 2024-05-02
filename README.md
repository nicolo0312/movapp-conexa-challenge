<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# REQUERIDO:
1. Instalar docker : ```https://www.docker.com/get-started/```
2. Instalar nodejs :  ``https://nodejs.org/en``
3. Instalar yarn de manera global: ```npm install --global yarn```

# MOVAPI: pasos para levantar el proyecto.
1. Clonar Proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Levantar base de datos : ```docker-compose up -d```
5. Correr el proyecto: ```yarn start:dev```
6. Correr seed: ```http://localhost:3000/api/seed```

