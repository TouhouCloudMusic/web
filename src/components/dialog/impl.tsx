import { Dialog, type PolymorphicProps } from "@kobalte/core"
import {
  type DialogCloseButtonProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogOverlayProps,
  type DialogTitleProps,
  type DialogRootProps,
} from "@kobalte/core/dialog"
import { type JSX, mergeProps, splitProps, type ValidComponent } from "solid-js"
import { twMerge } from "tailwind-merge"
import { Button } from "~/components/button"

export type RootProps = DialogRootProps

export function Root(props: RootProps) {
  return <Dialog.Root>{props.children}</Dialog.Root>
}

export const Trigger = Dialog.Trigger

export const Portal = Dialog.Portal

export type OverlayProps<T extends ValidComponent> = PolymorphicProps<
  T,
  DialogOverlayProps<T>
> & {
  "data-blur"?: boolean | undefined
}

export function Overlay<T extends ValidComponent = "div">(
  props: OverlayProps<T>,
) {
  const CLASS = `
    fixed inset-0 z-50 bg-slate-900/20
    animate-fade-in data-expand:animate-fade-out
    data-blur:backdrop-blur-none data-blur:data-expanded:backdrop-blur-2xs
    data-blur:animate-blur-out data-blur:data-expanded:animate-blur-in
    `

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS, props["class"])
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
  animate-scale-fade-out data-expanded:animate-scale-fade-in
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
  backgroundBlur?: boolean | undefined
}
/**
 * A pre-made dialog layout
 *
 * @example
 * ```typescriptreact
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
        <Overlay data-blur={props.backgroundBlur} />
        {props.children}
      </Portal>
    </Root>
  )
}
