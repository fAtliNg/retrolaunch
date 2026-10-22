/*
 * Retrolaunch: readline для браузера. Строка ввода приходит со страницы
 * через Module.retroReadLine (Promise), Asyncify приостанавливает игру на время ожидания.
 */
#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>
#include "editline/readline.h"

EM_ASYNC_JS(char *, js_readline, (const char *prompt), {
  const line = await Module.retroReadLine(UTF8ToString(prompt));
  if (line === null) return 0;
  const size = lengthBytesUTF8(line) + 1;
  const ptr = _malloc(size);
  stringToUTF8(line, ptr, size);
  return ptr;
});

char *readline(const char *prompt) {
	fflush(stdout);
	return js_readline(prompt);
}

void add_history(const char *line) {
	(void)line;
}
