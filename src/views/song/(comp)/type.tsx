export interface ReleaseAPIResponse {
	status: string
	data: Release[]
}

export interface Release {
	id: number
	release_type: string
	release_date: string
	release_date_precision: string
	recording_date_start: string
	recording_date_start_precision: string
	recording_date_end: string
	recording_date_end_precision: string
	artists: Artist[]
	credits: Credit[]
	catalog_nums: CatalogNum[]
	localized_titles: LocalizedTitle[]
	tracks: number[]
}

export interface Artist {
	id: number
	name: string
}

export interface Credit {
	artist: Artist
	role: {
		id: number
		name: string
	}
	on: number[]
}

export interface CatalogNum {
	catalog_number: string
	label_id: number | null
}

export interface LocalizedTitle {
	language: {
		id: number
		code: string
		name: string
	}
	title: string
}
