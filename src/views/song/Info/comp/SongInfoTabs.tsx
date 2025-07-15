/* @refresh skip */
import { For } from "solid-js"

import { Tab } from "~/components/common"
import { assertContext } from "~/utils/context"

import { SongContext } from ".."

const TABS = ["Credit"] as const
type Tabs = (typeof TABS)[number]
export function SongInfoTabs() {
	return (
		<Tab.Root>
			<Tab.List>
				<For each={TABS}>
					{(tabType) => (
						<li>
							{/* TODO: Refactor this to a component */}
							<Tab.Trigger
								class="text-md size-full px-4 py-2.5 text-slate-800"
								value={tabType}
							>
								{tabType}
							</Tab.Trigger>
						</li>
					)}
				</For>
				<Tab.Indicator />
			</Tab.List>
			<Tab.Content<Tabs> value="Credit">
				<CreditTab />
			</Tab.Content>
		</Tab.Root>
	)
}

function CreditTab() {
	const ctx = assertContext(SongContext)

	return <>TODO</>
}
