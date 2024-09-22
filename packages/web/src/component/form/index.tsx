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
import { createMemo, type JSX, mergeProps, type ValidComponent } from "solid-js"

import { twMerge } from "tailwind-merge"

const SmartSelectorCanAutoAddAsteriskAfterLabelOfRequiredField =
	"[&_[data-slot=label]]:[&:has([data-slot=input]:required)]:after:content-['_*']"

const RequiredAsteriskClassName = "after:text-reimu-700 after:text-sm"

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

export const Asterisk = {
	className: RequiredAsteriskClassName,
}

export const FieldSet = (
	props: JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>
) => {
	const className = createMemo(() =>
		props.class ? twMerge(FieldSet.className, props.class) : FieldSet.className
	)

	return (
		<fieldset
			{...props}
			class={className()}></fieldset>
	)
}
// @tw
FieldSet.className = "border-b border-slate-300 pb-12"

const _Label = {
	// @tw
	className: `font-inter font-medium leading-6 ${RequiredAsteriskClassName}`,
}

export { _Label as Label }

export const Legend = {
	className: "font-inter text-base font-semibold leading-7 text-gray-900",
}
FieldSet.Legend = Legend

const _ErrMsg = {
	className: "text-reimu-700 text-sm",
}

export { _ErrMsg as ErrorMessage }

const _Input = {
	className: [
		// @tw
		"py-1.5 pl-3",
		// @tw
		"block border-0 bg-transparent rounded-md text-gray-900 placeholder:text-slate-400 sm:text-sm sm:leading-6 ",
	].join(" "),
}

export { _Input as Input }

const RadioGroupLabel = (props: JSX.LabelHTMLAttributes<HTMLLabelElement>) => {
	const className = createMemo(() =>
		props.class ?
			twMerge(RadioGroupLabel.className, props.class)
		:	RadioGroupLabel.className
	)

	return (
		// eslint-disable-next-line jsx-a11y/label-has-associated-control
		<label
			{...props}
			class={className()}></label>
	)
}

RadioGroupLabel.className = "block text-sm font-medium leading-6"

export const RadioGroup = {
	className: "",
	Label: {
		className: _Label.className,
	},
	Container: {
		className: "mt-6 space-y-6",
	},
	Item: {
		className: "flex items-center gap-x-3",
		Input: {
			// @tw
			className: "size-4 border-slate-400 text-reimu-700 focus:ring-reimu-700",
		},
	},
	ItemLabel: RadioGroupLabel,
}

export const Form = {
	Asterisk,
	Label: _Label,
	Legend,
	Input: _Input,
	ErrorMessage: _ErrMsg,
	RadioGroup,
	TextField,
}

// @tw
TextField.className = `flex flex-col ${SmartSelectorCanAutoAddAsteriskAfterLabelOfRequiredField}`

function TextFieldLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, TextFieldLabelProps<T>>
) {
	const finalProps = mergeProps(props, {
		get class() {
			return props["class"] ?
					twMerge(TextFieldLabel.className, props["class"])
				:	TextFieldLabel.className
		},
	})

	return (
		<_TextField.Label
			data-slot="label"
			{...finalProps}
		/>
	)
}

TextFieldLabel.className = Form.Label.className
TextField.Label = TextFieldLabel

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

Input.className = _Input.className
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
ErrorMessage.className = Form.ErrorMessage.className
TextField.ErrorMessage = ErrorMessage
