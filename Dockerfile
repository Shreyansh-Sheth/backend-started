FROM node:16 as builder
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build

FROM node:16 
WORKDIR /app


# Chnage This Enviroment Variables As You Need
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/dist .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .


EXPOSE 3000
CMD ["node" , "index.js"]
