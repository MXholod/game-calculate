import { cubeCells } from './main-cube';
import { preparedData } from './game-core';

export interface IUserCpuBlock{
	userLabel: HTMLLabelElement | null;
	userInput: HTMLInputElement | null;
	approveBtn: HTMLButtonElement | null;
	cpuInput: HTMLInputElement | null;
}

export interface IUserCpuState{
	isValid: boolean;
	onceResult: boolean;
}

export type mainCube = Pick<preparedData, "allCubeCells" | "cpuResult">;

export type allowUserInputAmount = (mainCube:HTMLDivElement, mainCubeData: mainCube)=>boolean;

export type onUserInput = (this:HTMLInputElement, e: Event)=>void;

export type onApproveBtn = (this:HTMLButtonElement, e: Event)=>void;

export type isResultButtonClicked = ()=>boolean;

export interface IResetValuesByDefault{
	():void;
}