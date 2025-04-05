import { Show } from "solid-js"

import { Dialog } from "."
import { Button } from "../button"

export interface AlertDialogProps extends Dialog.LayoutProps {
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
  cancelText?: string
  confirmText?: string
  hideCancel?: boolean
  dismissible?: boolean
}

export function AlertDialog(props: AlertDialogProps) {
  let handleDismiss = (e: Event) => {
    if (props.dismissible) {
      e.preventDefault()
    }
  }
  return (
    <Dialog.Layout
      {...props}
      trigger={props.trigger}
      open={props.open!}
      defaultOpen={props.defaultOpen!}
      onOpenChange={props.onOpenChange!}
      blur={props.blur}
    >
      <Dialog.Content
        class={`shadow-2 flex h-48 w-96 flex-col place-content-between`}
        onPointerDownOutside={handleDismiss}
        onEscapeKeyDown={handleDismiss}
      >
        <div>
          <Dialog.Title class="text-lg">{props.title}</Dialog.Title>
          <Dialog.Description>{props.description}</Dialog.Description>
        </div>
        <div class="flex justify-end gap-2">
          <Show when={!props.hideCancel}>
            <Dialog.CloseButton
              class="ml-auto"
              variant="Tertiary"
              onClick={props.onCancel}
            >
              {props.cancelText ?? "取消"}
            </Dialog.CloseButton>
          </Show>
          <Button
            variant="Primary"
            color="Reimu"
            onClick={props.onConfirm}
          >
            {props.confirmText ?? "确定"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Layout>
  )
}
