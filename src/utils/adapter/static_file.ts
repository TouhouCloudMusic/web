// TODO: TypeScript 5.9 control flow generics
export function imgUrl<T extends string | URL | undefined>(
	subDir?: T
): T extends undefined ? undefined : string {
	if (!subDir) return undefined as any;

	// 处理本地路径
	if (subDir.toString().startsWith('/')) {
		return subDir.toString() as any;
	}

	// 处理远程路径
	const baseUrl = new URL(
		import.meta.env.VITE_SERVER_URL ?? window.location.origin
	);
	return new URL(subDir.toString(), baseUrl).toString() as any;
}
