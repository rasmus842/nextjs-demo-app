FROM node:18-alpine

ENV NEXT_PUBLIC_NODE_ENV=development
ENV NEXT_BASE_URL=http://localhost:3000
ENV NEXT_SECRET=M3llow_$3cret
ENV NEXT_DATABASE_HOST=aws.connect.psdb.cloud
ENV NEXT_DATABASE_USERNAME=l2qmsx4nvowsb9wtk69k
ENV NEXT_DATABASE_PASSWORD=pscale_pw_lw1dy1e1lkOCvZY0b09ee9rsc6h5inhgoHaAp4ZKHX3
ENV NEXT_DATABASE_NAME=practice
ENV NEXT_TOKEN_TIME_HOURS=24

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]





