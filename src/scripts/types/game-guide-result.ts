import { IPreparedLevelData } from './game-core';

export type levelsPack = Array<IPreparedLevelData>;

export interface ILevelsPackData{
	[id:number]: levelsPack;
};

export type stateLevelsData = Array<ILevelsPackData>;

export type resultOnInitData = (panelResult:HTMLElement)=>boolean;

export type changePanelsOnPage = (this:HTMLButtonElement, e:MouseEvent)=>void;

export type subsOnData = (levelsAllData:IPreparedLevelData[])=>void;

export type getDataFromStorage = ()=>stateLevelsData;

export type setDataToStorage = (levels: stateLevelsData)=>boolean;

export type clearDataFromStorage = ()=>boolean;

export type packLevelsToStructure = (levels:levelsPack)=>stateLevelsData;

export interface IUniqueKeys{
	[key:number]:number;
};

export type mergeStateLevelsStructure = (stateLevels:stateLevelsData, newLevels:stateLevelsData)=>boolean;

export interface IMapKeys{
	[key:string]:string;
};

export type handleClearDataButton = (this:HTMLButtonElement, e:MouseEvent)=>void;

export type displayGamesWithLevelsData = (games:stateLevelsData)=>void;

export type createDateFormat = (timeStamp:string)=>string;

export interface IExpandedGameBlock{
	isExpanded: boolean;
	selectedElement: (null | HTMLElement);
	selectedNumElement: number;
}

export type expandGameBlockHandler = (this:HTMLDivElement, e:MouseEvent)=>void;

export interface IButtons{
	(this:HTMLDivElement, e:MouseEvent):void;
}

export type sortingLogicData = (data:stateLevelsData, sortBy:string)=>stateLevelsData;

export interface ITimeStampSuccess{
	[key:number]: number;  // timestamp: successAmount
}

export interface ITimeStampRemainingTime{
	timeStamp: number;
	allLevelsTime: number;
}
export interface IGamesByLevels{
	[key:number]: ITimeStampRemainingTime[]; // levelOrder: []
}
export interface IGamesSortedByTime extends ITimeStampSuccess{
	
}