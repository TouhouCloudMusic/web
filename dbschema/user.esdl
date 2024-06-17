module default {

	type User {
		required name: str {
			constraint exclusive
		};
	}
}
