FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# Comando para levantar Vite/React exponiendo el puerto hacia fuera
CMD ["npm", "run", "dev", "--", "--host"]


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]