# md2docx 部署指南

## 方式一：Docker 部署（推荐）

最简单的部署方式，直接拉取预构建镜像。

### 快速启动

```bash
# 下载 docker-compose.yml
curl -O https://raw.githubusercontent.com/TonyTeo98/md2docx/main/docker-compose.yml

# 启动服务
docker compose up -d
```

访问 `http://your-server-ip` 即可使用。

### 自定义端口

编辑 `docker-compose.yml`：

```yaml
services:
  web:
    ports:
      - "8080:80"  # 前端端口改为 8080
  collab:
    ports:
      - "3000:1234"  # 协作服务器端口改为 3000
```

### 仅部署前端（不需要协作功能）

```bash
docker run -d -p 80:80 --name md2docx ghcr.io/tonyteo98/md2docx:main
```

### 常用命令

```bash
# 查看状态
docker compose ps

# 查看日志
docker compose logs -f

# 更新镜像
docker compose pull && docker compose up -d

# 停止服务
docker compose down
```

---

## 方式二：手动构建 Docker 镜像

如需自定义构建：

```bash
# 克隆仓库
git clone https://github.com/TonyTeo98/md2docx.git
cd md2docx

# 构建并启动
docker compose -f docker-compose.build.yml up -d --build
```

<details>
<summary>docker-compose.build.yml 示例</summary>

```yaml
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped

  collab:
    build: ./server
    ports:
      - "1234:1234"
    restart: unless-stopped
```

</details>

---

## 方式三：直接部署（无 Docker）

### 1. 构建前端

```bash
git clone https://github.com/TonyTeo98/md2docx.git
cd md2docx
npm install
npm run build
```

### 2. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

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

    # 协作服务器代理（可选）
    location /ws {
        proxy_pass http://127.0.0.1:1234;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. 启动协作服务器（可选）

```bash
cd server
npm install
npm run build
pm2 start dist/index.js --name md2docx-collab
```

---

## 镜像信息

| 镜像 | 说明 |
|------|------|
| `ghcr.io/tonyteo98/md2docx:main` | 前端应用 (Nginx) |
| `ghcr.io/tonyteo98/md2docx-server:main` | 协作服务器 |

### 版本标签

- `main` - 最新开发版本
- `v1.0.0` - 指定版本（打 tag 后自动构建）
- `sha-xxxxxx` - 指定 commit

---

## HTTPS 配置

### 使用 Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 使用 Traefik（Docker 环境推荐）

<details>
<summary>docker-compose.yml with Traefik</summary>

```yaml
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - letsencrypt:/letsencrypt

  web:
    image: ghcr.io/tonyteo98/md2docx:main
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.md2docx.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.md2docx.tls.certresolver=letsencrypt"

  collab:
    image: ghcr.io/tonyteo98/md2docx-server:main

volumes:
  letsencrypt:
```

</details>

---

## 故障排查

```bash
# 检查容器状态
docker compose ps

# 查看日志
docker compose logs web
docker compose logs collab

# 进入容器调试
docker compose exec web sh

# 检查端口占用
netstat -tlnp | grep -E '80|1234'
```
