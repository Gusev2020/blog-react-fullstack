# Образ linux alpine с версией node 14
FROM node:19.5.0-alpine

# Указываю рабучую директорию
WORKDIR /app

# Копирую package.json и package-lock.json внутрь контейнера
COPY package*.json ./

# Устанавливаю зависимости
RUN npm install

# Копирую оставшеесяя приложение
COPY . .

# Устанавливаю Prisma
RUN npm install -g prisma

# Генерирую prisma client
RUN prisma generate

# Копирую prisma schema
COPY prisma/schema.prisma ./prisma/

# Запускаю сервер
CMD ["npm", "start"]

# Открываю порт в контейнере
EXPOSE 3000
