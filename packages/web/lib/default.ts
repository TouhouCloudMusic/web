export function default_constructor<T>(val: T): T {
	if (val === null) return null as T
	if (typeof val === "string") return "" as T
	if (typeof val === "number") return 0 as T
	if (typeof val === "bigint") return BigInt(0) as T
	if (typeof val === "boolean") return false as T
	if (typeof val === "symbol") return Symbol("") as T
	if (typeof val === "function") return default_constructor(val()) as T
	if (typeof val === "object") return new Object() as T
	else return val
	// else throw new Error("Unable to set default value for Option")
}
