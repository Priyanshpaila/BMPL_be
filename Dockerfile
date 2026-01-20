# Use a lightweight Node.js base image
FROM node:20-alpine



# App env (you can still override at runtime with --env or --env-file)
ENV PORT=82
ENV NODE_ENV=production

# Mongo
ENV MONGODB_URI=mongodb://192.168.13.84/bmpl_quotes

# WhatsApp Cloud API (Meta for Developers)
# ENV WHATSAPP_PHONE_NUMBER_ID=699536063241390
# ENV WHATSAPP_ACCESS_TOKEN=EAAXJFQtLEDQBOZBHrYSdXpr9nfLRkQSG6lkQlYROT6P5uCGIATm3oAC6M7jlJTDEyKZCQZBapSLhL1j1nbzhYZAbwrL39QuxooyRmEJWHe9IG8WqnsTasuUELdyCPi4MmlEFM1oyNHhhpz5ZCCvMxd8XUxMuzhBqkGCNmNT6wlz2dYIvoCHWIjxFGR2THgYzjvePeVfnbM2BFeSqb
# ENV WHATSAPP_TEMPLATE_NAME=expo_rr
# ENV WHATSAPP_TEMPLATE_LANG=en_US
# ENV WHATSAPP_HEADER_IMAGE=https://i.postimg.cc/bJctsBJw/hira-rrispat-logo.png

ENV ADMIN_API_KEY=eastorwestbmplisbest
ENV CORS_ORIGIN=https://bmpl.vercel.app/

# SMTP
ENV SMTP_HOST=smtpout.secureserver.net
ENV SMTP_PORT=465
ENV SMTP_SECURE=true
ENV SMTP_USER=connect@bhawanimoulders.com
ENV SMTP_PASS=ragrawal@1194
ENV SMTP_FROM=connect@bhawanimoulders.com

# ENV APP_PUBLIC_URL=https://www.rrispat.com
# ENV WHATSAPP_HEADER_IMAGE=https://i.postimg.cc/bJctsBJw/hira-rrispat-logo.png

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


# docker build  --no-cache -t 192.168.13.72:5000/expobe_31oct2025 .      
# docker run -d --name expobe_31oct2025 -p 82:82 expobe_31oct2025_image

# docker tag expobe_31oct2025_image 192.168.13.72:5000/expobe_31oct2025
# docker push 192.168.13.72:5000/expobe_31oct2025
# docker pull 192.168.13.72:5000/expobe_31oct2025
# docker run -d --name expobe_31oct2025 -p 82:82 192.168.13.72:5000/expobe_31oct2025
