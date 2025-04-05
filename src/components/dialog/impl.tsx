import { Dialog, type PolymorphicProps } from "@kobalte/core"
import {
  type DialogCloseButtonProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogOverlayProps,
  type DialogTitleProps,
  type DialogRootProps,
} from "@kobalte/core/dialog"
import {
  createContext,
  type JSX,
  mergeProps,
  splitProps,
  type ValidComponent,
} from "solid-js"
import { twMerge } from "tailwind-merge"
import { Button } from "~/components/button"
import { useContextUnsave } from "~/lib/context"

export type RootProps = DialogRootProps & Context
type Context = {
  blur?: boolean | undefined
}

const Context = createContext<Context>()

export function Root(props: RootProps) {
  return <Context.Provider value={props}>{props.children}</Context.Provider>
}

export const Trigger = Dialog.Trigger

export const Portal = Dialog.Portal

export type OverlayProps<T extends ValidComponent> = PolymorphicProps<
  T,
  DialogOverlayProps<T>
>

export function Overlay<T extends ValidComponent = "div">(
  props: OverlayProps<T>,
) {
  const CLASS = `
    fixed inset-0 z-50 bg-slate-900/20
    animate-fade-out data-expand:animate-fade-in
    `
  let context = useContextUnsave(Context)

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(
        CLASS,
        props["class"],
        context.blur &&
          `
          backdrop-blur-none data-expand:backdrop-blur-md
          animate-blur-in data-expand:animate-blur-out
          `,
      )
    },
  })

  return <Dialog.Overlay {...local_props} />
}

export type ContentProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  DialogContentProps<T>
>

export function Content<T extends ValidComponent = "div">(
  props: ContentProps<T>,
) {
  const CLASS = `
  bg-primary fixed inset-0 z-50 m-auto rounded-md p-4 shadow-lg shadow-gray-300
  animate-scale-fade-in data-expand:animate-scale-fade-out
  `

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS, props["class"])
    },
  })

  return <Dialog.Content {...local_props} />
}

type CloseButtonProps<T extends ValidComponent = typeof Button> =
  PolymorphicProps<T, DialogCloseButtonProps<"button">>

export function CloseButton<T extends ValidComponent = typeof Button>(
  props: CloseButtonProps<T>,
) {
  return (
    <Dialog.CloseButton
      {...props}
      as={props.as ?? Button}
    />
  )
}

export function Title<T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DialogTitleProps<T>>,
) {
  const CLASS = "font-medium"

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS, props["class"])
    },
  })

  return <Dialog.Title {...local_props} />
}

export function Description<T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) {
  const CLASS = "mt-2 pr-2 text-sm text-gray-800"

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS, props["class"])
    },
  })
  return <Dialog.Description {...local_props} />
}

export type LayoutProps = RootProps & {
  trigger: JSX.Element
}
/**
 * A pre-made dialog layout
 *
 * @example
 * ```tsx
 * <Dialog.Layout
 *     trigger={<Button><PlusIcon /></Button>}
 * >
 *     <Dialog.Content>
 *         <Dialog.Title>Dialog Title</Dialog.Title>
 *         <Dialog.Description>Dialog Description</Dialog.Description>
 *         <Dialog.CloseButton>Close</Dialog.CloseButton>
 *     </Dialog.Content>
 * </Dialog.Layout>
 * ```
 */
export function Layout(props: LayoutProps) {
  let [_, root_props] = splitProps(props, ["children", "trigger"])

  return (
    <Root {...root_props}>
      <Trigger>{props.trigger}</Trigger>
      <Portal>
        <Overlay />
        {props.children}
      </Portal>
    </Root>
  )
}
