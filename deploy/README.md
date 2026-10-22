# Деплой

Сайт: https://retrolaunch.denisenkosergey.ru (сервер denisenkosergey.ru, Ubuntu 22.04, nginx 1.18).

```bash
./deploy/deploy.sh
```

- Файлы сайта: `/var/www/retrolaunch`.
- nginx: `/etc/nginx/sites-available/retrolaunch` (копия с сервера — `deploy/nginx/retrolaunch.conf`,
  вместе с блоками SSL и редиректом, которые добавил certbot) и `/etc/nginx/snippets/retrolaunch-headers.conf`.
- SSL: Let's Encrypt через certbot (установщик nginx). Автопродление — systemd-таймер
  `snap.certbot.renew.timer` (дважды в день), после продления certbot сам перезагружает nginx.
  Проверка: `certbot renew --dry-run`.
- Заголовки COOP/COEP обязательны: без них The Ur-Quan Masters не запустится.
