import { IPreparedLevelData } from './game-core';

export interface ICurrentLevel{
	elem: (null | HTMLInputElement);
	value: number;
}
export type getCurLevelNode = (statBtn:HTMLButtonElement)=>void;

type levelData = Omit<IPreparedLevelData, 'allCubeCells'>;
export type levelsData = Array<levelData>;

type btnLabel = "Open game statistics" | "Close game statistics";

export interface IButton{
	btn: (null | HTMLButtonElement);
	stateBtn: boolean;
	labelBtn: btnLabel;
}

export interface IRow{
	orderNum: (HTMLDivElement | null);
	time: (HTMLDivElement | null);
	userRes: (HTMLDivElement | null);
	cpuRes: (HTMLDivElement | null);
	isSuccess: (HTMLDivElement | null);
}

export interface IRows extends IRow{
	visible: boolean;
	rowEl: (HTMLDivElement | null);
}

export type tableRows = IRows[];

export interface ITableStructure{
	isCached: boolean;
	parentTableEl: (HTMLDivElement | null);
	tableRows: tableRows;
}

export type handleStatsBtn = (this:HTMLButtonElement, e: MouseEvent)=>void;

export type btnStateChanging = (btn:HTMLButtonElement)=>boolean;

export type cacheTableStruct = ()=>boolean;

export type writeDataIntoTable = ()=>boolean;

export type subsOnData = (levelsAllData:IPreparedLevelData[])=>void;

export type clearStatsData = ()=>boolean;