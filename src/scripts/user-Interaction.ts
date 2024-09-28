import { IUserInteraction, ILimitLevel, ILimitLevelValues } from './types/user-interaction';
import { startTimer, timerSuspend, writeLevelToHtml } from './timer';
import { rememberRangeNodes, updateRangeNodes, turnOnOffStartNumbers, resetValuesOnEndLevel, startNumbers, resetCacheRadioButtons } from './start-numbers';
import { toggleLevelBoard } from './level-board';
import { startCubeAnimation, clearNumsOfCube, allowClickOnCubeCells, backCubeAnimation } from './main-cube';
import { calculateCubesAmount, updateMainCubeWithElems, getLevelInfoInstance } from './game-core';
import { resetValuesTodefault } from './user-cpu-amount';
import { subscribesOnData, clearStatisticsData } from './game-statistics';
import { setButtonsByDefault, changeButtonActivity } from './start-stop-retry';
import { subscribesOnDataResult } from './game-guide-result';

export const UserInteraction:IUserInteraction = {
	gameIdDateTime: 0,
	gameLevel: 1,
	limitLevels: [
		{level: 1, isActive: false, values: { leftSlider: [-50,0], rightSlider: [0,50] } },
		{level: 2, isActive: false, values: { leftSlider: [-150,0], rightSlider: [0,150] } },
		{level: 3, isActive: false, values: { leftSlider: [-300,0], rightSlider: [0,300] } },
		{level: 4, isActive: false, values: { leftSlider: [-500,0], rightSlider: [0,500] } },
		{level: 5, isActive: false, values: { leftSlider: [-800,0], rightSlider: [0,800] } },
		{level: 6, isActive: false, values: { leftSlider: [-1000,0], rightSlider: [0,1000] } },
		{level: 7, isActive: false, values: { leftSlider: [-3000,0], rightSlider: [0,3000] } },
		{level: 8, isActive: false, values: { leftSlider: [-5000,0], rightSlider: [0,5000] } },
		{level: 9, isActive: false, values: { leftSlider: [-7000,0], rightSlider: [0,7000] } },
		{level: 10, isActive: false, values: { leftSlider: [-9999,0], rightSlider: [0,9999] } }
	],
	cubesAmount: 4,
	additionalSecToLevel: 10,
	totalLevelSeconds: 0,
	levelTimeIsUp: false,
	gameInProgress: false,
	initBeforeGame: function(timer:HTMLDivElement):boolean{
		if((this?.gameLevel === 1) && (!this!.gameInProgress)){
			rememberRangeNodes(timer);
			writeLevelToHtml(timer);
			//Show level-board
			toggleLevelBoard(timer, false);
			this!.gameInProgress = true;
			//Subscribers for data levels
			getLevelInfoInstance().subscribe(subscribesOnData);
			getLevelInfoInstance().subscribe(subscribesOnDataResult);
			//Set start, stop, retry buttons by default
			setButtonsByDefault();
			return true;
		}
		return false;
	},
	startGame: function(timer:HTMLDivElement):boolean{
		const [leftNum, rightNum] = startNumbers.rangeNumbers;
		if(!this!.levelTimeIsUp && this.checkLevelInitialNumbers(leftNum, rightNum) && this!.gameInProgress){
			this!.levelTimeIsUp = true;
			//Hide level-board
			toggleLevelBoard(timer, true);
			startCubeAnimation(timer, ()=>{
				startTimer(timer);
				//Allow to click on cube cells
				allowClickOnCubeCells();
				//Setting the 'play' button as inactive
				changeButtonActivity('play', false);
				//Setting the 'stop' button as active, to allow the user to interrupt the game 
				changeButtonActivity('stop', true);
			});
			//Clear the main cube
			if(clearNumsOfCube()){
				//Add elements with numbers to the main cube
				updateMainCubeWithElems();
			}
			//Disable user's buttons
			this?.turnOnOffUserInteraction(true);
			return true;
		}
		//console.log("Can't start playing ",leftNum, " ", rightNum);
		return false;
	},
	stopGame: function(timer:HTMLDivElement):boolean{
		if(this?.levelTimeIsUp)
		timerSuspend(timer, function(isStopped: boolean):boolean{
			if(isStopped){
				//Setting the 'stop' button as inactive, to prevent repeated click 
				changeButtonActivity('stop', false);
				backCubeAnimation(()=>{
					this.resetGameDataByDefault();
					//Clear the main cube
					clearNumsOfCube();
					updateRangeNodes(0);
					//Disable user's buttons
					this?.turnOnOffUserInteraction(false);
					//Setting the 'retry' button as active, to allow a new game to be restarted 
					changeButtonActivity('retry', true);
				});
			}
			return true;
		});
		return true;
	},
	getLevel: function():ILimitLevel<ILimitLevelValues>{
		const level = this?.limitLevels.find((lev)=>{
			if((lev.level === this.gameLevel)) return lev;
		});
		return level ?? this?.limitLevels[0];
	},
	setLevel: function(level:number):boolean{
		//The first level as active
		if((level === 1) && (this!.limitLevels[0].isActive === false)){
			this!.limitLevels[0].isActive = true;
			//Level up
			this!.gameLevel += 1;
			try{
				//Calculate the number of cubes for the current level
				calculateCubesAmount(this!.gameLevel); // 4,9,16,25,36,...
			}catch(e: unknown){
				if(e instanceof Error) console.log(e.message);
				this!.gameLevel = 0;
			}
			return true;
		}
		//All other game levels
		if(this?.gameLevel > 1 || this?.gameLevel <= 10){
			//Level up
			this!.gameLevel += 1;
			this.limitLevels = this.limitLevels.map((prevLevel)=>{
				//Reset all flags 'isActive' to false but current level set to true 
				if((prevLevel.level === level) && (prevLevel.isActive === false)){
					try{
						//Calculate the number of cubes for the current level
						calculateCubesAmount(this!.gameLevel); // 4,9,16,25,36,...
					}catch(e: unknown){
						if(e instanceof Error) console.log(e.message);
						this!.gameLevel = 1;
					}
					return { ...prevLevel, isActive: true };
				}else{
					return { ...prevLevel, isActive: false };
				}
			});
		}
		return true;
	},
	resultApprovedGoNextLevel: function(timer:HTMLDivElement):void{
		//Setting the 'stop' button as inactive, to prevent repeated click 
		changeButtonActivity('stop', false);
		backCubeAnimation(()=>{
			this!.levelTimeIsUp = false;
			//Release all buttons and fields
			this.turnOnOffUserInteraction.call(UserInteraction, false);
			//Set to default all values from 'user-cpu-amount' widget
			resetValuesTodefault();				
			let { level: curLevInd } = this.getLevel.call(UserInteraction);
			updateRangeNodes(curLevInd);
			//Set the next level
			this.setLevel.call(UserInteraction, this.gameLevel);
			if(timer){
				writeLevelToHtml(timer!);
				toggleLevelBoard(timer, false);
			}
		});
	},
	turnOnOffUserInteraction: function(onOff:boolean):void{
		turnOnOffStartNumbers(onOff);
		//Level completed
		if(this?.levelTimeIsUp === false && onOff === false){
			//Set to default HTML values in 'start-number' block when the level is passed
			resetValuesOnEndLevel();
		}
	},
	checkLevelInitialNumbers: function(leftN: string, rightN: string):boolean{
		let left = parseInt(leftN);
		let right = parseInt(rightN);
		if((left >= -3) && (right <= 3)){
			return false;
		}
		return true;
	},
	//Reset the game data to default values
	resetGameDataByDefault: function():boolean{
		if(this!.gameInProgress === true){
			this!.gameIdDateTime = 0;
			this!.gameLevel = 1;
			this!.gameInProgress = false;
			this!.levelTimeIsUp = false;
			this!.cubesAmount = 4;
			//Reset limitLevels by default
			this!.limitLevels = this!.limitLevels.map((lev)=>{
				return { ...lev, isActive: false }; 
			});
			//Reset Game data to default values
			getLevelInfoInstance().resetByDefault();
			//Set radio buttons by default
			resetCacheRadioButtons();
			//Clear the main cube
			clearNumsOfCube();
			//Set to default all values from 'user-cpu-amount' widget
			resetValuesTodefault();
			//Clear statistics table
			clearStatisticsData();
			//Set start, stop, retry buttons by default
			setButtonsByDefault();
			return true;
		}
		return false;
	},
	//Display panel 'Game over' or 'Win the game'
	showHideGamePanel: function(timer: HTMLDivElement, text: string):boolean{
		//Find an element to display it 
		const content:HTMLElement = timer?.parentNode?.parentNode as HTMLElement;
		if(!content) return false;
		let styleSheet = document.styleSheets[0];
		//Remove CSS rule if it equals to the string. Find and remember an index.
		let index = "";
		for(index in styleSheet.cssRules){
			let cssRule:CSSStyleRule = styleSheet.cssRules[index] as CSSStyleRule;
			//Searching for a suitable selector
			if (cssRule?.selectorText === '.wrapper .content::before') {
				document.styleSheets[0].deleteRule(Number(index));
				break;
			}
		}
		//Add CSS rule by found index before
		let rule = `.wrapper .content::before { content: \"${text}\"; text-align: center; padding-top: 5%; display: var(--game-message,none); width: 40%; height: 20%; position: absolute; top: 0px; left: 30%; background-color: pink; border: 1px solid rgb(0, 0, 0); z-index: 2; }`;
		document.styleSheets[0].insertRule(rule, Number(index));
			content.style.setProperty('--game-message', 'block');
		setTimeout(()=>{
			//Find an element to hide it
			content.style.setProperty('--game-message', 'none');
		},3000);
		return true;
	},
	//Completion of the last level
	lastLevelCompletion: function(timer: HTMLDivElement, text: string, lastLevel:number):boolean{
		if(this.gameLevel === lastLevel){
			//Set game data to default
			this.resetGameDataByDefault();
			//Displaying an information panel with a text about the completion of the game  
			this.showHideGamePanel(timer, text);
			//Subscribers for data levels
			getLevelInfoInstance().subscribe(subscribesOnData);
			getLevelInfoInstance().subscribe(subscribesOnDataResult);
			return true;
		}
		return false;
	}
}