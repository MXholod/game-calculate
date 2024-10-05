import { IPagination, Controls, actPagination } from './types/pagination-results';

class Pagination implements IPagination{
	private static instance:Pagination | null = null;
	private paginationHtmlBlock: HTMLDivElement | null = null;
	private listLength: number = 0;
	private constructor(){}
	//Add 'click' event to the parent element to delegate this event to its children
	public applyPaginationBlockEvents(paginationBlock: HTMLDivElement):void{
		this.paginationHtmlBlock = paginationBlock;
		if(this.paginationHtmlBlock !== null){
			this.paginationHtmlBlock.addEventListener("click", function(this:Pagination, e:MouseEvent){
				//Current element (interaction item) in the pagination block
				const elementControl = e.target as HTMLElement;
				//Passing the value of a control's attribute as an Enum type 
				this.detectPressedControl(elementControl?.dataset?.btn as Controls);
			}.bind(this));
		}
	}
	public static getInstance():Pagination | null{
		if(Pagination.instance === null){
			Pagination.instance = new Pagination();
			return Pagination.instance;
		}
		return Pagination.instance;
	}
	public detectPressedControl(controlName: Controls):boolean{
		//No logic should be used if the length of the list is zero
		if(this.listLength === 0) return false;
		switch(controlName){
			case Controls.start : console.log("Clicked on Start");
				break;
			case 'end' : console.log("Clicked on End");
				break;
			case Controls.arrowLeft : console.log("Clicked on Arrow-Left");
				break;
			case 'arrow-right' : console.log("Clicked on Arrow-Right");
				break;
			case 'cell-1' : console.log("Clicked on Cell 1");
				break;
			case 'cell-2' : console.log("Clicked on Cell 2");
				break;
			case Controls.cell3 : console.log("Clicked on Cell 3");
				break;
		}
		return true;
	}
};
//This function is called in the 'index.js' file
export const activatePagination:actPagination = function(paginationHtmlBlock: HTMLDivElement):void{
	const paginationBlock = Pagination.getInstance();
	if(paginationBlock !== null){
		paginationBlock.applyPaginationBlockEvents(paginationHtmlBlock);
	}
};