import { ISigns, signValues, selectedSigns, storeSelSigns, calcCubesAmount, genCells, numsSigns, randNumsFromRange, updMainCubeWithElems, ILevelInformation, IPreparedLevelData, preparedData, makeTF } from './types/game-core';
import { ICell } from './types/main-cube';
import { UserInteraction } from './user-Interaction';
import { startNumbers } from './start-numbers';
import { appllyNumsToCube } from './main-cube';

const signs:ISigns = {
	plus: '+',
	mines: '-',
	divide: '/',
	multiply: '*'
};

//Selected signs by the user
let selSigns:selectedSigns = [];  

//Calculating an amount of cells for each level
export const calculateCubesAmount:calcCubesAmount = function(currentLevel: number):(void | never){
	if(currentLevel < 1 || UserInteraction?.cubesAmount < 4) throw new Error("Can't create cubes");
	UserInteraction!.cubesAmount = ((currentLevel + 1) * (currentLevel + 1));
}
//Creating DIV elements that are used as cells with numbers
const generateCells:genCells = ():Array<HTMLDivElement>=>{
	const cells:HTMLDivElement[] = [];
	for(let i = 0; cells.length < UserInteraction!.cubesAmount;i++){
		const cell:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		cells.push(cell);
	}
	return cells;
}
//This function is being called in 'start-numbers' when the user selects a sign
export const storeSelectedSigns:storeSelSigns = (signs:selectedSigns):void=>{
	selSigns = signs;
} 
//Creating random numbers in range of the level
const numsWithSigns:numsSigns = ():Array<string>=>{
	//Empty array or an array, which contains 'all' 
	if(!selSigns.length || selSigns.includes('all')){
		//Make an array of signs 
		const arrSigns = Object.keys(signs).map(sign => {
			return signs[sign as keyof ISigns];
		});
		//Attaching signs to random numbers
		return randomNumbersFromRange().map((num)=>{
			const randomSign = arrSigns[ (Math.round(Math.random() * (arrSigns.length - 1))) ];
			return `(${randomSign}) ${num}`;
		});
	}else{//One or more signs but not all
		const comparedSigns: Array<signValues> = [];
		//If only one sign is selected
		if(selSigns.length === 1){
			for(let key in signs){
				if(key === selSigns[0]){
					comparedSigns[0] = signs[key as keyof ISigns];
				}
			}
			//Attaching sign to random numbers
			return randomNumbersFromRange().map((num)=>{
				return `(${comparedSigns[0]}) ${num}`;
			});
		}else{
			//If more than one sign
			for(let i = 0; selSigns.length > i; i++){
				comparedSigns[i] = signs[selSigns[i] as keyof ISigns];
			}
			//Attaching sign to random numbers
			return randomNumbersFromRange().map((num)=>{
				const randomSign = comparedSigns[ (Math.round(Math.random() * (comparedSigns.length - 1))) ];
				return `(${randomSign}) ${num}`;
			});
		}
	}
}
//Create random numbers from range
const randomNumbersFromRange:randNumsFromRange = ():Array<number>=>{
	const arrNums:number[] = [];
	//Number of edges
	let leftNum = parseInt(startNumbers.rangeNumbers[0]);
	let rightNum = parseInt(startNumbers.rangeNumbers[1]);
	if((arrNums.length === 0) && (leftNum !== 0) && (rightNum !== 0)){
		while(arrNums.length < UserInteraction.cubesAmount){
			//Random left or right side
			const leftOrRight = (Math.round(Math.random() * 10) % 2);
			if(leftOrRight === 0){//0 - Left side
				let leftRand = Math.round(Math.random() * leftNum);
				if(Math.abs(leftRand) === 0) continue;
				arrNums.push(leftRand);
			}else{//1 - Right side
				let rightRand = Math.round(Math.random() * rightNum);
				if(Math.abs(rightRand) === 0) continue;
				arrNums.push(rightRand);
			}
		}
	}
	if((arrNums.length === 0) && leftNum !== 0){
		while(arrNums.length < UserInteraction.cubesAmount){
			let leftRand = Math.round(Math.random() * leftNum);
			if(Math.abs(leftRand) === 0) continue;
			arrNums.push(leftRand);
		}
	}
	if((arrNums.length === 0) && rightNum !== 0){
		while(arrNums.length < UserInteraction.cubesAmount){
			let rightRand = Math.round(Math.random() * rightNum);
			if(Math.abs(rightRand) === 0) continue;
			arrNums.push(rightRand);
		}
	}
	return arrNums;
}
//Add new elements with numbers to the main cube
export const updateMainCubeWithElems:updMainCubeWithElems = ():void=>{
	const cells:HTMLDivElement[] = generateCells();
	const nums:string[] = numsWithSigns();
	appllyNumsToCube(cells, nums);
}

let LevelInfoInstance:(ILevelInformation | null) = null;
//Observer - it supplies data for a level 
export class LevelInformation implements ILevelInformation{
	private subscribers:((allLevelsData:IPreparedLevelData[])=>void)[] = [];
	public levelsInfo:IPreparedLevelData[] = [];
	//This method saves level data. It's a source of data that shares among other subscribers
	public prepareLevelData(levelData:preparedData):void{
		const level = UserInteraction.getLevel().level;
		let currentLevel = { ...levelData, level };
		this.levelsInfo.push(currentLevel);
	}
	public subscribe(subscriber:(allLevelsData:IPreparedLevelData[])=>void):void{
		this.subscribers.push(subscriber);
	}
	//Notify all subscribers
	public notifyAll():void{
		if(this.subscribers.length > 0){
			this.subscribers.forEach((f, ind)=>{
				//Passing all levels data to all subscribers 
				f(this.levelsInfo);
			});
		}
	}
	public resetByDefault():void{
		this.subscribers = [];
		this.levelsInfo = [];
	}
}
//Get the instance of the Observer
export const getLevelInfoInstance = ():ILevelInformation=>{
	if(LevelInfoInstance === null){
		LevelInfoInstance = new LevelInformation();
		return LevelInfoInstance;
	}
	return LevelInfoInstance;
}
//Makes time format
export const makeTimeFormat:makeTF = (value:number):string=>{
	const minute = 60;
	if(value <= 9){
		return "00:0"+value;
	}else if((value >= 10) && (value < 60)){
		return "00:"+value;
	}else if(value >= 60){
		const minutes = Math.floor(value / minute);
		const restOfSeconds = value - (minute * minutes);
		if(restOfSeconds === 0){
			const min = (minutes <= 9) ? "0"+minutes : minutes; 
			return min+":00";
		}else{
			const min = (minutes <= 9) ? "0"+minutes : minutes;
			const sec = (restOfSeconds <= 9) ? "0"+restOfSeconds : restOfSeconds;  
			return min+":"+sec;
		}
	}else{
		return "00:00";
	}
}
export {
	generateCells as testGenerateCells,
	numsWithSigns as testNumsWithSigns,
	randomNumbersFromRange as testRandomNumbersFromRange
}