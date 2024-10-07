import { error } from "elysia"

export const Response = {
	ok<T>(data: T) {
		return {
			state: "success" as const,
			data,
		}
	},
	err<T extends number>(code: T, messaage: string) {
		return error(code, { state: "error", message: messaage })
	},
	notFound(message?: string) {
		return error(404, {
			state: "error",
			message: message ?? "404 Not Found",
		})
	},
	internalServerError(message?: string) {
		return error(500, {
			state: "error",
			message: message ?? "Internal Server Error",
		})
	},
}
