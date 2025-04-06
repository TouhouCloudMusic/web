import { createMemo, onCleanup } from "solid-js"

export function createUrl(file: () => File) {
  let memo = createMemo(() => {
    let url = window.URL.createObjectURL(file())

    onCleanup(() => window.URL.revokeObjectURL(url))

    return url
  })

  return memo
}
