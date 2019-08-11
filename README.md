# test-io

Полезная штука: https://marketplace.visualstudio.com/items?itemName=Flixs.vs-code-http-server-and-html-preview

NodeJs v10.16.1 и npm: https://nodejs.org/en/download/

После установки в директории проекта `npm install`, после чего в Terminal/Run Task... заработают задачи:

 - `tsc:watch` и `tsc:build` - компилировать все файлы из `src/` в `compile/`.
 - `concat:watch` и `concat:build` - откомпилированные файлы из `compile/` конкатинирует в `static/js/`

