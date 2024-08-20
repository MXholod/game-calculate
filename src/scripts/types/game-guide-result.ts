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