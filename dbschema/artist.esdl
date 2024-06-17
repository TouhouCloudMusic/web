module default {
	scalar type ArtistType extending enum<Person, `Group`>;

	type Artist {
		required name: str;
		required artist_type: ArtistType;

		multi alias: Artist;
		multi text_alias: str;

		multi members: Artist {
			constraint exclusive;
			join_year: int16;
			leave_year: int16;
		};
		multi member_of := (.<members[is Artist]);

		multi release := (.<artist[is Release]);
		multi song := (.<artist[is Song]);
	}
}