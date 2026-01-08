export default  class BaseEntity {    
	constructor(item?: any) {
		if (item !== undefined) {
			this.Id = item.Id;
			this.Titulo = item.Title !== undefined ? item.Title : undefined;
			this.mapItem(item);
		}
	}
	protected mapItem(item: any): void {
		this.Titulo = item.Title;
	}
	public toListItem(): any {
		return {
			Title: this.Titulo,
		};
	}
	public Id?: number;
	public Titulo: string;
}
