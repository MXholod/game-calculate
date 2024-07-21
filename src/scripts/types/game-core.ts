import { ICell, cubeCells } from './main-cube';

type plus = '+';
type mines = '-';
type divide = '/';
type multiply = '*';

export interface ISigns {
	plus: plus;
	mines: mines;
	divide: divide;
	multiply: multiply;
};

export type calcCubesAmount = (currentLevel: number)=>(void | never);

export type genCells = ()=>Array<HTMLDivElement>;

export type numsSigns = ()=>Array<string>;

export type randNumsFromRange = ()=>Array<number>;

export type updMainCubeWithElems = ()=>void;

export interface IPreparedLevelData{
	level: number;
	allCubeCells: cubeCells;
	levelElapsedTime: number;
	userResult: number;
	cpuResult: number;
	isSuccess: boolean;
}
//Get all types except of 'level'
export type preparedData = Omit<IPreparedLevelData, "level">;

export interface ILevelInformation{
	levelsInfo:Array<IPreparedLevelData>;
	prepareLevelData(levelData:preparedData):void;
	subscribe(levelData:(allLevelsData:IPreparedLevelData[])=>void):void;
	notifyAll():void;
	resetByDefault():void;
}

export type makeTF = (val:number)=>string;