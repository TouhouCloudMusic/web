import { createContext } from "solid-js"
import { useContextUnsave } from "~/lib/context/index.ts"

import { type createController } from "../data/controller/index.ts"

export const ControllerContext =
  createContext<ReturnType<typeof createController>>()
export function useController() {
  return useContextUnsave(ControllerContext)
}
