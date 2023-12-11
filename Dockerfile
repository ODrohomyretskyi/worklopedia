FROM node:20

# Створення директорії додатку
WORKDIR /usr/src/app

# Копіювання package.json та package-lock.json
COPY package*.json ./

# Встановлення залежностей
RUN npm install --legacy-peer-deps

# Копіювання всіх файлів проекту
COPY . .

# Компіляція додатку
RUN npm run build

# Відкриття порту, який використовує додаток
EXPOSE 3000

# Запуск додатку
CMD ["npm", "run", "dev"]
