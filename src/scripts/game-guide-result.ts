import { resultOnInitData, stateLevelsData, changePanelsOnPage, subsOnData, getDataFromStorage, setDataToStorage } from './types/game-guide-result';
import { IPreparedLevelData } from "./types/game-core";

//The array of data of all levels
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
export const subscribesOnDataResult:subsOnData = (levelsAllData:IPreparedLevelData[]):void=>{
	//The local array of - { level: 0, levelElapsedTime: 0, userResult: 0, cpuResult: 0, isSuccess: false } 
	if(levelsAllData.length > 0){
		console.log("All levels in results: ",levelsAllData);
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
