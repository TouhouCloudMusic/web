import { Dialog, type PolymorphicProps } from "@kobalte/core"
import {
  type DialogCloseButtonProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogOverlayProps,
  type DialogRootProps as K_DialogRootProps,
  type DialogTitleProps,
} from "@kobalte/core/dialog"
import {
  createMemo,
  type JSX,
  type ParentProps,
  splitProps,
  type ValidComponent,
} from "solid-js"
import { twMerge } from "tailwind-merge"
import { Button, type Props } from "~/components/button"

// 为啥这地方原来没有导出。？
export type RootProps = K_DialogRootProps

export const Root = Dialog.Root

export const Trigger = Dialog.Trigger

export const Portal = Dialog.Portal

export const Overlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogOverlayProps<T>>,
) => {
  const CLASS = "dialog__overlay fixed inset-0 z-50 bg-slate-900/10"

  let class_name = createMemo(() => twMerge(CLASS, props["class"]))

  return (
    <Dialog.Overlay
      {...props}
      class={class_name()}
    />
  )
}

export function Content<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogContentProps<T>>,
) {
  const CLASS =
    "dialog__content bg-primary fixed inset-0 z-50 m-auto rounded-md p-4 shadow-lg shadow-gray-300"

  let class_name = createMemo(() => twMerge(CLASS, props["class"]))

  return (
    <Dialog.Content
      {...props}
      class={class_name()}
    />
  )
}

interface CloseButtonProps
  extends Omit<
      PolymorphicProps<"button", DialogCloseButtonProps<"button">>,
      "color" | "type"
    >,
    Props {}

export function CloseButton(props: CloseButtonProps) {
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
  const CLASS = "dialog__title font-medium"

  let class_name = createMemo(() => twMerge(CLASS, props["class"]))

  return (
    <Dialog.Title
      {...props}
      class={class_name()}
    />
  )
}

export function Description<T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) {
  const CLASS = "dialog__description mt-2 pr-2 text-sm text-gray-800"

  let class_name = createMemo(() => twMerge(CLASS, props["class"]))

  return (
    <Dialog.Description
      {...props}
      class={class_name()}
    />
  )
}

export function Action<T extends ValidComponent = "div">(
  props: ParentProps<PolymorphicProps<T>>
) {
  if (!props.children) return null;

  const CLASS = "dialog__action gap-2 flex justify-end";

  let class_name = createMemo(() => twMerge(CLASS, props["class"]));

  return (
    <div class={class_name()}>
      {props.children}
    </div>
  );
}

type LayoutProps = ParentProps &
  K_DialogRootProps & {
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
