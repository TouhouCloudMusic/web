import { Link, useParams } from "@tanstack/solid-router";
import { Match, Show, Switch } from "solid-js";
import { PageLayout } from "~/components/layout/PageLayout";
import { artistProfileQuery } from '~/data/artist';
import { Button } from "~/components/button";

export function ArtistProfile(id: number) {
  const queryResult = artistProfileQuery(id);
  
  return (
    <PageLayout>
      <div class="col-span-12 col-start-7 flex flex-col items-center gap-4">
        <Switch>
          <Match when={queryResult.isLoading}>
            <div class="text-xl font-bold text-center">少女祈祷中...</div>
          </Match>
          
          <Match when={queryResult.isSuccess}>
            <Show when={queryResult.data?.data}>
                <div class="flex flex-col items-center gap-4">
                  <div class="text-xl font-bold">artistId = {queryResult.data?.data.id}</div>
                  <h2 class="text-xl font-bold">Name：{queryResult.data?.data.name}</h2>
                  <div class="text-xl font-bold">artist_type = {queryResult.data?.data.artist_type}</div>
                  <div class="text-xl font-bold">
                    StartDate = {queryResult.data.data.start_date} 精度：{queryResult.data.data.start_date_precision}
                  </div>
                  <div class="text-xl font-bold">
                    EndDate = {queryResult.data.data.end_date} 精度：{queryResult.data.data.end_date_precision}
                  </div>
                  <div class="text-xl font-bold">
                    Alias = {queryResult.data.data.text_alias?.join(", ")}
                  </div>
                  <div class="text-xl font-bold">
                    relatedLink = {queryResult.data.data.links?.join(", ")}
                  </div>
                  <EditBtn artistId={queryResult.data.data.id} />
                </div>
            </Show>
          </Match>
          
          <Match when={queryResult.isError}>
            <div>Error loading artist profile</div>
          </Match>
        </Switch>
      </div>
    </PageLayout>
  );
}

const EditBtn = (props: { artistId: number }) => (
  <Link to={`/artists/edit`}>
    <Button variant="Tertiary">编辑资料</Button>
  </Link>
);