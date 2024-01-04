import { sT, cC, dL, nL, iT, tC } from "./types/game-timer";
import { UserInteraction } from './user-Interaction';

//number = 0; if window.setInterval or ReturnType<typeof setInterval>
let interval: ReturnType<typeof setInterval>;

export const startTimer:sT = (initLevel: number, widgetTimer:HTMLDivElement):void=>{
	try{
		calculateCubesAmount(initLevel, UserInteraction.cubesAmount); // 4,9,16,25,36,...
	}catch(e: unknown){
		if(e instanceof Error) console.log(e.message);
		UserInteraction.gameLevel = 1;
	}
	let elInfo = widgetTimer.children[1];
	//Write data to HTML Timer
	elInfo.children[0].children[0].textContent = displayLevel(UserInteraction.cubesAmount);
	elInfo.children[1].textContent = initTimer();
	interval = setInterval(function(){ 
		elInfo.children[1].textContent = timeCounter();
	}, 1000);
}

const calculateCubesAmount:cC = (currentLevel: number, cubesAmount: number):(void | never)=>{
	if(currentLevel < 1 || cubesAmount < 4) throw new Error("Can't create cubes");
	UserInteraction.cubesAmount = (currentLevel + 1) * (currentLevel + 1);
}

export const displayLevel:dL = (cubeAmount: number):string=>{
	if(cubeAmount > 4){
		return String(UserInteraction.gameLevel);
	}
	return '1';
}

export const nextLevel:nL = ():string=>{
	if(UserInteraction.cubesAmount > 4){
		UserInteraction.gameLevel += 1;
		return String(UserInteraction.gameLevel);
	}
	return '1';
}

const initTimer:iT = ():string=>{
	const addSec = UserInteraction.additionalSecToLevel;
	if(UserInteraction.gameLevel <= 5){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + addSec;
		return timeCounter();
	}else if(UserInteraction.gameLevel >= 6 || UserInteraction.gameLevel <= 8){
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + (addSec * 2);
		return timeCounter();
	}else{//Since 6 level
		UserInteraction.totalLevelSeconds = (UserInteraction.gameLevel * addSec) + (addSec * 3); 	
		return timeCounter();
	}
}

const timeCounter:tC = ():string=>{
	if(UserInteraction.totalLevelSeconds === 1){
		clearInterval(interval);
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
//Private functions for testing
export { 
	startTimer as testStartTimer,
	nextLevel as testNextLevel,
	calculateCubesAmount as testCalculateCubesAmount,
	displayLevel as testDisplayLevel,
	initTimer as testInitTimer,
	timeCounter as testTimeCounter
}