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