import { MagnifyingGlassIcon } from "solid-radix-icons"
import { Input } from "~/component/atomic/Input"

export function SearchBar() {
    return (
        <div class="ml-36 grid w-fit items-center">
            <Input
                class="mr-auto h-7 w-96 pl-7 text-sm"
            />
            <MagnifyingGlassIcon class={"absolute col-start-1 ml-2 size-4"} />
        </div>
    )
}
