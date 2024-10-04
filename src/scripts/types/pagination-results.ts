export interface IPagination{ 
	applyPaginationBlockEvents(paginationBlock: HTMLDivElement):void;
}

export type actPagination = (paginationHtmlBlock: HTMLDivElement)=>void;