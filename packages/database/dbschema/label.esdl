module default {
	type Label extending auth::RegularEntity, util::WithCreateAndUpdateTime {
		required app_id: label::SeqID {
			constraint exclusive;
			default := std::sequence_next(introspect label::SeqID);
		}

		required name: str;

		multi founder: Artist {
			constraint exclusive;
		}

		founded_date: datetime;
		dissolved_date: datetime;
	}
}

module label {
	scalar type SeqID extending sequence;
}
