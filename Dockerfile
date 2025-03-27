FROM node:lts-alpine
MAINTAINER MooYeol Prescott Lee "mooyoul@gmail.com"

# 創建工作目錄
RUN mkdir -p /var/task/

WORKDIR /var/task

# 複製 package.json 和 package-lock.json 並安裝依賴
COPY package.json package-lock.json /var/task/
RUN npm ci --production

# 複製 entrypoint.sh 和 index.js 到容器中
COPY entrypoint.sh index.js /var/task/

# 確保必要的 npm 包已安裝
RUN npm install axios

# 設定入口點腳本
ENTRYPOINT ["/var/task/entrypoint.sh"]
