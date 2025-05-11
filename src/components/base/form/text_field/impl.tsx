import { type PolymorphicProps, TextField as K_TextField } from "@kobalte/core"
import {
	type TextFieldInputProps,
	type TextFieldRootProps,
} from "@kobalte/core/text-field"
import {
	createContext,
	createEffect,
	mergeProps,
	type ValidComponent,
} from "solid-js"
import { createStore, produce } from "solid-js/store"
import { twMerge } from "tailwind-merge"
import type { SafeOmit } from "~/types"
import { assertContext } from "~/utils/context"

import { LABEL_CLASSNAME } from "../label"

const TEXT_INPUT_CLASS = `flex flex-col`

type ContextStore = {
	inputId?: string | undefined
}

type Context = {
	required?: boolean | undefined
	setInputId: (str: string) => void
} & ContextStore

const Context = createContext<Context>()

type RootProps<T extends ValidComponent = "div"> = PolymorphicProps<
	T,
	TextFieldRootProps<T>
>

export function Root<T extends ValidComponent = "div">(props: RootProps<T>) {
	const localProps = mergeProps(props, {
		get class() {
			return props["class"] ?
					twMerge(TEXT_INPUT_CLASS, props["class"])
				:	TEXT_INPUT_CLASS
		},
	})

	const [contextStore, setContextStore] = createStore<ContextStore>()

	return (
		<Context.Provider
			value={{
				get required() {
					return props.required
				},
				get inputId() {
					return contextStore.inputId
				},
				setInputId(val: string) {
					setContextStore(
						produce((v) => {
							v.inputId = val
						}),
					)
				},
			}}
		>
			<K_TextField.Root {...localProps} />
		</Context.Provider>
	)
}

// @tw
const INPUT_CLASS_NAME = twMerge(
	"py-1.5 pl-3 block border-0 bg-transparent text-slate-900 placeholder:text-fg-tertiary sm:text-sm sm:leading-6 focus-within:ring-reimu-700 aria-invalid:ring-2 aria-invalid:ring-reimu-700 has-aria-[invalid]:ring-reimu-700 rounded-md ring-1 ring-inset focus-within:ring-inset has-aria-[invalid]:ring-2",
)

export function Input(
	props: PolymorphicProps<"input", TextFieldInputProps<"input">>,
) {
	const context = assertContext(Context)

	createEffect(() => {
		if (props.id) {
			context.setInputId(props.id)
		}
	})

	const finalProps = mergeProps(props, {
		get class() {
			return props.class ?
					twMerge(INPUT_CLASS_NAME, props.class)
				:	INPUT_CLASS_NAME
		},
	})

	return <K_TextField.Input {...finalProps} />
}

type LabelProps = SafeOmit<
	PolymorphicProps<"label", K_TextField.TextFieldLabelProps<"label">>,
	"for"
>
export function Label(props: LabelProps) {
	const context = assertContext(Context)

	const finalProps = mergeProps(props, {
		get class() {
			return props.class ?
					twMerge(LABEL_CLASSNAME, props.class)
				:	LABEL_CLASSNAME
		},
		get for() {
			return context.inputId
		},
	})

	return <K_TextField.Label {...finalProps} />
}
