import { Link } from "@tanstack/solid-router"
import { Match, Switch } from "solid-js"
import { Avatar } from "~/components/avatar"
import { Button } from "~/components/button"
import { PageLayout } from "~/components/layout/PageLayout"
import { Data } from "~/data"
import { type UserProfile } from "~/model/user"

type Props = {
	data: Data<UserProfile>
}

export function Profile(props: Props) {
	return (
		<PageLayout>
			<div class="col-span-12 col-start-7 flex flex-col items-center gap-4">
				<Switch>
					<Match when={Data.isPending(props.data)}>
						<div class="text-center text-xl font-bold">少女祈祷中...</div>
					</Match>
					<Match when={Data.isOk(props.data) && props.data.value}>
						{(user) => (
							<>
								<Avatar
									user={user()}
									class="size-24"
								/>
								<h2 class="text-xl font-bold">用户名：{user().name}</h2>
								<div class="text-xl font-bold">
									最后登录：{user().last_login.slice(0, 16)}
								</div>
								<EditBtn />
							</>
						)}
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
