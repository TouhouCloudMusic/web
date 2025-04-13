import { Link, useParams } from "@tanstack/solid-router"
import { Match, Show, Switch } from "solid-js"
import { PageLayout } from "~/components/layout/PageLayout"
import { userProfileQuery } from "~/data/user"
import { useUserCtx } from "~/state/user"
import { Avatar } from "~/components/avatar"
import { Button } from "~/components/button"
import { artistProfileQuery } from '~/data/artist'


export function ArtistProfile() {
    let params = useParams({id: Number})
    let queryResult = artistProfileQuery({ id: Number(params.id) })
    
//没写样式，暂时显示queryresult列表

    return (
        <PageLayout>
            <div class="col-span-12 col-start-7 flex flex-col items-center gap-4">
                <Switch>
                    <Match when={queryResult.isLoading}>
                        <p /><div class="text-xl font-bold text-center">少女祈祷中...</div><p/>
                    </Match>
                    <Match when={queryResult.status === 'success'}>
                        <div class = "text-xl font-bold">artistId = {queryResult.data?.id}</div>
                        <h2 class="text-xl font-bold">Name：{queryResult.data?.name}</h2>
                        <div class = "text-xl font-bold">artist_type = {queryResult.data?.artist_type}</div>
                        <div class = "text-xl font-bold">StartDate = {queryResult.data?.startDate} 精度：{queryResult.data?.start_date_precision}</div>
                        <div class = "text-xl font-bold">EndDate = {queryResult.data?.endDate} 精度：{queryResult.data?.end_date_precision}</div>
                        <div class = "text-xl font-bold">Alias = {queryResult.data?.text_alias}</div>
                        <div class = "text-xl font-bold">relatedLink = {queryResult.data?.links}</div>
                        <EditBtn />
                    </Match>
                    <Match when={queryResult.isError}>
                        <div>Error loading artist profile</div>
                    </Match>
                </Switch>
            </div>
        </PageLayout>
    )
}

function EditBtn() {
  return (
    <div>
      <Link to="/artists/edit">
        <Button variant="Tertiary">编辑资料</Button>
      </Link>
    </div>
  )
}
