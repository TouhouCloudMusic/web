import { useNavigate } from "@tanstack/solid-router"
import type { Release } from "@thc/api"
import { ReleaseMutation } from "@thc/query"
import type { InferOutput } from "valibot"

import type { NewReleaseCorrection } from "~/domain/release"

type Props =
	| {
			type: "new"
	  }
	| {
			type: "edit"
			release: Release
	  }

export function useReleaseFormSubmission(props: Props) {
	const navigator = useNavigate()
	const mutation = ReleaseMutation.getInstance()

	function handleSubmit(data: InferOutput<typeof NewReleaseCorrection>) {
		if (props.type === "new") {
			mutation.mutate(
				{ type: "Create", data },
				{
					onSuccess() {
						void navigator({ to: "/" })
					},
				},
			)
		} else {
			mutation.mutate(
				{ type: "Update", id: props.release.id, data },
				{
					onSuccess() {
						void navigator({ to: `/release/${props.release.id}` })
					},
				},
			)
		}
	}

	return { handleSubmit, mutation }
}
