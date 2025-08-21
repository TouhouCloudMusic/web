import type { UserProfile, SignInError, SignOutError, SignUpError } from "~/gen"
import { signIn, signOut, signUp } from "~/gen"
import type { ApiResult } from "~/shared"
import { apiResultFrom, apiResultFromMessage } from "~/shared"

type OptSignIn = Parameters<typeof signIn>
type OptSignOut = Parameters<typeof signOut>
type OptSignUp = Parameters<typeof signUp>

export async function signin(
	...option: OptSignIn
): Promise<ApiResult<UserProfile, SignInError>> {
	return apiResultFrom(await signIn(...option))
}

export async function signup(
	...option: OptSignUp
): Promise<ApiResult<UserProfile, SignUpError>> {
	return apiResultFrom(await signUp(...option))
}

export async function signout(
	...option: OptSignOut
): Promise<ApiResult<string, SignOutError>> {
	return apiResultFromMessage(await signOut(...option))
}
