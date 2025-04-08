// Image.stories.ts
import type { Meta, StoryObj } from "storybook-solidjs"

import { Image, type ImageProps } from "."

// 定义 Storybook 的 Meta 配置
const meta: Meta<typeof Image> = {
	title: "Image",
	component: Image,
	tags: ["autodocs"], // 启用自动文档生成
	parameters: {
		docs: {
			description: {
				component: `
          实现基本图片组件  
        - [X] 创建基础Image组件
        - [X] 实现占位内容
        - [X] 实现加载失败提示
        - [X] 实现懒加载
        - [X] 实现图片点击预览
        `,
			},
		},
	},
	argTypes: {
		src: {
			control: "text",
			description: "图片资源路径，默认暂时是从网上随便拉的一个",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "" },
			},
		},
		alt: {
			control: "text",
			description: "文本描述",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "Placeholder Image" },
			},
		},
		width: {
			control: { type: "number", min: 1, max: 1000 },
			description: "宽度",
			table: {
				type: { summary: "number" },
				defaultValue: { summary: "300" }, // 修改为字符串
			},
		},
		height: {
			control: { type: "number", min: 1, max: 1000 },
			description: "高度，但是应该没用，设置了图片object-cover",
			table: {
				type: { summary: "number" },
				defaultValue: { summary: "200" }, // 修改为字符串
			},
		},
		loading: {
			control: "select",
			options: ["eager", "lazy"],
			description: "原生属性，应为 'eager'或者'lazy'",
			table: {
				type: { summary: '"eager" | "lazy"' },
				defaultValue: { summary: "lazy" },
			},
		},
		enablePreview: {
			control: "boolean",
			description: "是否允许点击图片放大预览",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" }, // 修改为字符串
			},
		},
		previewClass: {
			control: "text",
			description: "点击图片放大预览的样式",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "" },
			},
		},
		class: {
			control: "text",
			description: "普通class",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "" },
			},
		},
		placeholder: {
			control: false, // JSX 不支持控件调整
			description: "图片未加载时显示的占位符",
			table: {
				type: { summary: "JSX.Element" },
			},
		},
		errorContent: {
			control: false, // JSX 不支持控件调整
			description:
				"加载失败时显示的占位符",
			table: {
				type: { summary: "JSX.Element" },
			},
		},
	},
	args: {
		alt: "Placeholder Image",
		width: 300,
		height: 200,
		loading: "lazy",
		enablePreview: false,
	},
}

type Story = StoryObj<typeof Image>

// 基本用法
export const Default: Story = {
	name: "Default Image",
	args: {
		loading: "lazy",
		src: "https://th.bing.com/th/id/OIP.1JqzUmtCX3Ng-8i-n5_kHgAAAA?w=120&h=104&c=7&bgcl=de1aa5&r=0&o=6&dpr=1.5&pid=13.1",
		enablePreview: false,
		width: 500,
		height: 100,
	},
}

// 自定义尺寸
export const CustomSize: Story = {
	name: "Custom Size",
	args: {
		src: "https://th.bing.com/th/id/OIP.1JqzUmtCX3Ng-8i-n5_kHgAAAA?w=120&h=104&c=7&bgcl=de1aa5&r=0&o=6&dpr=1.5&pid=13.1",
		width: 999,
		height: 100,
		loading: "eager",
	},
}

// 加载失败
export const ErrorState: Story = {
	name: "Error State",
	args: {
		alt: "",
		loading: "eager",
		src: "",
		enablePreview: false,
		width: 0,
		height: 0,
	},
}

// 启用预览功能
export const WithPreview: Story = {
	name: "With Preview",
	args: {
		src: "https://th.bing.com/th/id/OIP.1JqzUmtCX3Ng-8i-n5_kHgAAAA?w=120&h=104&c=7&bgcl=de1aa5&r=0&o=6&dpr=1.5&pid=13.1",
		enablePreview: true,
		width: 300,
		height: 200,
	},
}

// 自定义预览样式
export const CustomPreviewStyle: Story = {
	name: "Custom Preview Style",
	args: {
		enablePreview: true,
		src: "https://th.bing.com/th/id/OIP.1JqzUmtCX3Ng-8i-n5_kHgAAAA?w=120&h=104&c=7&bgcl=de1aa5&r=0&o=6&dpr=1.5&pid=13.1",
		previewClass: "bg-opacity-50 backdrop-blur-sm",
		width: 300,
		height: 200,
		loading: "eager",
	},
}

// 自定义占位符
export const CustomPlaceholder: Story = {
	name: "Custom Placeholder",
	args: {
		loading: "lazy",
		src: "https://via.placeholder.com/300x200?delay=2000", // 模拟慢加载
		placeholder: (
			<div class="flex h-full w-full items-center justify-center bg-blue-200">
				<span class="text-lg text-blue-800">Custom Loading...</span>
			</div>
		),
	},
}

// 自定义错误内容
export const CustomErrorContent: Story = {
	name: "Custom Error Content",
	args: {
		src: "https://invalid-url.com/image.jpg",
		errorContent: (
			<div class="flex h-full w-full items-center justify-center bg-yellow-100">
				<span class="text-lg text-yellow-800">Image Not Found!</span>
			</div>
		),
		width: 0,
		height: 0,
		loading: "eager",
	},
}

export default meta
