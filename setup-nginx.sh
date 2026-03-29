#!/bin/bash
# Настройка Nginx + HTTPS для GigaChat Proxy
# Использование: bash setup-nginx.sh api.npdetail.ru

set -e

DOMAIN=${1:-"api.npdetail.ru"}
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}❌ Запустите от root (sudo -i)${NC}"
  exit 1
fi

echo -e "${YELLOW}🔧 Настройка Nginx для $DOMAIN${NC}"

# Установка Nginx
echo -e "${YELLOW}📦 Установка Nginx...${NC}"
apt install -y nginx > /dev/null 2>&1
echo -e "${GREEN}✅ Nginx установлен${NC}"

# Установка Certbot
echo -e "${YELLOW}📦 Установка Certbot...${NC}"
apt install -y certbot python3-certbot-nginx > /dev/null 2>&1
echo -e "${GREEN}✅ Certbot установлен${NC}"

# Конфигурация Nginx
echo -e "${YELLOW}📝 Создание конфигурации Nginx...${NC}"
cat > /etc/nginx/sites-available/gigachat-proxy << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/gigachat-proxy /etc/nginx/sites-enabled/
nginx -t > /dev/null 2>&1
systemctl restart nginx
echo -e "${GREEN}✅ Nginx настроен${NC}"

# Получение SSL сертификата
echo -e "${YELLOW}🔒 Получение SSL сертификата...${NC}"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@npdetail.ru > /dev/null 2>&1 || {
  echo -e "${YELLOW}⚠️  Certbot не сработал автоматически${NC}"
  echo -e "${YELLOW}📝 Запустите вручную:${NC}"
  echo "   certbot --nginx -d $DOMAIN"
}

echo -e "${GREEN}✅ Настройка завершена!${NC}"
echo ""
echo -e "${YELLOW}🔗 HTTPS: https://$DOMAIN${NC}"
echo -e "${YELLOW}📊 Статус Nginx: systemctl status nginx${NC}"
echo -e "${YELLOW}📝 Логи: tail -f /var/log/nginx/error.log${NC}"
