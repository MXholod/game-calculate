import { sT, iT, tC, tS, ITSCallback, wLtH } from "./types/game-timer";
import { UserInteraction } from './user-Interaction';
import { updateRangeNodes, startNumbers } from './start-numbers';
import { toggleLevelBoard } from './level-board';

let timer: (HTMLDivElement | null) = null;

//number = 0; if window.setInterval or ReturnType<typeof setInterval>
let interval: null | ReturnType<typeof setInterval>;

export const startTimer:sT = (widgetTimer:HTMLDivElement):void=>{
	let elInfo = widgetTimer.children[1];
	//Write time to HTML Timer
	elInfo.children[1].textContent = initTimer();
	interval = setInterval(function(){ 
		elInfo.children[1].textContent = timeCounter();
	}, 1000);
}

const initTimer:iT = ():string=>{
	const addSec = UserInteraction.additionalSecToLevel;
	if(UserInteraction.gameLevel <= 5){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + addSec;
		return timeCounter();
	}else if(UserInteraction.gameLevel >= 6 || UserInteraction.gameLevel <= 8){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + (addSec * 2);
		return timeCounter();
	}else{//Since 8 level
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + (addSec * 3); 	
		return timeCounter();
	}
}

const timeCounter:tC = ():string=>{
	if(UserInteraction.totalLevelSeconds === 1){
		clearInterval(interval!);
		UserInteraction.levelTimeIsUp = false;
		UserInteraction.turnOnOffUserInteraction(false);
		interval = null;
		let { level: curLevInd } = UserInteraction.getLevel();
		//Set the next level
		UserInteraction.setLevel(UserInteraction.gameLevel);
		if(timer){
			writeLevelToHtml(timer);
			toggleLevelBoard(timer, false);
		}
		updateRangeNodes(curLevInd);
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
	//Suspend timer
	let elInfo = widgetTimer.children[1];
	clearInterval(interval!);
	interval = null;
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
//Private functions for testing
export { 
	startTimer as testStartTimer,
	initTimer as testInitTimer,
	timeCounter as testTimeCounter,
	timerSuspend as testTimerSuspend,
	writeLevelToHtml as testWriteLevelToHtml
}