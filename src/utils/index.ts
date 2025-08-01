export function sleep(sec: number) {
	return new Promise((res) => setTimeout(res, sec))
}

export function tw(cls: string) {
	return cls.replaceAll(/\s+/g, " ").trim()
}

export function todo(msg?: string): never {
	throw new Error(msg ?? "TODO")
}
