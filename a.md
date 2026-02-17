Docker Image = Humare app ka ready to run package

Docker image me kya kya hota h 
1. Code
2. Runtime (Nodejs, python)
3. Dependencies
4. System Libraries
5. Configurations

Ek portable snapshot of my application

1. Install Nodejs
2. Npm install
3. SET env
4. Npx nodemon

Docker image = reciepe of cake
container = ready cake

- ubuntu OS layer
- Node runtime - Node.js
- App code
- node_modules
- Start command


Dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY ..
CMD ["node", "app.js"]

docker build -t my-app .

docket run -p 3000:3000 my-app

Local port 3000 -> container ka port h wo bhi 3000


git pull

docker pull node
docker pull nginx
docker pull mysql

CI/CD 
- Continuous Integration 
- Continuous Deployment

Ye ek automation process h 
- code automatically test hota h
- build hoti
- server pe deploy hojaega


Code Push 

Github Action trigger

Server deploy

App restart

website

