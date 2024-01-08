export interface ITimerBlock{
	time: number;
	level: number;
}
//This function sets initial time and level in timer block.
export type sT = (initLevel: number, widgetTimer:HTMLDivElement)=>void;

//It writes level into DOM 
export type dL = (cubeAmount: number)=>string;

//It increments the current level to write it into the DOM
export type nL = ()=>string;

//Private function. It writes initial time into DOM 
export type iT = ()=>string;

//Private function. It writes initial time into DOM 
export type tC = ()=>string;