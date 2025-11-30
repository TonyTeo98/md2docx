# md2docx 部署指南

## 方式一：直接部署（推荐）

### 1. 上传项目

```bash
scp -r md2docx user@your-server:/var/www/
```

### 2. 构建

```bash
cd /var/www/md2docx
npm install
npm run build
```

### 3. 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/md2docx
```

写入配置（修改端口和路径）：

```nginx
server {
    listen 8080;  # 修改为你想要的端口
    server_name _;

    root /var/www/md2docx/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 协作服务器（可选）
    # location /ws {
    #     proxy_pass http://127.0.0.1:1234;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection "upgrade";
    # }
}
```

启用并重载：

```bash
sudo ln -s /etc/nginx/sites-available/md2docx /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4. 开放端口

```bash
sudo ufw allow 8080
```

### 5. 访问

`http://your-server-ip:8080`

---

## 方式二：Docker 部署

### 1. 上传项目

```bash
scp -r md2docx user@your-server:/var/www/
```

### 2. 修改端口（可选）

编辑 `docker-compose.yml`：

```yaml
ports:
  - "8080:80"  # 左边改成你想要的端口
```

### 3. 启动

```bash
cd /var/www/md2docx
sudo docker-compose up -d --build
```

### 4. 访问

`http://your-server-ip:8080`

---

## 协作服务器（可选）

如需多人实时协作功能：

```bash
cd /var/www/md2docx/server
npm install && npm run build
pm2 start dist/index.js --name md2docx-collab
pm2 save
```

然后取消 Nginx 配置中 `/ws` 部分的注释。

---

## 常用命令

```bash
# Nginx
sudo systemctl reload nginx
sudo nginx -t

# PM2（协作服务器）
pm2 list
pm2 logs md2docx-collab
pm2 restart md2docx-collab

# Docker
sudo docker-compose ps
sudo docker-compose logs -f
sudo docker-compose down
sudo docker-compose up -d --build

# 更新代码
git pull && npm run build
```

---

## HTTPS（可选）

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```
