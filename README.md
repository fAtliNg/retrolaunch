# Retrolaunch

Старые компьютерные игры, которые запускаются прямо в браузере.

Стек: React 19, TypeScript, Vite, React Router, Redux Toolkit (RTK Query).

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:5173.

Сборка для продакшена: `npm run build`, результат в папке `dist`.

## Структура

```
public/data/games.json   каталог игр (пока статичный JSON)
src/services/gamesApi.ts RTK Query: загрузка каталога и страницы игры
src/app/store.ts         Redux store
src/components/          шапка, подвал, карточка-коробка, диск, обложка
src/pages/               главная, страница игры, 404
src/types/game.ts        типы игры и подписи платформ
src/config.ts            ссылка на автора
```

## Как добавить игру

Добавьте объект в `public/data/games.json`. Поле `cover` задаёт цвета обложки,
которая рисуется кодом. Страница игры появится по адресу `/games/<slug>`.

## Деплой

Это SPA: на хостинге все неизвестные пути нужно отдавать `index.html`,
иначе прямые ссылки вида `/games/nfs-3` будут отдавать 404.

Автор: [Сергей Денисенко](https://denisenkosergey.ru)
