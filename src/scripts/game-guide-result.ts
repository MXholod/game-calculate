import { levelsPack, ILevelsPackData, stateLevelsData, resultOnInitData, changePanelsOnPage, subsOnData, getDataFromStorage, setDataToStorage, packLevelsToStructure, IUniqueKeys } from './types/game-guide-result';
import { IPreparedLevelData } from "./types/game-core";

//The array of levels: { level: 0, levelElapsedTime: 0, userResult: 0, cpuResult: 0, isSuccess: false,dateTime:0 } 
export let stateLevels:stateLevelsData = [];

//If data is in the localStorage the panel with data is showed otherwise the panel with no results is showed
export const resultOnInit:resultOnInitData = (panelResult:HTMLElement):boolean=>{
	if(!panelResult) return false;
	const noResultBlock = (panelResult!.children[1] as HTMLDivElement);
	const resultBlock = (panelResult!.children[2] as HTMLDivElement);
	if(getFromStorage().length === 0){
		noResultBlock.style.display = "block";
		resultBlock.style.display = "none";
		return false;
	}else{
		noResultBlock.style.display = "none";
		resultBlock.style.display = "block";
		return true;
	}
}
//This function is responsible for switching between panels
export const changePanels:changePanelsOnPage = function(this:HTMLButtonElement, e:MouseEvent):void{
	if(this instanceof HTMLButtonElement){
		if(this.dataset && this.dataset.nav){
			const pannels = this.parentNode?.parentNode?.lastChild as HTMLElement;
			const guidePanel:HTMLElement = (pannels!.firstChild as HTMLElement);
			const resultPanel:HTMLElement = (pannels!.lastChild as HTMLElement);
			if(guidePanel && resultPanel){
				if(this.dataset.nav === "guide"){
					guidePanel!.style!.zIndex = "1";
					resultPanel!.style!.zIndex = "0";
				}
				if(this.dataset.nav === "result"){
					guidePanel!.style!.zIndex = "0";
					resultPanel!.style!.zIndex = "1";
				}
			}
		}
	}
}
//This function subscribes on the levels data. It calls in user-Interaction file
export const subscribesOnDataResult:subsOnData = (levelsAllData:levelsPack):void=>{
	//If levels already exist
	if((stateLevels.length > 0) && (levelsAllData.length > 0)){
		const allNewLevels = packLevels(levelsAllData);
		console.log(allNewLevels);
		//Merge 'allNewLevels' with 'stateLevels'
		//Save to the LocalStorage
	}else{//There is no level. Very first level comes.
		//Simply assigning a new level to the table of the statistics
		stateLevels = packLevels(levelsAllData);
		//Save to the LocalStorage
	}
}
//Get data from storage
export const getFromStorage:getDataFromStorage = ():stateLevelsData=>{
	if(window.localStorage.getItem('levels')){
		const levelsJson:string = <string>(window.localStorage.getItem('levels'));
		const levels = JSON.parse(levelsJson);
		return levels;
	}
	return [];
}
//Set data to storage
export const setToStorage:setDataToStorage = (levels: stateLevelsData):boolean=>{
	if(levels.length === 0){ 
		return false; 
	}else{
		//Serialize to JSON
		const levelsJson = JSON.stringify(levels);
		//Save new data to localStorage
		window.localStorage.setItem('levels', levelsJson);
	}
	return true;
}
//Packing levels into a set
export const packLevels:packLevelsToStructure = function(levels:levelsPack):stateLevelsData{
	const packedLevels:stateLevelsData = [];
	const uniqueKeys:IUniqueKeys = {};
	//Find unique 'dateTime' properties
	for(let i = 0; levels.length > i; i++){
		uniqueKeys[levels[i].dateTime] = levels[i].dateTime;
	}
	//Get an array of unique keys
	const uKeysArr = Object.keys(uniqueKeys).map((el)=>uniqueKeys[Number(el)]);
	//Make the new structure for the data
	for(let i = 0; uKeysArr.length > i; i++){
		const packedLevel:ILevelsPackData = {};
			packedLevel[uKeysArr[i]] = [];
		for(let j = 0; levels.length > j; j++){
			if(uKeysArr[i] === levels[j].dateTime){
				packedLevel[uKeysArr[i]].push(levels[j]);
			}
		}
		packedLevels.push(packedLevel);
	}
	return packedLevels;
}