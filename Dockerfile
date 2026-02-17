FROM node:18
WORKDIR /app

# Install Redis
RUN apt-get update && apt-get install -y redis-server && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000 6379

# Create startup script to run both Redis and Node.js
RUN echo '#!/bin/bash\nredis-server --bind 127.0.0.1 --port 6379 &\nnode server.js' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
