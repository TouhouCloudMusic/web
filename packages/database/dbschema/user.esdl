module default {
	global current_user := (
		assert_single((
			select User
			filter .identity = global ext::auth::ClientTokenIdentity
		))
	);

	type User extending util::WithCreateAndUpdateTime {
		required identity: ext::auth::Identity {
			constraint exclusive;
		}

		required name: str;
		email: str {
			constraint exclusive;
		}

		required role: user::Role {
			default := user::Role.Regular;
		}

		required join_at: datetime {
			readonly := true;
			default := std::datetime_current();
		}
	}
}

module user {
	scalar type Role extending enum<
		Admin,
		Regular,
	>;

	abstract type CustomTaggable {
		multi custom_tag: CustomTag;
	}

	type CustomTag {
		required user: User;
		required name: str;

		multi target := (.<custom_tag[is CustomTaggable]);
	}
}
