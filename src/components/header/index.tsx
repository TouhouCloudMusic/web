import { Dialog as K_Dialog } from "@kobalte/core"
import { Link } from "@tanstack/solid-router"
import { createMemo, Match, Show, Switch } from "solid-js"
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "solid-radix-icons"
import { Button } from "~/components/button"
import { type UserProfile } from "~/model/user"
import { NotificationState, useUserCtx } from "~/state/user"
import { createClickOutside } from "~/utils/createClickOutside"

import { Avatar } from "../avatar/index.tsx"
import { Dialog } from "../dialog"
/*import {
  BellAlertIcon,
  BellIcon,
  BellSlashIcon,
} from "../icons/heroicons/24/outline.tsx"*/
 //禁用模板icon
import { Input } from "../input"
import { RightSidebar } from "../sidebar/right"
import  icon  from "../../assets/image/icon_s.png"

const HEADER_BTN_CLASS = "size-6 p-1 m-auto"

export function Header() {
  const Divider = () => <span class="w-[0.5px] bg-slate-400 h-5 ml-3"></span> //分隔线 按Figma上的示例图取消使用，保留代码供未来修改调用
  return (
    <header class="bg-primary box-content content-center items-center px-4 py-2 border-b-1 border-slate-300">
      <div class="my-auto flex h-8 items-center justify-between">
        {/* Left */}
        <div class="flex items-center">
          <Button
            variant="Tertiary"
            class={HEADER_BTN_CLASS}
          >
            <Link to="/">
              <img src={icon} alt="logo"/>
            </Link>
          </Button>
        </div>
        <SearchBar />

        {/* Right	*/}
        <div class="flex place-content-center items-center gap-3 shrink">
          <Show
            when={useUserCtx().user}
            fallback={<UnauthenticatedButtons />}
          >
            {(user) => <AuthenticatedContent user={user()} />}
          </Show>
        </div>
      </div>
    </header>
  )
}

function AuthenticatedContent(props: { user: UserProfile }) {
  let [show, setShow, setRef] = createClickOutside()
  let close = () => setShow(false)
  return (
    <>
      <button onClick={() => setShow(!show())}>
        <Avatar
          user={props.user}
          onClick={() => setShow(!show())}
        />
      </button>
      <Dialog.Root
        open={show()}
        onOpenChange={close}
      >
        <Dialog.Portal>
          <Dialog.Overlay onClick={close} />
          <K_Dialog.Content class="fixed inset-0 z-50">
            <RightSidebar
              ref={setRef}
              onClose={() => setShow(false)}
            />
          </K_Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

  function SearchBar() {
    return (
      <div class="flex justify-center">
        <div class="relative w-96">
          <Input
            class="bg-slate-100 h-7 w-full rounded-xs duration-200 pl-2 pr-7 border-none"
            placeholder="搜索车万云"
          />
          <MagnifyingGlassIcon
            class="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500"
          />
        </div>
      </div>
    );
  }
  

/*function NotificationButton() { //按Figma上的示例图取消使用，保留代码供未来修改调用
  let notification_state = createMemo(() => useUserCtx().notification_state)
  return (
    <Button
      variant="Tertiary"
      class={HEADER_BTN_CLASS}
    >
      <Switch>
        <Match when={notification_state() === NotificationState.None}>
          <BellIcon class={"size-4 m-auto"} />
        </Match>
        <Match when={notification_state() === NotificationState.Unread}>
          <BellAlertIcon class={"size-4 m-auto"} />
        </Match>
        <Match when={notification_state() === NotificationState.Muted}>
          <BellSlashIcon class={"size-4 m-auto"} />
        </Match>
      </Switch>
    </Button>
  )
}*/

function UnauthenticatedButtons() {
  // @tw
  const BTN_CLASS = "w-18 max-h-full text-sm"
  return (
    <>
      <Button
        variant="Tertiary"
        size="Sm"
        class={BTN_CLASS.concat(" ", "text-slate-900")}
      >
        <Link
          to="/auth"
          search={{
            type: "sign_in",
          }}
        >
          Sign In
        </Link>
      </Button>
      <Button
        variant="Primary"
        size="Sm"
        class={BTN_CLASS}
      >
        <Link
          to="/auth"
          search={{
            type: "sign_up",
          }}
        >
          Sign Up
        </Link>
      </Button>
    </>
  )
}
