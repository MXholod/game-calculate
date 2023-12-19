export interface ITimerBlock{
	time: number;
	level: number;
}
//This function sets time and level in timer block.
export type sT = (cubeAmount: number, widgetTimer:HTMLDivElement)=>void;

//Private function. It writes time into DOM 
export type cT = (initialTime: number)=>string;

//Private function. It calculates time depending on amount of cubes 
export type cL = (cubeAmount: number)=>string;