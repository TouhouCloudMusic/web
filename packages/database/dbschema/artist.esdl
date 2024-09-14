module default {
	type Artist extending
		auth::RegularEntity,
		util::WithCreateAndUpdateTime {

		required app_id: artist::SeqID {
			constraint exclusive;
			default := std::sequence_next(introspect artist::SeqID);
		}

		required name: str;
		index pg::spgist on (.name);

		localized_name: array<tuple<language: lang::Language, name: str>>;

		required artist_type: artist::ArtistType;

		# date of born/formed and date of died/disbanded
		date_of_start: cal::local_date;
		date_of_start_mask: date::FormatMask;
		date_of_end: cal::local_date;
		date_of_end_mask: date::FormatMask;

		# aliases
		multi alias: Artist {
			constraint exclusive;
			constraint expression on (@target != @source);
		};
		str_alias: array<std::str>;

		multi members: Artist {
			join_year: int16;
			leave_year: int16;

			constraint exclusive;
			constraint expression on (@target != @source);
			on target delete allow;
		};
		multi member_of := (.<members[is default::Artist]);

		str_member: array<tuple<name: str, join_year: str, leave_year: str>>;

		multi release := (.<artist[is Release]);
		multi song := (.<artist[is Song]);
	}
}

module artist {
	scalar type SeqID extending sequence;

	scalar type ArtistType extending enum<
		Person,
		`Group`
	>;
}
