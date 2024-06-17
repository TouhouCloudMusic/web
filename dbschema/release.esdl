module default {
	type Release {
		required title: str;
		required multi artist: Artist;
		catalog_num: str;
		credit_name: str;
		multi language: Util::Language;
	}
}