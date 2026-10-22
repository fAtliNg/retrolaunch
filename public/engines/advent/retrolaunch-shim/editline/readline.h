/* Retrolaunch: замена libedit для сборки Open Adventure под браузер (Emscripten) */
#pragma once
char *readline(const char *prompt);
void add_history(const char *line);
