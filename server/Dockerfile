FROM node:lts
RUN mkdir app
WORKDIR app
COPY backend backend
COPY public public
COPY package.json .
COPY package-lock.json .
RUN npm ci --only-production