module default {
	type Label extending auth::RegularEntity, util::WithCreateAndUpdateTime {
		required app_id: label::SeqID {
			constraint exclusive;
			default := std::sequence_next(introspect label::SeqID);
		}

		required name: str;

		multi founder: Artist {
			constraint exclusive;
			on target delete allow;
		}

		founded_date: cal::local_date;
		dissolved_date: cal::local_date;
	}
}

module label {
	scalar type SeqID extending sequence;
}
