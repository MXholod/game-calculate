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
	private dataIntoHTML: ((data: any[])=>void) | null = null;
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
							pageNumber = Number(elementControl?.firstChild?.nodeValue);
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
			case Controls.start :
				this.cells.cell1.className = "current";
				this.cells.cell2.className = "";
				this.cells.cell3.className = "";
				//Rewrite cell numbers for the right edge
				this.cells.cell1.textContent = String(1);
				this.cells.cell2.textContent = String(2);
				this.cells.cell3.textContent = String(3);
				//Write data into template when button 'to the start' is pressed
				if(this.dataIntoHTML !== null){
					this.dataIntoHTML( this.getPortionData<ILevelsPackData>(1) );
				}
				break;
			case 'end' :
				if(this.totalPages === 1){
					//Set the last cell as active
					this.cells.cell1.className = "current";
					//Rewrite cell numbers for the right edge
					this.cells.cell1.textContent = String(this.totalPages);
				}else if(this.totalPages === 2){
					//Set the last cell as active
					this.cells.cell1.className = "";
					this.cells.cell2.className = "current";
					//Rewrite cell numbers for the right edge
					this.cells.cell1.textContent = String(this.totalPages - 1);
					this.cells.cell2.textContent = String(this.totalPages);
				}else{
					//Set the last cell as active
					this.cells.cell1.className = "";
					this.cells.cell2.className = "";
					this.cells.cell3.className = "current";
					//Rewrite cell numbers for the right edge
					this.cells.cell1.textContent = String(this.totalPages - 2);
					this.cells.cell2.textContent = String(this.totalPages - 1);
					this.cells.cell3.textContent = String(this.totalPages);
				}
				//Write data into template when button 'to the end' is pressed
				if(this.dataIntoHTML !== null){
					this.dataIntoHTML( this.getPortionData<ILevelsPackData>(this.totalPages) );
				}
				break;
			case Controls.arrowLeft : 
				if(this.currentPage > 1){
					//Rewrite number in cells
					if((Number(this.cells.cell1.textContent) + 2) > 3){//1 + 2 The sum of a page number
						this.cells.cell1.textContent = String(Number(this.cells.cell1.textContent) - 1);
						this.cells.cell2.textContent = String(Number(this.cells.cell2.textContent) - 1);
						this.cells.cell3.textContent = String(Number(this.cells.cell3.textContent) - 1);
					}else{//Move active cell to the left edge
						if(this.cells.cell3.className === 'current'){
							this.cells.cell3.className = '';
							this.cells.cell2.className = 'current';
						}else if(this.cells.cell2.className === 'current'){
							this.cells.cell2.className = '';
							this.cells.cell1.className = 'current';
						}
					}
					//Calculate previous page
					const previousPage = this.currentPage - 1;
					//Write data into template when button 'Previous' is pressed
					if(this.dataIntoHTML !== null){
						this.dataIntoHTML( this.getPortionData<ILevelsPackData>(previousPage) );
					}
				}
				break;
			case 'arrow-right' : 
				if(this.currentPage < this.totalPages){
					//Rewrite number in cells
					if((Number(this.cells.cell3.textContent) + 1) <= this.totalPages){
						this.cells.cell1.textContent = String(Number(this.cells.cell1.textContent) + 1);
						this.cells.cell2.textContent = String(Number(this.cells.cell2.textContent) + 1);
						this.cells.cell3.textContent = String(Number(this.cells.cell3.textContent) + 1);
					}else{//Move active cell to the right edge
						if(this.cells.cell1.className === 'current'){
							this.cells.cell1.className = '';
							this.cells.cell2.className = 'current';
						}else if(this.cells.cell2.className === 'current'){
							this.cells.cell2.className = '';
							this.cells.cell3.className = 'current';
						}
					}
					//Calculate next page
					const nextPage = this.currentPage + 1;
					//Write data into template when button 'Next' is pressed
					if(this.dataIntoHTML !== null){
						this.dataIntoHTML( this.getPortionData<ILevelsPackData>(nextPage) );
					}
				}
				break;
			case 'cell-1' :
					this.cells.cell1.className = "current";
					this.cells.cell2.className = "";
					this.cells.cell3.className = "";
					//Write data into template when button 'Page number' is pressed
					if(this.dataIntoHTML !== null){
						this.dataIntoHTML( this.getPortionData<ILevelsPackData>(pageNumber) );
					}
				break;
			case 'cell-2' :
					this.cells.cell1.className = "";
					this.cells.cell2.className = "current";
					this.cells.cell3.className = "";
					//Write data into template when button 'Page number' is pressed
					if(this.dataIntoHTML !== null){
						this.dataIntoHTML( this.getPortionData<ILevelsPackData>(pageNumber) );
					}
				break;
			case Controls.cell3 :
					this.cells.cell1.className = "";
					this.cells.cell2.className = "";
					this.cells.cell3.className = "current";
					//Write data into template when button 'Page number' is pressed
					if(this.dataIntoHTML !== null){
						this.dataIntoHTML( this.getPortionData<ILevelsPackData>(pageNumber) );
					}
				break;
		}
		return true;
	}
	//Show cells hidden by default if there is more data, assign some basic properties
	public preparePaginationBlock<T>(dataArr: T[], pagePortion: number, dataIntoHTML: (data: T[])=>void):T[]{
		if(!!dataArr.length){
			//Storing the function, which writes data into HTML
			this.dataIntoHTML = dataIntoHTML;
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
				if(this.listLength > this.pagePortion && this.listLength <= (this.pagePortion * 2)){//Show second cell
					cell2.style.display = "block";
				}else if(this.listLength > (this.pagePortion * 2)){//Show second and third cell
					cell2.style.display = "block";
					cell3.style.display = "block";
				}
			}
		}
		//Return an empty data or not empty at startup
		return this.displayFirstPageData<T>(dataArr);
	}
	//Get a portion of data according to the chosen page
	public getPortionData<T>(pageNum:number):T[]{
		let portion:T[] = [];
		//If the portion is greater than 0
		if(this.pagePortion !== 0){
			//Get a portion of data for the first page
			if(pageNum === 1){
				portion = this.data.slice(0, this.pagePortion);
			}else if(pageNum === this.totalPages){//Get a portion of data for the last page
				let endPos = (this.totalPages * this.pagePortion);
				let startPos = endPos - this.pagePortion;
				portion = this.data.slice(startPos, endPos);
			}else{//Get a portion of data for all the middle pages
				let startPos = (pageNum * this.pagePortion) - this.pagePortion;
				let endPos = (pageNum * this.pagePortion);
				portion = this.data.slice(startPos, endPos);
			}
		}
		//Rewrite the current page when a control is clicked
		this.currentPage = pageNum;
		return portion;
	}
	//Display the first page at the beginning
	public displayFirstPageData<T>(dataArr:T[]):T[]{
		let portion:T[] = [];
		if(this.pagePortion !== 0){
			//Update current data if it was sorted
			this.data = dataArr;
			//Set the current page as the first
			this.currentPage = 1;
			//Get a portion of data for the first page
			portion = this.data.slice(0, this.pagePortion);
			//Set controls and cells by default
			this.cells.cell1.className = "current";
			this.cells.cell2.className = "";
			this.cells.cell3.className = "";
			//Rewrite cell numbers for the right edge
			this.cells.cell1.textContent = String(1);
			this.cells.cell2.textContent = String(2);
			this.cells.cell3.textContent = String(3);
		}
		return portion; 
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
