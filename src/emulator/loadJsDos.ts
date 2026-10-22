/**
 * js-dos грузится только когда игрок нажал «Запустить игру»: это ~1 МБ скрипта и стилей
 * плюс WebAssembly-эмулятор. Файлы лежат в public/vendor (см. scripts/copy-jsdos.mjs).
 */
export const jsDosBase = `${import.meta.env.BASE_URL}vendor/js-dos/${__JSDOS_VERSION__}/`

let loading: Promise<DosFn> | undefined

export function loadJsDos(): Promise<DosFn> {
  loading ??= new Promise<DosFn>((resolve, reject) => {
    // Стили js-dos содержат глобальный сброс Tailwind. В отдельном слое они всегда
    // уступают стилям сайта и не ломают вёрстку.
    const style = document.createElement('style')
    style.textContent = `@import url("${jsDosBase}js-dos.css") layer(jsdos);`
    document.head.append(style)

    const script = document.createElement('script')
    script.src = `${jsDosBase}js-dos.js`
    script.async = true
    script.onload = () => (window.Dos ? resolve(window.Dos) : reject(new Error('js-dos не найден')))
    script.onerror = () => reject(new Error('Не удалось загрузить js-dos'))
    document.head.append(script)
  }).catch((error) => {
    // Следующая попытка начнёт загрузку заново
    loading = undefined
    throw error
  })

  return loading
}
