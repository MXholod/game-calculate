import { IPagination, Controls, getClassInstance, actPagination } from './types/pagination-results';
import { ILevelsPackData } from './types/game-guide-result';

class Pagination implements IPagination{
	private static instance:Pagination | null = null;
	private paginationHtmlBlock: HTMLDivElement | null = null;
	private data:any[] = [];
	private listLength: number = 0;
	private pagePortion: number = 0;
	private totalPages: number = 0;
	private currentPage: number = 1;
	private cells:{ [key:string]: HTMLSpanElement } = {};
	private constructor(){}
	//Add 'click' event to the parent element to delegate this event to its children
	public applyPaginationBlockEvents(paginationBlock: HTMLDivElement):void{
		this.paginationHtmlBlock = paginationBlock;
		if(this.paginationHtmlBlock !== null){
			this.paginationHtmlBlock.addEventListener("click", function(this:Pagination, e:MouseEvent){
				//Current element (interaction item) in the pagination block
				const elementControl = e.target as HTMLElement;
				let pageNumber: number = 0;
				//Identifying three buttons (span - cells) that are responsible for a specific page
				if(elementControl instanceof HTMLSpanElement){
					const attrValue = elementControl?.dataset?.btn;
					//If the button clicked is a span element with one of the following attribute values
					if((attrValue === 'cell-1') || (attrValue === 'cell-2') || (attrValue === 'cell-3')){
						//Getting a page number from the cell value
						if(elementControl?.firstChild?.nodeValue !== undefined){
							pageNumber = <number>(elementControl?.firstChild?.nodeValue as unknown);
						}
					}
				}
				//Passing the value of a control's attribute as an Enum type
				this.detectPressedControl(elementControl?.dataset?.btn as Controls, pageNumber);
			}.bind(this));
		}
	}
	public static getInstance():Pagination{
		if(Pagination.instance === null){
			Pagination.instance = new Pagination();
			return Pagination.instance;
		}
		return Pagination.instance;
	}
	//This function checks an attribute value of the pressed control and then run a function
	public detectPressedControl(controlName: Controls, pageNumber: number):boolean{
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
	//Show cells hidden by default if there is more data, assign some basic properties
	public preparePaginationBlock<T>(dataArr: T[], pagePortion: number):void{
		if(!!dataArr.length){
			//Find cells 2 and 3 in the block controls of the pagination
			if(this.paginationHtmlBlock !== null && pagePortion !== 0){
				//Save the data length, page portion and data itself into the class properties
				this.listLength = dataArr.length;
				this.pagePortion = pagePortion;
				this.data = dataArr;
				//Calculating total pages
				if(this.pagePortion > this.listLength){
					this.totalPages = 1;
				}else{
					if((this.listLength % this.pagePortion) !== 0){//We have an extra page
						let pages = (this.listLength / this.pagePortion);
						this.totalPages = Math.floor(pages) + 1;
					}else{//Division equals zero. No extra pages
						this.totalPages = (this.listLength / this.pagePortion);
					}
				}
				//Get three cells and mark the first as a current
				const controlsBlock = this.paginationHtmlBlock?.lastChild as HTMLDivElement;
				const cells = controlsBlock.children[1] as HTMLDivElement;
				const cell1 = cells.children[0] as HTMLSpanElement;
				cell1.className = "current";
				const cell2 = cells.children[1] as HTMLSpanElement; 
				const cell3 = cells.children[2] as HTMLSpanElement;
				//Save three page buttons
				this.cells['cell1'] = cell1;
				this.cells['cell2'] = cell2;
				this.cells['cell3'] = cell3;
				//Show cells corresponding to the amount of data
				if(this.listLength >= this.pagePortion && this.listLength <= (this.pagePortion * 2)){//Show second cell
					cell2.style.display = "block";
				}else if(this.listLength > (this.pagePortion * 2)){//Show second and third cell
					cell2.style.display = "block";
					cell3.style.display = "block";
				}
			}
		}
	}
};
//Returns an instance of a class from this module
export const getInstance:getClassInstance = ():IPagination=>{
	return Pagination.getInstance();
}
//This function is called in the 'index.js' file
export const activatePagination:actPagination = function(paginationHtmlBlock: HTMLDivElement):void{
	getInstance().applyPaginationBlockEvents(paginationHtmlBlock);
};
