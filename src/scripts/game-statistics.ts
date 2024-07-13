import { handleStatsBtn } from "./types/game-statistics";
import { UserInteraction } from "./user-Interaction";
import { IPreparedLevelData } from "./types/game-core";
import { getLevelInfoInstance, makeTimeFormat } from "./game-core";
import { ICurrentLevel, getCurLevelNode, levelsData, ITableStructure, cacheTableStruct, IButton, btnStateChanging, writeDataIntoTable, subsOnData, clearStatsData } from './types/game-statistics';

export const currentLevel:ICurrentLevel = {
	elem: null,
	value: 0
};

export let levelDataStatistics:levelsData = [
	//{ level: 0, levelElapsedTime: 0, userResult: 0, cpuResult: 0, isSuccess: false }
];

export const buttonState:IButton = {
	btn: null,
	stateBtn: false,
	labelBtn: "Open game statistics"
};

export const tableStructure:ITableStructure = {
	isCached: false,
	parentTableEl: null,
	tableRows: [
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null },
		{ rowEl: null, visible: false, orderNum: null, time: null, userRes: null, cpuRes: null, isSuccess: null }
	]
};
//Get the node to update the current value
export const getCurrentLevelNode:getCurLevelNode = (statBtn:HTMLButtonElement):void=>{
	const inpEl:HTMLInputElement = (statBtn?.parentNode?.firstChild?.lastChild?.lastChild as HTMLInputElement);
	if(inpEl){
		currentLevel.elem = inpEl;
	}
}
//Changing button state
export const buttonStateChanging:btnStateChanging = (btn:HTMLButtonElement):boolean=>{
	//Save element button. Do this only once
	if((buttonState.btn === null) && (btn instanceof HTMLButtonElement)){
		buttonState.btn = btn;
	}
	if(!buttonState.stateBtn){
		buttonState.labelBtn = "Close game statistics";
		buttonState!.btn!.textContent = buttonState.labelBtn;
	}else{
		buttonState.labelBtn = "Open game statistics";
		buttonState!.btn!.textContent = buttonState.labelBtn;
	}
	buttonState.stateBtn = !buttonState.stateBtn;
	return buttonState.stateBtn;
}
//Click on the button to see results
export const handleStatsButton: handleStatsBtn = function(this:HTMLButtonElement, e: MouseEvent):void{
	const levelsData:IPreparedLevelData[] = getLevelInfoInstance().levelsInfo;
	//If game in progress and at least one level approved
	if(UserInteraction.gameInProgress && (levelsData.length > 0)){
		//Find the table parent element
		if(this?.nextSibling?.nodeType === 1){
			tableStructure.parentTableEl = <HTMLDivElement>(this?.nextSibling?.lastChild!);
			//Caching DOM nodes when click only first time
			if(!tableStructure.isCached){ cacheTableStructure(); }
			//Changing button label and its state
			buttonStateChanging(this);
			//Show or Hide the table of statistics
			writeDataIntoStatTable();
		}
	}else{
		//console.log("The game does not continue!");
	}
}
//Caching all table statistics nodes. It invokes only once.
export const cacheTableStructure: cacheTableStruct = ():boolean=>{
	if(tableStructure.parentTableEl !== null){
		//Remember all rows
		for(let i = 0; i <= 10; i++){
			//Skip first table row. It is a table header
			if(i === 0) continue;
			if(tableStructure.tableRows[(i - 1)]){
				const row:HTMLDivElement = <HTMLDivElement>(tableStructure.parentTableEl?.children[i]);
				tableStructure.tableRows[(i - 1)].rowEl = row;
				//If click first time
				if(i === 1){ tableStructure.tableRows[0].visible = true; }
				//Assign children nodes to the row
				tableStructure.tableRows[(i - 1)].orderNum = <HTMLDivElement>(row?.children[0]);
				tableStructure.tableRows[(i - 1)].time = <HTMLDivElement>(row?.children[1]);
				tableStructure.tableRows[(i - 1)].userRes = <HTMLDivElement>(row?.children[2]);
				tableStructure.tableRows[(i - 1)].cpuRes = <HTMLDivElement>(row?.children[3]);
				tableStructure.tableRows[(i - 1)].isSuccess = <HTMLDivElement>(row?.children[4]);
			}
		}
		//All nodes were cached
		tableStructure.isCached = true;
		return true;
	}
	return false;
}
//Write data after click, into the statistics table
export const writeDataIntoStatTable: writeDataIntoTable = ():boolean=>{
	if(levelDataStatistics.length === 0) return false;
	//Displaying statistics depends on the button state
	if(buttonState.stateBtn){//Show statistics
		levelDataStatistics.forEach((curLevel, i)=>{
			//If row of a statistics should be visible
			if(curLevel.level){
				tableStructure.tableRows[i].visible = true;
				tableStructure.tableRows[i].rowEl!.style.display = "flex";
				tableStructure.tableRows[i].orderNum!.textContent = String(curLevel.level);
				tableStructure.tableRows[i].time!.textContent = makeTimeFormat(curLevel.levelElapsedTime);
				tableStructure.tableRows[i].userRes!.textContent = String(curLevel.userResult);
				tableStructure.tableRows[i].cpuRes!.textContent = String(curLevel.cpuResult);
					const isSuccess = curLevel.isSuccess ? "Good" : "Bad";
				tableStructure.tableRows[i].isSuccess!.textContent = isSuccess;
			}
		});
	}else{//Hide statistics
		levelDataStatistics.forEach((curLevel, i)=>{
			//If row of a statistics should be visible
			if(curLevel.level && tableStructure.tableRows[i].visible){
				tableStructure.tableRows[i].visible = false;
				tableStructure.tableRows[i].rowEl!.style.display = "none";
			}
		});
	}
	return true;
}
//This function subscribes on the levels data. It calls in core file
export const subscribesOnData:subsOnData = (levelsAllData:IPreparedLevelData[]):void=>{
	//The local array of - { level: 0, levelElapsedTime: 0, userResult: 0, cpuResult: 0, isSuccess: false } 
	//Rewrite local array with given data of all levels
	levelsAllData.forEach((curLevel, i)=>{
		levelDataStatistics[i] = { level: curLevel.level, 
			levelElapsedTime: curLevel.levelElapsedTime, 
			userResult: curLevel.userResult, 
			cpuResult: curLevel.cpuResult, 
			isSuccess: curLevel.isSuccess 
		};
	});
	//Update the level value
	if(currentLevel.elem){
		currentLevel.value = levelsAllData.length;
		currentLevel.elem!.value = String(currentLevel.value);
	}
	//Displaying statistics depends on the button state
	if(buttonState.stateBtn){//Show statistics
		levelDataStatistics.forEach((curLevel, i)=>{
			//If row of a statistics should be visible
			if(curLevel.level){
				tableStructure.tableRows[i].visible = true;
				tableStructure.tableRows[i].rowEl!.style.display = "flex";
				tableStructure.tableRows[i].orderNum!.textContent = String(curLevel.level);
				tableStructure.tableRows[i].time!.textContent = makeTimeFormat(curLevel.levelElapsedTime);
				tableStructure.tableRows[i].userRes!.textContent = String(curLevel.userResult);
				tableStructure.tableRows[i].cpuRes!.textContent = String(curLevel.cpuResult);
					const isSuccess = curLevel.isSuccess ? "Good" : "Bad";
				tableStructure.tableRows[i].isSuccess!.textContent = isSuccess;
			}
		});
	}
}
//Clear all the statistics data
export const clearStatisticsData:clearStatsData = ():boolean=>{
	//Set current level by default
	if(currentLevel.elem){
		currentLevel.value = 0;
		currentLevel.elem!.value = String(currentLevel.value);
	}
	tableStructure.isCached = false;
	//Clear all the rows in the table of statistics
	levelDataStatistics.forEach((curLevel, i)=>{
		if(tableStructure.tableRows[i].rowEl){
			tableStructure.tableRows[i].visible = false;
			tableStructure.tableRows[i].rowEl!.style.display = "none";
			tableStructure.tableRows[i].orderNum!.textContent = String(curLevel.level);
			tableStructure.tableRows[i].time!.textContent = "";
			tableStructure.tableRows[i].userRes!.textContent = "";
			tableStructure.tableRows[i].cpuRes!.textContent = "";
			tableStructure.tableRows[i].isSuccess!.textContent = "";
		}
	});
	//Set data of all levels by default
	levelDataStatistics = [];
	return true;
}