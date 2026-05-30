FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
RUN npm ci --omit=dev
EXPOSE 3001
ENV PORT=3001
CMD ["node", "dist/server/index.js"]
