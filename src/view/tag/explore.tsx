import { useQuery } from "@tanstack/solid-query"
import { createSignal, For, Show } from "solid-js"

import { Link } from "~/component/atomic"
import { PageLayout } from "~/layout"
import { createMockTagTree } from "~/mock/tag"
import type { TagTreeNode } from "~/mock/tag"

const DEFAULT_DEPTH = 2
const ROOT_COUNT = 6
const MAX_DEPTH = 4
const MOCK_DELAY_RANGE_MS = [200, 600]

let sleep = (ms: number) => {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms)
	})
}

let mockDelayMs = () => {
	let min = MOCK_DELAY_RANGE_MS[0] ?? 0
	let max = MOCK_DELAY_RANGE_MS[1] ?? min
	let span = Math.max(0, max - min)
	return min + Math.floor(Math.random() * (span + 1))
}

export function TagExplore() {
	let [expandedIds, setExpandedIds] = createSignal<Set<number>>(new Set())
	let [hasInteracted, setHasInteracted] = createSignal(false)

	let seedExpanded = (data: TagTreeNode[]) => {
		if (hasInteracted()) return
		setExpandedIds(collectExpandedIds(data, DEFAULT_DEPTH))
	}

	let queryOptions = () => ({
		queryKey: ["tag::tree", ROOT_COUNT, MAX_DEPTH, DEFAULT_DEPTH],
		queryFn: async () => {
			await sleep(mockDelayMs())
			return createMockTagTree({
				rootCount: ROOT_COUNT,
				maxDepth: MAX_DEPTH,
				childCountRange: [1, 3],
			})
		},
		onSuccess: seedExpanded,
	})

	let treeQuery = useQuery(queryOptions)
	let nodes = () => treeQuery.data ?? []

	let toggleExpanded = (id: number, depth: number, expanded: boolean) => {
		setHasInteracted(true)
		if (0 === depth && expanded) {
			setExpandedIds(new Set<number>())
			return
		}
		setExpandedIds((prev) => {
			let next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}
			return next
		})
	}

	return (
		<PageLayout class="p-8">
			<div class="flex flex-col gap-6">
				<h1 class="text-2xl font-light tracking-tight text-slate-900">
					Tag Tree
				</h1>
				<Show
					when={!treeQuery.isLoading}
					fallback={<TagTreeSkeleton />}
				>
					<Show
						when={nodes().length > 0}
						fallback={<div class="text-sm text-tertiary">No tags</div>}
					>
						<div class="p-3">
							<TagTreeList
								nodes={nodes()}
								depth={0}
								expandedIds={expandedIds}
								onToggle={toggleExpanded}
							/>
						</div>
					</Show>
				</Show>
			</div>
		</PageLayout>
	)
}

type TagTreeListProps = {
	nodes: TagTreeNode[]
	depth: number
	expandedIds: () => Set<number>
	onToggle: (id: number, depth: number, expanded: boolean) => void
}

function TagTreeList(props: TagTreeListProps) {
	return (
		<ul class="flex flex-col gap-1">
			<For each={props.nodes}>
				{(node) => (
					<TagTreeNode
						node={node}
						depth={props.depth}
						expandedIds={props.expandedIds}
						onToggle={props.onToggle}
					/>
				)}
			</For>
		</ul>
	)
}

type TagTreeNodeProps = {
	node: TagTreeNode
	depth: number
	expandedIds: () => Set<number>
	onToggle: (id: number, depth: number, expanded: boolean) => void
}

function TagTreeNode(props: TagTreeNodeProps) {
	let hasChildren = () => props.node.children.length > 0
	let isExpanded = () => hasChildren() && props.expandedIds().has(props.node.id)
	let children = () => props.node.children
	let indentStyle = () => ({ "padding-left": `${props.depth * 16}px` })
	let toggleLabel = () => (isExpanded() ? "Collapse" : "Expand")

	let toggleNode = () => {
		if (!hasChildren()) return
		props.onToggle(props.node.id, props.depth, isExpanded())
	}

	return (
		<li>
			<div
				class="hover:bg-slate-50 flex items-center gap-2 rounded px-2 py-1"
				style={indentStyle()}
			>
				<Show
					when={hasChildren()}
					fallback={<span class="inline-flex h-5 w-5" />}
				>
					<button
						type="button"
						class="inline-flex h-5 w-5 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900"
						aria-label={toggleLabel()}
						aria-expanded={isExpanded()}
						onClick={toggleNode}
					>
						<Show
							when={isExpanded()}
							fallback={">"}
						>
							v
						</Show>
					</button>
				</Show>
				<div class="flex flex-col">
					<Link
						to="/tag/$id"
						params={{ id: props.node.id.toString() }}
						class="text-sm text-slate-900 no-underline hover:underline"
					>
						{props.node.name}
					</Link>
					<div class="flex flex-col text-xs text-slate-500">
						<span>{props.node.type}</span>
						<Show when={props.node.short_description}>
							<span class="text-slate-400">{props.node.short_description}</span>
						</Show>
					</div>
				</div>
			</div>
			<Show when={isExpanded()}>
				<div class="mt-1">
					<TagTreeList
						nodes={children()}
						depth={props.depth + 1}
						expandedIds={props.expandedIds}
						onToggle={props.onToggle}
					/>
				</div>
			</Show>
		</li>
	)
}

type TagTreeSkeletonItemProps = {
	depth: number
	width: number
}

function TagTreeSkeletonItem(props: TagTreeSkeletonItemProps) {
	let indentStyle = () => ({ "padding-left": `${props.depth * 16}px` })
	let mainStyle = () => ({ width: `${props.width}px` })
	let subWidth = () => Math.max(80, props.width - 48)
	let subStyle = () => ({ width: `${subWidth()}px` })

	return (
		<div
			class="flex items-start gap-2"
			style={indentStyle()}
		>
			<div class="mt-1 h-4 w-4 rounded bg-slate-200" />
			<div class="flex flex-col gap-2">
				<div
					class="h-4 rounded bg-slate-200"
					style={mainStyle()}
				/>
				<div
					class="h-3 rounded bg-slate-100"
					style={subStyle()}
				/>
			</div>
		</div>
	)
}

function TagTreeSkeleton() {
	const skeletonItems = [
		{ id: 0, depth: 0, width: 180 },
		{ id: 1, depth: 1, width: 220 },
		{ id: 2, depth: 2, width: 200 },
		{ id: 3, depth: 1, width: 240 },
		{ id: 4, depth: 2, width: 190 },
		{ id: 5, depth: 0, width: 210 },
		{ id: 6, depth: 1, width: 170 },
		{ id: 7, depth: 2, width: 230 },
	]

	return (
		<div class="animate-pulse p-3">
			<div class="flex flex-col gap-3">
				<For each={skeletonItems}>
					{(item) => (
						<TagTreeSkeletonItem
							depth={item.depth}
							width={item.width}
						/>
					)}
				</For>
			</div>
		</div>
	)
}

function collectExpandedIds(
	nodes: TagTreeNode[],
	maxDepth: number,
): Set<number> {
	const expanded = new Set<number>()
	let walk = (items: TagTreeNode[], depth: number) => {
		if (depth >= maxDepth) return
		for (const item of items) {
			if (item.children.length > 0) {
				expanded.add(item.id)
				walk(item.children, depth + 1)
			}
		}
	}
	walk(nodes, 0)
	return expanded
}
