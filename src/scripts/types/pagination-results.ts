//import { ILevelsPackData } from './types/game-guide-result';

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
	detectPressedControl(controlName: Controls, pageNumber: number):boolean;
	preparePaginationBlock<T>(dataArr: T[], pagePortion: number, dataIntoHTML: (data: T[])=>void):T[];
	getPortionData<T>(pageNum: number):T[];
	displayFirstPageData<T>(dataArr: T[]):T[];
}

export type getClassInstance = ()=>IPagination;

export type actPagination = (paginationHtmlBlock: HTMLDivElement)=>void;