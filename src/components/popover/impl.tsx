import { type PolymorphicProps } from "@kobalte/core"
import { Popover } from "@kobalte/core/popover";
import {
  type PopoverCloseButtonProps,
  type PopoverContentProps,
  type PopoverDescriptionProps,
  type PopoverTitleProps,
  type PopoverRootProps,
} from "@kobalte/core/popover"
import {
  createContext,
  type JSX,
  mergeProps,
  splitProps,
  type ValidComponent,
} from "solid-js"
import { twMerge } from "tailwind-merge"
import { Button } from "~/components/button"

export type RootProps = PopoverRootProps & Context
type Context = {
  blur?: boolean | undefined
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
  const CLASS = `
  bg-primary fixed z-50 rounded-md p-4 shadow-lg shadow-gray-300
  animate-scale-fade-out data-expanded:animate-scale-fade-in
  `

  let local_props = mergeProps(props, {
    get class() {
      return twMerge(CLASS, props["class"])
    },
  })

  return <Popover.Content {...local_props} />
}

type CloseButtonProps<T extends ValidComponent = typeof Button> =
  PolymorphicProps<T, PopoverCloseButtonProps<"button">>

export function CloseButton<T extends ValidComponent = typeof Button>(
  props: CloseButtonProps<T>,
) {
  return (
    <Popover.CloseButton
      {...props}
      as={props.as ?? Button}
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

export function Description<T extends ValidComponent = "p">(
  props: PolymorphicProps<T, PopoverDescriptionProps<T>>,
) {
  const CLASS = "mt-2 pr-2 text-sm text-gray-800"

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