import { error, ERROR_CODE } from "elysia"

export const Result = {
	ok<T>(data: T) {
		return {
			state: "success" as const,
			data,
		}
	},
	err<T extends number>(code: T, messaage: string) {
		return error(code, { state: "error" as const, message: messaage })
	},
}
