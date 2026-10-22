# Windows-игры (Win 9x + 3dfx) в Retrolaunch

Как подготовить пакет `.jsdos` с Windows-игрой на примере Need for Speed III: Hot Pursuit (PC).
Сайт для этого уже готов: плеер умеет DOSBox-X и эмуляцию 3dfx Voodoo через WebGL, а NFS 3 в
`public/data/games.json` ждёт файл `local-games/nfs-3.jsdos`.

## Что нужно

- **Образ своего диска с игрой.** Снимается с оригинального CD в Дисковой утилите macOS:
  «Файл → Новый образ → Образ из „<диск>“», формат «Мастер-диск CD/DVD» (`.cdr`). Расширение
  `.cdr` можно поменять на `.iso`. Скачанные «релизы» и репаки не используем.
- **Windows 98.** Либо свой установочный диск с ключом, либо готовый базовый образ из
  js-dos Game Studio. Лицензионный статус готовых образов не очевиден — решение за владельцем
  проекта.
- **Драйвер 3dfx 3.01 и DirectX 6 или 7** — ссылки на странице
  [js-dos: Windows 9x](https://js-dos.com/win9x-sockdrive.html), раздел «Useful files».

## Сборка пакета в Game Studio

Вся установка идёт в браузере, в [js-dos Game Studio](https://v8.js-dos.com/studio).
Подробно — [Windows 9x](https://js-dos.com/win9x-sockdrive.html),
[Install OS](https://js-dos.com/install-os.html) и [3Dfx](https://js-dos.com/3dfx.html).

1. Открыть Game Studio, выбрать базовый образ Windows 98, нажать Load, затем Run.
2. В панели файлов (иконка диска) загрузить образ игры и папку с драйвером 3dfx.
3. Подключить их и загрузить Windows:
   ```
   imgmount d nfs3.iso
   boot c:
   ```
4. Установить драйвер Voodoo: «Панель управления → Система → Диспетчер устройств», найти
   «PCI Multimedia Device» или «3Dfx Voodoo», «Обновить драйвер», указать папку с драйвером.
   Перезагрузиться.
5. Установить DirectX 6 или 7 (Voodoo 1 плохо дружит с более новыми версиями).
6. Установить NFS 3 с диска D:. В «3D Device Setup» игры выбрать устройство 3dfx, а не
   программный рендеринг.
7. В конфигурации DOSBox (Studio → конфигурация) проверить секции:
   ```ini
   [dosbox]
   memsize=128

   [cpu]
   cputype=pentium_mmx
   core=auto
   integration device=true

   [video]
   vmemsize=8

   [voodoo]
   voodoo_card=opengl
   glide=false
   ```
   и в `[autoexec]` оставить подключение диска и загрузку Windows:
   ```
   imgmount d nfs3.iso
   boot c:
   ```
   Если игра падает в случайные моменты — поставить `cputype=pentium` (без MMX).
8. Удалить временные файлы (кнопка корзины), перезапустить, проверить игру. В статистике
   js-dos должно быть `Glide GL (3D): Yes`.
9. Выгрузить пакет (кнопка загрузки) и сохранить как `local-games/nfs-3.jsdos`.

## Запуск

```bash
npm run dev
```

Открыть `/games/nfs-3` и нажать «Запустить игру». Если файла нет, плеер подскажет, куда его
положить.

## Почему только локально

Папка `local-games/` в `.gitignore`, а `vite.config.ts` отдаёт её только dev-сервером: в
`npm run build` и на сайт она не попадает. Игра с `"localOnly": true` в production-сборке
показывается как «скоро». Выкладывать NFS 3 публично нельзя даже со своего диска — это
раздача игры EA.

Пакеты, собранные из базовых образов Game Studio, используют sockdrive и могут подгружать
части образа с серверов js-dos. Для публикации у js-dos есть отдельная инструкция
«Publish Sockdrive».
