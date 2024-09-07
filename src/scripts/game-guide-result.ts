import { levelsPack, ILevelsPackData, stateLevelsData, resultOnInitData, changePanelsOnPage, subsOnData, getDataFromStorage, setDataToStorage, clearDataFromStorage, packLevelsToStructure, IUniqueKeys, mergeStateLevelsStructure, IMapKeys, handleClearDataButton, displayGamesWithLevelsData, createDateFormat } from './types/game-guide-result';
import { IPreparedLevelData } from "./types/game-core";

//The array of levels: { level: 0, levelElapsedTime: 0, userResult: 0, cpuResult: 0, isSuccess: false,dateTime:0 } 
export let stateLevels:stateLevelsData = [];
//Clear button element
let clearStorageButton:(null | HTMLButtonElement) = null; 
let noResultBlock:(null | HTMLDivElement) = null; 
let resultBlock:(null | HTMLDivElement) = null; 
let gamesContainer:(null | HTMLDivElement) = null; 

//If data is in the localStorage the panel with data is showed otherwise the panel with no results is showed
export const resultOnInit:resultOnInitData = (panelResult:HTMLElement):boolean=>{
	if(!panelResult) return false;
	if(clearStorageButton === null){
		//Found clear data button element
		clearStorageButton = <HTMLButtonElement>(panelResult.children[2]?.firstChild?.lastChild);
		clearStorageButton.addEventListener("click", clearDataButton);
	}
	//Get results and no-results panels
	noResultBlock = (panelResult!.children[1] as HTMLDivElement);
	resultBlock = (panelResult!.children[2] as HTMLDivElement);
	//Get the preloader element
	const preloader = (panelResult!.nextSibling as HTMLElement);
	//Get the container of all the games
	gamesContainer = (resultBlock?.lastChild) as HTMLDivElement;
	//Removing the preloader
	let tPreloader:ReturnType<typeof setTimeout> = setTimeout(function(){
		if(preloader){
			preloader.style.display = "none";
			clearTimeout(tPreloader);
		}
	},3000);
	//Get all data from the LocalStorage
	const stateLocalStorage = getFromStorage();
	if(stateLocalStorage.length === 0){
		//Display panel with no-results
		noResultBlock.style.display = "block";
		resultBlock.style.display = "none";
		return false;
	}else{
		//Merge LocalStorage with state
		mergeStateLevels(stateLevels, stateLocalStorage);
		//Display panel with results
		noResultBlock.style.display = "none";
		resultBlock.style.display = "block";
		//Displaying data of the games
		displayGamesWithLevels(stateLevels);
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
	const stateLocalStorage = getFromStorage();
	if(stateLocalStorage.length !== 0){
		//Merge LocalStorage with state
		mergeStateLevels(stateLevels, stateLocalStorage);
	}
	//If levels already exist
	if((stateLevels.length > 0) && (levelsAllData.length > 0)){
		//Pack levels
		const allNewLevels = packLevels(levelsAllData);
		//Merge new levels with state
		const isMerged = mergeStateLevels(stateLevels, allNewLevels);
		if(isMerged){
			//Save to the LocalStorage
			setToStorage(stateLevels);
		}
	}else{//There is no level in the 'stateLevels'. Very first time level comes.
		//Simply assigning a new level to the state
		stateLevels = packLevels(levelsAllData);
		//Save to the LocalStorage
		setToStorage(stateLevels);
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
//Clear all the data, locally and from the storage
export const clearStorage:clearDataFromStorage = ():boolean=>{
	//Clear data in localStorage
	window.localStorage.clear();
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
//Merging the array (state) with the array (new levels)
export const mergeStateLevels:mergeStateLevelsStructure = function(stateLevels, newLevels):boolean{
	if(newLevels.length === 0) return false;
	//Temporary store all keys from the state 
	const keyMap:IMapKeys = {};
	//Iterate state
	for(let i = 0; stateLevels.length > i; i++){
		//Iterate new levels
		for(let j = 0; newLevels.length > j; j++){
			//Get a key of the current new level
			let newLevelKey = Object.keys(newLevels[j])[0];
			//If the new level is already in the state. Update existing ones
			if(stateLevels[i].hasOwnProperty(newLevelKey)){
				stateLevels[i][Number(newLevelKey)] = newLevels[j][Number(newLevelKey)];
			}
		}
		//Save all keys from the state to the map
		let stateLevelKey = Object.keys(stateLevels[i])[0];
		keyMap[stateLevelKey] = stateLevelKey;
	}
	//Compare new levels with map (state keys)
	for(let i = 0; newLevels.length > i; i++){
		let newLevelKey = Object.keys(newLevels[i])[0];
		//If new level's key doesn't exist in map, add this level to the state 
		if(!(newLevelKey in keyMap)){
			stateLevels.push(newLevels[i]);
		}	
	}
	return true;
}
//This is a handler of the button that clears all the data
export const clearDataButton:handleClearDataButton = function(this:HTMLButtonElement, e:MouseEvent):void{
	const willDelete = window.confirm("Do you really want to delete all data?");
	if(willDelete){
		//Clear LocalStorage
		clearStorage();
		//Clear the array of levels
		stateLevels = [];
		//Display no result panel
		if((noResultBlock !== null) && (resultBlock !== null)){
			//Display panel with no-results
			noResultBlock.style.display = "block";
			resultBlock.style.display = "none";
		}
	}
}
//Displaying games with the levels in template
export const displayGamesWithLevels:displayGamesWithLevelsData = (games:stateLevelsData):void=>{
	if(gamesContainer !== null){
		//Get all children rows that display game data
		const gameRows:HTMLCollection = gamesContainer.children;
		//If there are HTML rows to display game data
		if(gameRows.length > 0){
			//If there is data to display in rows
			if(games.length > 0){
				//Go through the children rows and insert data
				for(let i = 0; games.length > i; i++){
					//Display game rows according to the data
					const gameRow = <HTMLDivElement>gameRows[i];
					gameRow.style.display = "flex";
					//Get the header of the row. Here is the date is displayed
					const headerRow = <HTMLElement>gameRow.firstChild;
					const timeElement = <HTMLElement>headerRow?.children[1]?.lastChild;
					const passedLevelsElement = <HTMLElement>headerRow?.children[2]?.lastChild;
					//Get the section with levels of the game.
					const sectionRow = <HTMLElement>gameRow.lastChild;
					//Get the data of the current level
					const currentLevelKey = Object.keys(games[i])[0];
					const levelData:levelsPack = games[i][Number(currentLevelKey)];
					//Set the date and time in the header of the game
					timeElement.textContent = dateFormat(currentLevelKey);
					//Set an amount of passed levels
					passedLevelsElement.textContent = String(levelData.length); 
				}
			}
		}
	}
}
//Date format creation
export const dateFormat:createDateFormat = (timeStamp:string):string=>{
	const dt = new Date(Number(timeStamp));
	const date = (dt.getDate() <= 9) ? '0'+dt.getDate() : dt.getDate();
	const month = (dt.getMonth() + 1 <= 9) ? '0'+(dt.getMonth() + 1) : dt.getMonth() + 1;
	const hours = dt.getHours() <= 9 ? '0'+dt.getHours() : dt.getHours();
	const minutes = dt.getMinutes() <= 9 ? '0'+dt.getMinutes() : dt.getMinutes();
	const seconds = dt.getSeconds() <= 9 ? '0'+dt.getSeconds() : dt.getSeconds();
	const dateTime = `${dt.getFullYear()}-${month}-${date}  ${hours}:${minutes}:${seconds}`;
	return dateTime;
}