import { IPagination, actPagination } from './types/pagination-results';

class Pagination implements IPagination{
	private static instance:Pagination | null = null;
	private paginationHtmlBlock: HTMLDivElement | null = null;
	private listLength: number = 0;
	private constructor(){}
	//Add 'click' event to the parent element to delegate this event to its children
	public applyPaginationBlockEvents(paginationBlock: HTMLDivElement):void{
		this.paginationHtmlBlock = paginationBlock;
		if(this.paginationHtmlBlock !== null){
			this.paginationHtmlBlock.addEventListener("click", function(e:MouseEvent){
				//Current element (interaction item) in the pagination block
				const elementControl = e.target as HTMLElement;
				console.log("Selected control ",elementControl?.dataset?.btn);
			});
		}
	}
	public static getInstance():Pagination | null{
		if(Pagination.instance === null){
			Pagination.instance = new Pagination();
			return Pagination.instance;
		}
		return Pagination.instance;
	}
};
//This function is called in the 'index.js' file
export const activatePagination:actPagination = function(paginationHtmlBlock: HTMLDivElement):void{
	const paginationBlock = Pagination.getInstance();
	if(paginationBlock !== null){
		paginationBlock.applyPaginationBlockEvents(paginationHtmlBlock);
	}
};