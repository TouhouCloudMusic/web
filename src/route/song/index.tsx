import { Title } from "@solidjs/meta"

import { AltVerComp } from "./(comp)/alt_ver"
import { CreditComp } from "./(comp)/credit"
import { EditComp } from "./(comp)/edit"
import { SongInfo } from "./(comp)/info"
import { ReviewComp } from "./(comp)/review"
import { UserActionComp } from "./(comp)/user_action"
import { testSongData } from "./mock_data"
import { SongDataProvider, useSongData } from "./store"

// import "./song_page.css"
const divideClass = "divide-y-2 divide-gray-400 w-full"

function SongPage() {
  const { title } = useSongData()
  return (
    <main>
      <div class="mt-0 flex flex-col items-center justify-center gap-1">
        <Title>{title()}</Title>
        <div class={divideClass}>
          <div class="flex items-baseline justify-between">
            <h3 class="">{title()}</h3>
            <EditComp />
          </div>
          <SongInfo />
        </div>
        <div class="w-full items-start justify-start">
          <UserActionComp />
        </div>
        <AltVerComp />
        <div class={divideClass}>
          <CreditComp />
        </div>
        <ReviewComp />
      </div>
    </main>
  )
}

export default function () {
  return (
    <SongDataProvider defaultState={testSongData}>
      <SongPage />
    </SongDataProvider>
  )
}
