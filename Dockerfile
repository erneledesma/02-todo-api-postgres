# Imagen base liviana con Node 20
FROM node:20-alpine

WORKDIR /app

# Copiamos primero los manifest de dependencias para aprovechar la cache de Docker:
# si solo cambia el codigo (no las dependencias), Docker no vuelve a correr npm install
COPY package*.json ./

RUN npm install --omit=dev

# Copiamos el resto del codigo fuente
COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
