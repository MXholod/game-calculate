import { handleStatsBtn } from "./types/game-statistics";
import { UserInteraction } from "./user-Interaction";
import { IPreparedLevelData } from "./types/game-core";
import { getLevelInfoInstance } from "./game-core";
import { ITableStructure, cacheTableStruct, IButton, btnStateChanging } from './types/game-statistics';

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
	const levelData:IPreparedLevelData[] = getLevelInfoInstance().levelsInfo;
	//If game in progress and at least one level approved
	if(UserInteraction.gameInProgress && (levelData.length > 0)){
		//Find the table parent element
		if(this?.nextSibling?.nodeType === 1){
			tableStructure.parentTableEl = <HTMLDivElement>(this?.nextSibling?.lastChild!);
			//Caching DOM nodes when click only first time
			if(!tableStructure.isCached){ cacheTableStructure(); }
			//Changing button label and its state
			buttonStateChanging(this);
			console.log("You are in the game 1 ", tableStructure.tableRows);
			
		}
	}else{
		console.log("The game does not continue!");
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