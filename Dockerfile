# Use a lightweight Node.js base image
FROM node:20-alpine



# App env (you can still override at runtime with --env or --env-file)
ENV PORT=82
ENV NODE_ENV=production

# Mongo
ENV MONGODB_URI=mongodb://192.168.13.84/bmpl_quotes



ENV ADMIN_API_KEY=eastorwestbmplisbest
ENV CORS_ORIGIN=https://bmpl.vercel.app/

# SMTP
ENV SMTP_HOST=smtpout.secureserver.net
ENV SMTP_PORT=465
ENV SMTP_SECURE=true
ENV SMTP_USER=connect@bhawanimoulders.com
ENV SMTP_PASS=ragrawal@1194
ENV SMTP_FROM=connect@bhawanimoulders.com



# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
# Use npm ci for reproducible installs; omit dev deps in production
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose application port
EXPOSE ${PORT}

# Start the server
CMD ["node", "src/index.js"]


# docker build  --no-cache -t 192.168.13.72:5000/bmpl_be_20_jan_2026 .      
# docker run -d --name bmpl_be_20_jan_2026 -p 82:82 bmpl_be_20_jan_2026_image

# docker tag bmpl_be_20_jan_2026_image 192.168.13.72:5000/bmpl_be_20_jan_2026
# docker push 192.168.13.72:5000/bmpl_be_20_jan_2026
# docker pull 192.168.13.72:5000/bmpl_be_20_jan_2026
# docker run -d --name bmpl_be_20_jan_2026 -p 82:82 192.168.13.72:5000/bmpl_be_20_jan_2026
