import { useNavigate } from "@tanstack/solid-router"
import type { Tag } from "@thc/api"
import { TagMutation } from "@thc/query"
import type { InferOutput } from "valibot"

import type { NewTagCorrection } from "~/domain/tag"

type Props =
	| {
			type: "new"
	  }
	| {
			type: "edit"
			tag: Tag
	  }

export function createTagFormSubmission(props: Props) {
	const navigator = useNavigate()
	const mutation = TagMutation.getInstance()

	const handleSubmit = (output: InferOutput<typeof NewTagCorrection>) => {
		if (props.type === "new") {
			mutation.mutate(
				{ type: "Create", data: output },
				{
					onSuccess() {
						void navigator({ to: `/` })
					},
					onError(error) {
						if (import.meta.env.DEV) {
							console.error("Failed to create tag:", error)
						}
					},
				},
			)
			return
		}

		mutation.mutate(
			{ type: "Update", id: props.tag.id, data: output },
			{
				onSuccess() {
					void navigator({ to: `/tag/${props.tag.id}` })
				},
				onError(error) {
					if (import.meta.env.DEV) {
						console.error("Failed to update tag:", error)
					}
				},
			},
		)
	}

	return {
		handleSubmit,
		mutation,
	}
}
