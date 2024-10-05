export enum Controls{
	start = 'start',
	end = 'end',
	arrowLeft = 'arrow-left',
	arrowRight = 'arrow-right',
	cell1 = 'cell-1',
	cell2 ='cell-2',
	cell3 ='cell-3'
}

export interface IPagination{
	applyPaginationBlockEvents(paginationBlock: HTMLDivElement):void;
	detectPressedControl(controlName: Controls):boolean;
}

export type actPagination = (paginationHtmlBlock: HTMLDivElement)=>void;