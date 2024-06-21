module default {

	abstract type Artist extending Util::HasCreateAndUpdateTime {
		required name: str;

		artist_type := Artist::getType(Artist);
		required app_id: Artist::id {
			constraint exclusive;
			default := std::sequence_next(introspect Artist::id);
		}

		multi alias: Artist;
		multi text_alias: str;

		multi release := (.<artist[is Release]);
		multi song := (.<artist[is Song]);
	}

}

module Artist {

	scalar type id extending sequence;

	type Person extending default::Artist {

		date_of_birth: datetime;
		date_of_death: datetime;

		overloaded multi alias: Person;

		multi member_of := (.<members[is `Group`]);
		multi str_member_of: str;

	}

	type `Group` extending default::Artist {

		date_of_formation: datetime;
		date_of_dissolution: datetime;

		overloaded multi alias: `Group`;

		multi members: Person {
			constraint exclusive;
			join_year: int16;
			leave_year: int16;
		};
		multi str_members: str;
	}

	function getType(x: default::Artist) -> str {
		volatility := "Stable";
		using (
			if x is Artist::Person then "Person" else "Group"
		);
	}
}