import { ITimerBlock } from "./game-timer";
import { StartNumsBlock } from "./game-start-numbers";
import { LevelUserAmount, LevelCpuAmount } from "./game-current-amount";
import { StartGameButton, StopGameButton } from "./game-start";

export interface ILimitLevelValues{
	leftSlider: [number, number];
	rightSlider: [number, number];
} 

export interface ILimitLevel<T>{
	level: number
	isActive: boolean;
	values: T;
}

export type LimitLevels = Array<ILimitLevel<ILimitLevelValues>>;

export interface IUserInteraction {
	gameIdDateTime: number;
	gameLevel: number;
	limitLevels: LimitLevels;
	cubesAmount: number;
	additionalSecToLevel: number;
	totalLevelSeconds: number;
	levelTimeIsUp: boolean;
	gameInProgress: boolean;
	//It runs before the game will be started
	initBeforeGame: (timer:HTMLDivElement)=>boolean;
	startGame: (timer:HTMLDivElement)=>boolean;
	stopGame: (timer:HTMLDivElement)=>boolean;
	getLevel: ()=>ILimitLevel<ILimitLevelValues>;
	setLevel: (level: number)=>boolean;
	resultApprovedGoNextLevel: (timer:HTMLDivElement)=>void;
	turnOnOffUserInteraction: (onOff:boolean)=>void;
	checkLevelInitialNumbers: (leftN:string, rightN:string)=>boolean;
	resetGameDataByDefault: ()=>boolean;
	showHideGamePanel: (timer: HTMLDivElement, text: string)=>boolean;
}

