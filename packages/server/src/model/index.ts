export interface Entity<E, NE> {
	findByID(id: number): Promise<E | undefined>
	findByKeyword(keyword: string): E[]
	insert(data: NE): E
	update(id: number, data: NE): E
	delete(id: number): void
}
