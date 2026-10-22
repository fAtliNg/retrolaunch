# local-games

Пакеты `.jsdos` с играми со своих дисков. Папка не попадает в Git и в сборку сайта:
файлы отдаёт только dev-сервер (`npm run dev`) по адресу `/local-games/<файл>`.

Игра подключается в `public/data/games.json` с `"localOnly": true`, например:

```json
"emulator": {
  "engine": "js-dos",
  "bundle": "local-games/nfs-3.jsdos",
  "backend": "dosboxX",
  "voodoo": true,
  "localOnly": true
}
```

Как собрать пакет с Windows-игрой — в [docs/windows-games.md](../docs/windows-games.md).
