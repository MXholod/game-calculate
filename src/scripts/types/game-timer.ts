import { IUserInteraction } from './user-interaction';

export interface ITimerBlock{
	time: number;
	level: number;
}
//This function sets initial time and level in timer block.
export type sT = (widgetTimer:HTMLDivElement)=>void;

//Private function. It writes initial time into DOM 
export type iT = ()=>string;

//Private function. It writes initial time into DOM
export type tC = ()=>string;

//This function suspend timer or stop it
export interface ITSCallback{
	(this: IUserInteraction, isStopped:boolean):boolean;
}
export type tS = (widgetTimer:HTMLDivElement, callback: ITSCallback)=>boolean;