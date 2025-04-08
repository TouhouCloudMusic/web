import { type PolymorphicProps } from "@kobalte/core"
import { Popover, PopoverArrowProps } from "@kobalte/core/popover";
import {
  type PopoverCloseButtonProps,
  type PopoverContentProps,
  type PopoverDescriptionProps,
  type PopoverTitleProps,
  type PopoverRootProps,
} from "@kobalte/core/popover"
import {
  Show,
  createContext,
  type JSX,
  mergeProps,
  splitProps,
  type ValidComponent,
  createMemo,
} from "solid-js"
import { twMerge } from "tailwind-merge"
import { Button } from "~/components/button"

export type RootProps = PopoverRootProps & Context
type Context = {
  blur?: boolean | undefined
  title?: string | undefined
  description?: string | undefined
}

const Context = createContext<Context>()

export function Root(props: RootProps) {
  return (
    <Popover {...props}>
      <Context.Provider value={props}>{props.children}</Context.Provider>
    </Popover>
  )
}

export const Trigger = Popover.Trigger
export const Portal = Popover.Portal

export type ContentProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  PopoverContentProps<T>
>

export function Content<T extends ValidComponent = "div">(
  props: ContentProps<T>,
) {

  const CLASS = createMemo(() => `
  bg-primary fixed z-50 rounded-md p-4 border-[1.5px] border-gray-300
  animate-scale-down data-expanded:animate-scale-up
  origin-(--kb-popper-content-transform-origin)
  `)

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS(), props["class"])
    },
  })

  return <Popover.Content {...local_props} />
}

type CloseButtonProps<T extends ValidComponent = typeof Button> =
  PolymorphicProps<T, PopoverCloseButtonProps<"button">> & {
    as?: T
  }

export function CloseButton<T extends ValidComponent = typeof Button>(
  props: CloseButtonProps<T>,
) {
  return (
    <Popover.CloseButton
      {...props}
      as={Button}
    />
  )
}

export function Title<T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, PopoverTitleProps<T>>,
) {
  const CLASS = "font-medium"

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS, props["class"])
    },
  })

  return <Popover.Title {...local_props} />
}

export function Arrow(props: PolymorphicProps<"div", PopoverArrowProps>) {
  return <Popover.Arrow {...props} />
}

export function Description<T extends ValidComponent = "p">(
  props: PolymorphicProps<T, PopoverDescriptionProps<T>>,
) {
  const CLASS = "my-2 pr-2 text-sm text-gray-800"

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS, props["class"])
    },
  })
  return <Popover.Description {...local_props} />
}

export type LayoutProps = RootProps & {
  trigger: JSX.Element
}
/**
 * A pre-made popover layout
 *
 * @example
 * ```tsx
 * <Popover.Layout
 *     trigger={<Button><PlusIcon /></Button>}
 * >
 *     <Popover.Content>
 *         <Popover.Title>Popover Title</Popover.Title>
 *         <Popover.Description>Popover Description</Popover.Description>
 *         <Popover.CloseButton>Close</Popover.CloseButton>
 *     </Popover.Content>
 * </Popover.Layout>
 * ```
 */
export function Layout(props: LayoutProps) {
  let [_, root_props] = splitProps(props, ["children", "trigger"])

  return (
    <Root {...root_props}>
      <Trigger>{props.trigger}</Trigger>
      <Portal>
        {props.children}
      </Portal>
    </Root>
  )
}
