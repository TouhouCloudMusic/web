export function sleep(sec: number) {
	return new Promise((res) => setTimeout(res, sec))
}

export function tw(cls: string) {
	return cls.replace(/\s+/g, " ").trim()
}
