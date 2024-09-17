import {
	TextField as _TextField,
	type FormControlErrorMessageProps,
	type PolymorphicProps,
} from "@kobalte/core"
import {
	type TextFieldInputProps,
	type TextFieldLabelProps,
	type TextFieldRootProps,
} from "@kobalte/core/text-field"
import { mergeProps, type ValidComponent } from "solid-js"
import { twMerge } from "tailwind-merge"

export function TextField<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TextFieldRootProps<T>>
) {
	const finalProps = mergeProps(props, {
		get class() {
			return props["class"] ?
					twMerge(TextField.className, props["class"])
				:	TextField.className
		},
	})

	return <_TextField.Root {...finalProps} />
}
// @tw
TextField.className =
	"flex flex-col [&_[data-slot=label]]:[&:has([data-slot=input]:required)]:after:content-['_*']"

function Label<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, TextFieldLabelProps<T>>
) {
	const finalProps = mergeProps(props, {
		get class() {
			return props["class"] ?
					twMerge(Label.className, props["class"])
				:	Label.className
		},
	})

	return (
		<_TextField.Label
			data-slot="label"
			{...finalProps}
		/>
	)
}
// @tw
Label.className =
	"font-[Inter] font-medium leading-6 after:text-reimu-700 after:text-sm"
TextField.Label = Label

function Input<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, TextFieldInputProps<T>>
) {
	const finalProps = mergeProps(props, {
		get class() {
			return props["class"] ?
					twMerge(Input.className, props["class"])
				:	Input.className
		},
	})
	return (
		<_TextField.Input
			data-slot="input"
			{...finalProps}
		/>
	)
}

Input.className = [
	"py-1 pl-3 ",
	// @tw
	"block border-0 bg-transparent rounded-md text-gray-900 placeholder:text-slate-400 sm:text-sm sm:leading-6 ",
].join(" ")
TextField.Input = Input
TextField.InputContainer = {
	className:
		// @tw
		"ring-1 rounded-md ring-inset ring-slate-300 focus-within:ring-inset focus-within:ring-reimu-700 aria-invalid:ring-2 aria-invalid:ring-reimu-700 has-[[aria-invalid]]:ring-2 has-[[aria-invalid]]:ring-reimu-700",
}

function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FormControlErrorMessageProps<T>>
) {
	const finalProps = mergeProps(props, {
		get class() {
			return props["class"] ?
					twMerge(ErrorMessage.className, props["class"])
				:	ErrorMessage.className
		},
	})
	return <_TextField.ErrorMessage {...finalProps} />
}
ErrorMessage.className = "text-reimu-700 text-sm"
TextField.ErrorMessage = ErrorMessage
