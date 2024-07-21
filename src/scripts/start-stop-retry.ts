import { ButtonsState, setBtnState, changeBtnActivity, playBtnActivity } from './types/start-stop-retry';
import { startNumbers } from './start-numbers';
import { UserInteraction } from './user-Interaction';

export const buttonState:ButtonsState = {
	startButton: {
		button: null,
		activity: false
	},
	stopButton: {
		button: null,
		activity: false
	},
	retryButton: {
		button: null,
		activity: false
	}
};
//Memorize button nodes
export const setButtonToState:setBtnState = (btn:HTMLButtonElement):void=>{
	const btnType = btn.getAttribute("id");
	switch(btnType){
		case "play": buttonState.startButton.button = btn;
			break;
		case "stop": buttonState.stopButton.button = btn;
			break;
		case "retry": buttonState.retryButton.button = btn;
			break;
	}
}
//Change a button activity
export const changeButtonActivity:changeBtnActivity = (btnName:string, activity:boolean):boolean=>{
	let btn: keyof typeof buttonState;
	for(btn in buttonState){
		if(buttonState[btn].button === null){
			return false;
		}
	}
	switch(btnName){
		case "play": buttonState.startButton.activity = activity;
					 buttonState.startButton!.button!.disabled = activity ? false : true;
			return true;
		case "stop":
					 buttonState.stopButton.activity = activity;
					 buttonState.stopButton!.button!.disabled = activity ? false : true;
			return true;
		case "retry":
					 buttonState.retryButton.activity = activity;
					 buttonState.retryButton!.button!.disabled = activity ? false : true;
			return true;
		default: return false;
	}
}
//Setting the play button activity depending on the selected numbers
export const playButtonActivity:playBtnActivity = ():boolean=>{
	const [leftNum, rightNum] = startNumbers.rangeNumbers;
	if(!leftNum || !rightNum) return false;
	if(UserInteraction.checkLevelInitialNumbers(leftNum, rightNum)){
		changeButtonActivity('play', true);
	}else{
		changeButtonActivity('play', false);
	}
	return true;
}
//Set buttons by default
export const setButtonsByDefault = ():void=>{
	changeButtonActivity("play", false);
	changeButtonActivity("stop", false);
	changeButtonActivity("retry", false);
}