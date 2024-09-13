module default {
	type Release extending util::WithCreateAndUpdateTime, auth::RegularEntity {

		required app_id: release::SeqID {
			constraint exclusive;
			default := std::sequence_next(introspect release::SeqID);
		}

		required title: str;
		index pg::spgist on (.title);

		localized_title: array<tuple<language: lang::Language, title: str>>;

		required type: release::Type;

		catalog_num: str;

		credit_name: str;

		release_date: datetime;
		release_date_mask: date::FormatMask {
			default := date::FormatMask.Full;
		}

		recording_date_start: datetime;
		recording_date_start_mask: date::FormatMask {
			default := date::FormatMask.Full;
		}
		recording_date_end: datetime;
		recording_date_end_mask: date::FormatMask {
			default := date::FormatMask.Full;
		}

		total_disc: int16;
		multi language: lang::Language;

		required multi artist: Artist {
			constraint exclusive;
			credit_name: str;
			separator: str;
		};

		multi track: release::Track;
	}
}

module release {
	scalar type SeqID extending sequence;

	scalar type `Type` extending enum<
		Album,
		EP,
		`Single`
	>;

	type Track {
		required order: int16;

		track_num: str;

		credit: TrackCredit {
			constraint exclusive;
		}

		required release := (.<track[is Release]);

		multi artist: default::Artist {
			constraint exclusive;
		};

		required song: default::Song {
			constraint exclusive;
		};
	}

	type TrackCredit extending music::Credit {
		track := (.<credit[is Track]);
	}
}
