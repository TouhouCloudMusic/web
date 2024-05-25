import { Title } from "@solidjs/meta"

export default function HomePage() {
	const linkClass = "text-blue-800 hover:text-blue-700 dark:text-blue-900"

	return (
		<main class="flex justify-center">
			<div class="w-[60rem] bg-white">
				<Title>Hello World</Title>
				<ul class="my-2 flex flex-col gap-2 text-gray-1000">
					<li>
						<a
							href="/song/example"
							class="text-blue-900">
							song
						</a>
					</li>
					<li>
						<a
							href="/user/dev"
							class="text-gray-1000">
							user
						</a>
					</li>
					<li>
						<a
							href="/theme"
							class="text-gray-1000">
							theme
						</a>
					</li>
				</ul>
			</div>
		</main>
	)
}
