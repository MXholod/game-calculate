import { levelsPack, ILevelsPackData, stateLevelsData, resultOnInitData, changePanelsOnPage, subsOnData, getDataFromStorage, setDataToStorage, clearDataFromStorage, packLevelsToStructure, IUniqueKeys, mergeStateLevelsStructure, IMapKeys, handleClearDataButton, displayGamesWithLevelsData, createDateFormat, IExpandedGameBlock, expandGameBlockHandler, IButtons, sortingLogicData, ITimeStampSuccess, IGamesByLevels, ITimeStampRemainingTime, IGamesSortedByTime } from './types/game-guide-result';
import { IPreparedLevelData } from "./types/game-core";
import { ICell } from './types/main-cube';
import { getInstance } from './pagination-results';

//The array of levels: { level: 0, levelElapsedTime: 0, userResult: 0, cpuResult: 0, isSuccess: false,dateTime:0 } 
export let stateLevels:stateLevelsData = [];
//Clear button element
let clearStorageButton:(null | HTMLButtonElement) = null; 
let noResultBlock:(null | HTMLDivElement) = null; 
let resultBlock:(null | HTMLDivElement) = null; 
let gamesContainer:(null | HTMLDivElement) = null;
//This object stores the currently expanded game block 
const expandedBlock:IExpandedGameBlock = {
	isExpanded: false,
	selectedElement: null,
	selectedNumElement: 0
};

//If data is in the localStorage the panel with data is showed otherwise the panel with no results is showed
export const resultOnInit:resultOnInitData = (panelResult:HTMLElement):boolean=>{
	if(!panelResult) return false;
	if(clearStorageButton === null){
		//Found clear data button element
		clearStorageButton = <HTMLButtonElement>(panelResult.children[2]?.firstChild?.lastChild);
		clearStorageButton.addEventListener("click", clearDataButton);
		//Find and subscribe on the element that contains all the games
		const blockGames = <HTMLDivElement>(panelResult?.children[2]?.children[2]);
		blockGames.addEventListener("click", expandGameBlock);
	}
	//Get results and no-results panels
	noResultBlock = (panelResult!.children[1] as HTMLDivElement);
	resultBlock = (panelResult!.children[2] as HTMLDivElement);
	//Get the preloader element
	const preloader = (panelResult!.nextSibling as HTMLElement);
	//Get the container of all the games
	gamesContainer = (resultBlock?.lastChild) as HTMLDivElement;
	//Subscribe on sort buttons container
	const sortButtonsContainer = <HTMLDivElement>(resultBlock.firstChild);
	sortButtonsContainer.addEventListener("mousedown", sortButtons);
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
		//Sorting by 'date' by default
		stateLevels = sortingLogic(stateLevels, 'date');
		//Preparation of the pagination block. Passing data and a number of the list items
		const pagePortion:ILevelsPackData[] = getInstance().preparePaginationBlock<ILevelsPackData>(stateLevels, 10, displayGamesWithLevels);
		//Displaying data of the games
		displayGamesWithLevels(pagePortion);
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
			//Reset all rows (games) to 'display:none'
			for(let i = 0; gameRows.length > i; i++){
				const gameRow = <HTMLDivElement>gameRows[i];
				gameRow.style.display = "none";
			}
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
					//Reset the levels of the current game
					for(let i = 0; sectionRow.children.length > i; i++){
						const levelCell = <HTMLElement>sectionRow.children[i];
						levelCell.style.display = "none";
					}
					//Go through the levels of the current game
					for(let j = 0, levelPortion = 0; levelData.length > j; j++, levelPortion+=6){
						//Level
						const level = <HTMLDivElement>(sectionRow.children[levelPortion]);
						level.style.display = "block";
						(level.firstChild as HTMLHeadingElement).textContent = String(levelData[j].level);
						//User result
						const userResult = <HTMLDivElement>(sectionRow.children[levelPortion+1]);
						userResult.style.display = "block";
						(userResult.lastChild as HTMLSpanElement).textContent = String(levelData[j].userResult);
						//CPU result
						const cpuResult = <HTMLDivElement>(sectionRow.children[levelPortion+2]);
						cpuResult.style.display = "block";
						(cpuResult.lastChild as HTMLSpanElement).textContent = String(levelData[j].cpuResult);
						//Progress
						const progress = <HTMLDivElement>(sectionRow.children[levelPortion+3]);
						progress.style.display = "block";
						const resSuccess = Boolean(levelData[j].isSuccess) ? "Good!" : "Bad :(";
						const resSpanEl = (progress.lastChild as HTMLSpanElement);
						resSpanEl.textContent = resSuccess;
						if(resSuccess === "Good!"){
							resSpanEl.style.color = "rgb(52 169 52)";
						}else{
							resSpanEl.style.color = "rgb(189 47 47)";
						}
						//Remaining time
						const remainingTime = <HTMLDivElement>(sectionRow.children[levelPortion+4]);
						remainingTime.style.display = "block";
						(remainingTime.lastChild as HTMLElement).textContent = String(levelData[j].levelElapsedTime);
						//Sequence of numbers
						const numSequence = <HTMLDivElement>(sectionRow.children[levelPortion+5]);
						numSequence.style.display = "flex";
						levelData[j].allCubeCells.sort(function<T extends ICell>(o1:T, o2:T):number{
							if(o1?.order !== undefined && o2?.order !== undefined){
								return o1.order - o2.order;
							}else if(o1?.order !== undefined){
								return -1;
							}else if(o2?.order !== undefined){
								return 1;
							}else{
								return 0;
							}
						});
						let sequence = levelData[j].allCubeCells.map(function(level, ind){
							++ind;
							if(ind === level.order){
								return level.sign.slice(1,2)+' '+level.value;
							}
						}).join(' ');
						//Concatenation of a sequence of numbers with a sum at the end
						sequence = `${sequence} = ${(levelData[j].cpuResult)}`;
						(numSequence.lastChild as HTMLDivElement).textContent = sequence;
					}
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
//Expand the game block when you click on it
export const expandGameBlock:expandGameBlockHandler = function(this:HTMLDivElement, e:MouseEvent):void{
	//Find element 'Header' of the selected game
	const gameHeader = (e.target as HTMLElement).closest('.block-data__header');
	if((gameHeader !== null) && (gameHeader.tagName === 'HEADER')){
		//Getting the row number
		const rowNumber = (gameHeader.firstChild as HTMLSpanElement)?.firstChild?.nodeValue;
		//First time click
		if((expandedBlock.selectedNumElement === 0)){
			//Write game block information 
			expandedBlock.isExpanded = true;
			expandedBlock.selectedElement = <HTMLElement>(gameHeader.nextSibling);
			expandedBlock.selectedNumElement = Number(rowNumber);
			//Expand first time
			if(!expandedBlock.selectedElement?.classList.contains('block-data__levels_expanded')){
				expandedBlock.selectedElement?.classList.add('block-data__levels_expanded');
			}
		}else if(expandedBlock.selectedNumElement !== Number(rowNumber)){//Another row selected
			//Roll up previous. Remove class that expands the block
			if(expandedBlock.selectedElement?.classList.contains('block-data__levels_expanded')){
				expandedBlock.selectedElement?.classList.remove('block-data__levels_expanded');
			}
			//Overwrite the old block with a new one
			expandedBlock.selectedElement = <HTMLElement>(gameHeader.nextSibling);
			if(!expandedBlock.selectedElement?.classList.contains('block-data__levels_expanded')){
				expandedBlock.selectedElement?.classList.add('block-data__levels_expanded');
			}
			//Rewrite game block information
			expandedBlock.isExpanded = true;
			expandedBlock.selectedNumElement = Number(rowNumber);
		}else if(expandedBlock.selectedNumElement === Number(rowNumber)){//The same row selected
			//Toggle 'isExpanded' value 
			expandedBlock.isExpanded = (expandedBlock.isExpanded) ? false : true;
			if(expandedBlock.selectedElement?.classList.contains('block-data__levels_expanded')){
				expandedBlock.selectedElement?.classList.remove('block-data__levels_expanded');
			}else{
				expandedBlock.selectedElement?.classList.add('block-data__levels_expanded');
			}
		}
	}
}
//Sort buttons
export const sortButtons:IButtons = function(this:HTMLDivElement, e:MouseEvent):void{
	const elem = <HTMLElement>(e.target);
	let labelValue:(string | null) = '';
	if(elem.tagName === "LABEL"){
		const labelEL = <HTMLLabelElement>elem;
		labelValue = labelEL?.firstChild?.nodeValue as string;
	}else if(elem.tagName === "INPUT"){
		const inputEL = <HTMLInputElement>elem;
		labelValue = inputEL?.previousSibling?.nodeValue as string;
	}
	const lastSpaceInd = labelValue.lastIndexOf(' ');
	const sortWord = labelValue.slice((lastSpaceInd + 1)); //'date' | 'success' | 'time' 
	switch(sortWord){
		case 'date': stateLevels = sortingLogic(stateLevels, sortWord); 
			break;
		case 'success': stateLevels = sortingLogic(stateLevels, sortWord); 
			break;
		case 'time': stateLevels = sortingLogic(stateLevels, sortWord); 
			break;
		default: if((elem instanceof HTMLLabelElement) || (elem instanceof HTMLInputElement)){
			stateLevels = sortingLogic(stateLevels, 'date'); //"The sort word is unknown"
		}
	}
	//Passing the newly sorted data to the pagination function to get a chunk of the data
	const pagePortion:ILevelsPackData[] = getInstance().displayFirstPageData<ILevelsPackData>(stateLevels);
	//Rewrite sorted data in HTML
	displayGamesWithLevels(pagePortion);
}
//Performing sorting
export const sortingLogic:sortingLogicData = (data:stateLevelsData, sortBy:string):stateLevelsData=>{
	//Array of results
	let newData:stateLevelsData = [];
	//Sort by 'date' (This is the default)
	if(sortBy === 'date'){ 
		newData = data.sort(function(o1,o2){
			let timeStampKey1 = Number(Object.keys(o1)[0]);
			let timeStampKey2 = Number(Object.keys(o2)[0]);
			if(o1[timeStampKey1] !== undefined && o2[timeStampKey2] !== undefined){
				return o2[timeStampKey2][0].dateTime - o1[timeStampKey1][0].dateTime;
			}else if(o1[timeStampKey1][0].dateTime !== undefined){
				return -1;
			}	
			else if(o2[timeStampKey2][0].dateTime !== undefined){
				return 1;
			}else{
				return 0;
			}
		});
	}else if(sortBy === 'success'){
		//Get all time stamps, which are the keys and count all success results of the levels as a value
		const allGamesSuccess:ITimeStampSuccess = {}; 
		data.forEach(function(game){
			const timeStampKey = Number(Object.keys(game)[0])
			const gameLevels = game[timeStampKey];
			if(!isNaN(timeStampKey)){
				for(let i = 0; gameLevels.length > i; i++){
					const successAmount = (gameLevels[i].isSuccess) ? 1 : 0;
					//First level
					if(typeof allGamesSuccess[timeStampKey] === 'undefined'){
						allGamesSuccess[timeStampKey] = successAmount;
					}else{//All other game levels
						allGamesSuccess[timeStampKey] = (successAmount + allGamesSuccess[timeStampKey]);
					}
				}
			}
		});
		//Sorting the object by values
		const sortedBySuccess = Object.entries(allGamesSuccess).sort(([,a],[,b])=>b-a);
		const allGamesSorted:ITimeStampSuccess = sortedBySuccess.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
		//or this way: Object.fromEntries(Object.entries(allGamesSuccess).sort(([,a],[,b]) => a-b));
		//Create new array of data according to the order
		for(let key in allGamesSorted){
			for(let i = 0; data.length > i; i++){
				let timeStampKey = Object.keys(data[i])[0];
				if(key === timeStampKey){
					newData.push(data[i]);
				}
			}
		}
	}else if(sortBy === 'time'){
		//Get all time stamps, which are the keys and count all remaining time of the levels as a value
		const gamesByLevelsAmount:IGamesByLevels = {};
		data.forEach(function(game){
			const timeStampKey = Number(Object.keys(game)[0]);
			//If a game is present
			if(game[timeStampKey] !== undefined){
				const totalSeconds = (game[timeStampKey] as levelsPack).reduce((acc, level, ind)=>{
					return acc += level.levelElapsedTime;
				},0);
				const currentGame:ITimeStampRemainingTime = {
					timeStamp: timeStampKey,
					allLevelsTime: totalSeconds
				};
				//First time. Initialization with an array 
				if(gamesByLevelsAmount[(game[timeStampKey].length)] === undefined){
					gamesByLevelsAmount[(game[timeStampKey].length)] = [];
					gamesByLevelsAmount[(game[timeStampKey].length)].push(currentGame);
				}else{
					gamesByLevelsAmount[(game[timeStampKey].length)].push(currentGame);
				}
			}
		});
		//Sorting the object by values
		for(let prop in gamesByLevelsAmount){
			gamesByLevelsAmount[prop].sort(function(game1, game2){
				return game1.allLevelsTime - game2.allLevelsTime;
			});
		}
		//Transfer from arrays to object
		const sortedLevels:IGamesSortedByTime = {};
		for(let prop in gamesByLevelsAmount){
			for(let i = 0; gamesByLevelsAmount[prop].length > i; i++){
				//console.log("Game ",gamesByLevelsAmount[prop][i]);
				sortedLevels[(gamesByLevelsAmount[prop][i].timeStamp)] = gamesByLevelsAmount[prop][i].allLevelsTime;
			}
		}
		//Preparing sorted data by the sum of remaining time 
		for(let prop in sortedLevels){
			for(let i = 0; data.length > i; i++){
				const timeStampKey = Object.keys(data[i])[0];
				//newData - array
				if(prop === timeStampKey){
					newData.push(data[i]); 	
				}
			}
		}
	}
	return newData;
}
