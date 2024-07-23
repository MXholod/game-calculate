import { sT, iT, tC, tS, ITSCallback, wLtH, tStop } from './types/game-timer';
import { UserInteraction } from './user-Interaction';
import { toggleLevelBoard } from './level-board';
import { backCubeAnimation, disallowClickOnCells, clearNumsOfCube } from './main-cube';
import { isResBtnClicked, resetValuesTodefault } from './user-cpu-amount';
import { changeButtonActivity } from './start-stop-retry';

let timer: (HTMLDivElement | null) = null;

//number = 0; if window.setInterval or ReturnType<typeof setInterval>
let interval: null | ReturnType<typeof setInterval>;

export const startTimer:sT = (widgetTimer:HTMLDivElement):void=>{
	timer = (widgetTimer instanceof HTMLDivElement) ? widgetTimer : null;
	let elInfo = widgetTimer.children[1];
	//Write time to HTML Timer
	elInfo.children[1].textContent = initTimer();
	interval = setInterval(function(){ 
		elInfo.children[1].textContent = timeCounter();
	}, 1000);
}

const initTimer:iT = ():string=>{
	const addSec = UserInteraction.additionalSecToLevel;
	if(UserInteraction.gameLevel <= 2){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + addSec;
		return timeCounter();
	}else if((UserInteraction.gameLevel >= 3) && (UserInteraction.gameLevel <= 5)){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + (addSec * 3);
		return timeCounter();
	}else if((UserInteraction.gameLevel >= 6) && (UserInteraction.gameLevel <= 8)){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + (addSec * 4);
		return timeCounter();
	}else if((UserInteraction.gameLevel === 9) || (UserInteraction.gameLevel === 10)){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + (addSec * 5);
		return timeCounter();
	}else{
		return "00:00";
	}
}

const timeCounter:tC = ():string=>{
	if(UserInteraction.totalLevelSeconds === 1){
		//Stop timer
		timerStop();
		//Remove 'click' events on cells
		disallowClickOnCells();
		UserInteraction.levelTimeIsUp = false;
		//Setting the 'stop' button as inactive, to prevent repeated click 
		changeButtonActivity('stop', false);
		backCubeAnimation(()=>{
			//The 'Result' button was not pressed - "Game over"
			if(isResBtnClicked()){
				//Displaying the 'Game over' panel
				UserInteraction.showHideGamePanel(timer!, "Time is up! Game over.");
				//Set values by default in User-Interaction
				UserInteraction.resetGameDataByDefault();
				//Delete all cells in main cube
				clearNumsOfCube();
				//Set to default all numbers from 'start-numbers' widget 
				UserInteraction.turnOnOffUserInteraction(false);
				//Set to default all values from 'user-cpu-amount' widget
				resetValuesTodefault();
				//Reset to the first level
				UserInteraction.gameLevel = 1;
				writeLevelToHtml(timer!);
				//Setting the 'retry' button as active, to allow a new game to be restarted 
				changeButtonActivity('retry', true);
			}
		});
		return "00:00";
	}else if(UserInteraction.totalLevelSeconds < 60){
		UserInteraction.totalLevelSeconds -= 1;
		return UserInteraction.totalLevelSeconds <= 9 ? "00:"+"0"+UserInteraction.totalLevelSeconds : "00:"+UserInteraction.totalLevelSeconds;
	}else{
		UserInteraction.totalLevelSeconds -= 1;
		let minutes = Math.floor(UserInteraction.totalLevelSeconds / 60);
		let restSeconds = UserInteraction.totalLevelSeconds % 60;
		return (restSeconds === 0) ? '0'+minutes+':00' : (restSeconds <= 9) ? '0'+minutes+':0'+restSeconds : '0'+minutes+':'+restSeconds;
	}
}
export const timerSuspend:tS = (widgetTimer:HTMLDivElement, callback:ITSCallback):boolean=>{
	//Stop timer
	timerStop();
	let elInfo = widgetTimer.children[1];
	if(confirm("Do you really want to stop the game?")){
		elInfo.children[0].children[0].textContent = "1";
		elInfo.children[1].textContent = "00:00";
		return callback.call(UserInteraction,true);
	}else{
		//Restart Timer
		interval = setInterval(function(){ 
			elInfo.children[1].textContent = timeCounter();
		}, 1000);
		return true;
	}
	return false;
}
export const writeLevelToHtml:wLtH = (widgetTimer:HTMLDivElement):void=>{
	timer ??= widgetTimer;
	let elInfo = timer.children[1];
	elInfo.children[0].children[0].textContent = String(UserInteraction.gameLevel);
}
export const timerStop:tStop = ():boolean=>{
	if(interval){
		clearInterval(interval!);
		interval = null;
		return true;
	}
	return false;
}
//Private functions for testing
export { 
	startTimer as testStartTimer,
	initTimer as testInitTimer,
	timeCounter as testTimeCounter,
	timerSuspend as testTimerSuspend,
	writeLevelToHtml as testWriteLevelToHtml
}