export type mainSquare = HTMLDivElement | null;
export type threeDBlockWrapper = HTMLDivElement | null;
export type threeDBlock = HTMLDivElement | null;

export interface ISQuareBlock{
	mainS: mainSquare;
	threeBW: threeDBlockWrapper;
	threeB: threeDBlock;
}

export type startCube = (timer:HTMLDivElement, animationEnd?: ()=>void)=>boolean;

export type backCube = (animationEnd?: ()=>void)=>boolean;

export interface IAppllyNumsToCube{
	(cells: HTMLDivElement[], nums: Array<string>):boolean;
}

export type clearNumsCube = ()=>boolean;