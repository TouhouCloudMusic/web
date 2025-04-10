import { Link, useParams } from "@tanstack/solid-router"
import { Match, Show, Switch } from "solid-js"
import { PageLayout } from "~/components/layout/PageLayout"
import { userProfileQuery } from "~/data/user"
import { useUserCtx } from "~/state/user"
import { Avatar } from "~/components/avatar"
import { Button } from "~/components/button"

export function Profile() {
  let params = useParams({ strict: false })()
  let query_result = userProfileQuery({ "params.username": params.username })

  return (

    <PageLayout>
    <div class="col-span-12 col-start-7 flex flex-col items-center gap-4">
      <Switch>
        <Match when={query_result.isLoading}>
          <p /><div class="text-xl font-bold text-center">少女祈祷中...</div>
       </Match>
        <Match when={query_result.data}>
        <Avatar user={query_result.data} class="size-24" />
        <h2 class="text-xl font-bold">用户名：{query_result.data?.name}</h2>
        <div class="text-xl font-bold">最后登录：{query_result.data?.last_login.slice(0, 16)}</div>
        <EditBtn />
       </Match>
      </Switch>
      </div>
    </PageLayout> 

  )
}

function EditBtn() {
  return (
    <div>
      <Link to="/profile/edit">
        <Button variant="Tertiary">编辑资料</Button>
      </Link>
    </div>
  )
}
