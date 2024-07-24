import { getLevelInfoInstance } from './game-core';
import { IUserCpuBlock, IUserCpuState, mainCube, allowUserInputAmount, onUserInput, onApproveBtn, isResultButtonClicked, IResetValuesByDefault } from './types/user-cpu-amount';
import { UserInteraction } from './user-Interaction';
import { timerStop } from './timer';
import { preparedData } from './types/game-core';
import { changeStatsBtnActivity } from './game-statistics';
//Cached DOM nodes 
export const UserCpuBlock:IUserCpuBlock = {
	userLabel: null,
	userInput: null,
	approveBtn: null,
	cpuInput: null
};
//This data that is simply displayed in the fields for the user
const UserCpuState:IUserCpuState = {
	isValid: false,	//User entered a correct format of data into the input field
	onceResult: true
}
//The data of completed level
const PreparedLevelData:preparedData = {
	allCubeCells: [],
	levelElapsedTime: 0,
	userResult: 0,
	cpuResult: 0,
	isSuccess: false
};
//This function invokes when all cells are opened and accepts CPU value to store it here.
export const allowUserAmount:allowUserInputAmount = (mainCube:HTMLDivElement, mainCubeData:mainCube):boolean=>{
	const userCpuBlock:HTMLDivElement = <HTMLDivElement>(mainCube?.parentNode?.parentNode?.children[1]?.children[2]);
	//CPU
	const cpuSection:HTMLDivElement = <HTMLDivElement>(userCpuBlock?.children[2]);
	const cpuInput:HTMLInputElement = (cpuSection?.children[1]?.firstChild as HTMLInputElement);
	UserCpuBlock.cpuInput = cpuInput;
	//User
	const userSection:HTMLDivElement = <HTMLDivElement>(userCpuBlock?.children[0]);
	const userInputLabel:HTMLLabelElement = (userSection?.children[1] as HTMLLabelElement);
	UserCpuBlock.userLabel = userInputLabel;
	const userInput:HTMLInputElement = (userSection?.children[1]?.firstChild as HTMLInputElement);
	userInput.disabled = false;
	//Show amount panel
	UserCpuBlock.userLabel.style.setProperty('--userAmount', 'block');
	//User button
	const userBtn:HTMLButtonElement = (userSection?.children[2] as HTMLButtonElement);
	userBtn.disabled = false;
	//Remember CPU (correct) result to show it after user input
	PreparedLevelData.cpuResult = mainCubeData.cpuResult;
	PreparedLevelData.allCubeCells = mainCubeData.allCubeCells;
	return true;
}
//The user enters the result in the input field. 
export const handleUserInput:onUserInput = function(this:HTMLInputElement, e: Event):void{
	UserCpuBlock.userInput = this as HTMLInputElement;
	let styleSheet = document.styleSheets[0];
	//Remove CSS rule on each input
	for(let index in styleSheet.cssRules){
		let cssRule:CSSStyleRule = styleSheet.cssRules[index] as CSSStyleRule;
		//Searching for a suitable selector
		if (cssRule?.selectorText === '.wrapper .content .content__user-interaction .widget-game-current-amount__user-res label::before') {
			document.styleSheets[0].deleteRule(Number(index));
			break;
		}
	}
	let value:string = this?.value.trim();
	let reg = /^(-)?[0-9]+((,|\.)[0-9]{1,3})?$/;
	const correct = "content: \"Enter your result\";";
	const incorrect = "content: 'Incorrect value!'";
	const setRule = (rule: string):string => `.wrapper .content .content__user-interaction .widget-game-current-amount__user-res label::before { display:var(--userAmount, none); position:absolute; top:-25px; left:0; width:100%; height:25px; background-color:purple; font-size:.7em; text-align:center;animation: changing-colors linear 3s infinite alternate forwards; ${ rule } }`;
	if(value.match(reg)){ //"Correct";
		//Replace the comma with a period
		let valArr = value.split(',');
		let withoutComma = (valArr.length === 2) ? valArr[0]+'.'+valArr[1] : valArr[0];
		document.styleSheets[0].insertRule(setRule(correct), 0);
		//Remember User result before submit
		PreparedLevelData.userResult = Number(withoutComma);
		//Value is valid
		UserCpuState.isValid = true;
		return;
	}else{//"Incorrect";
		document.styleSheets[0].insertRule(setRule(incorrect), 0);
		//Value is invalid
		UserCpuState.isValid = false;
		return;
	}
}
//"Approve the result" button handler
export const handleButton:onApproveBtn = function(this:HTMLButtonElement, e: Event):void{
	//If userResult isn't zero, Input data is correct, 
	if((PreparedLevelData.userResult !== 0) && UserCpuState.isValid && UserCpuState.onceResult){
		//If the result button hasn't been pressed yet. Change its value to 'false' to prevent pressing it again
		if(UserCpuState.onceResult) UserCpuState.onceResult = false;
		//Hide amount panel
		if(UserCpuBlock?.userLabel){
			UserCpuBlock.userLabel.style.setProperty('--userAmount', 'none');
		}
		UserCpuBlock.approveBtn = this as HTMLButtonElement;
		UserCpuBlock.approveBtn.disabled = true; 
		//Displaying the correct CPU result in the field
		if(UserCpuBlock.cpuInput !== null) UserCpuBlock.cpuInput.value = String(PreparedLevelData.cpuResult);
		//Stop the game
		//Stop timer when result button is clicked
		timerStop();
		const asideElem:HTMLElement = UserCpuBlock?.userLabel?.parentNode?.parentNode?.parentNode as HTMLElement;
		const timer:HTMLDivElement = asideElem?.firstChild as HTMLDivElement;
		timer!.children[1]!.children[1]!.textContent = "00:00";
		//Reset level values. Go the animation back.
		UserInteraction.resultApprovedGoNextLevel(timer);
		//Prepare level data. Save to the Observer
		PreparedLevelData.levelElapsedTime = UserInteraction.totalLevelSeconds;
		if(PreparedLevelData.userResult === PreparedLevelData.cpuResult){
			PreparedLevelData.isSuccess = true;
		}
		//Passing the level data to the Observer, for all subscribers
		getLevelInfoInstance().prepareLevelData(PreparedLevelData);
		//Loop in Observer
		getLevelInfoInstance().notifyAll();
		//Enable the 'statistics' button
		changeStatsBtnActivity(false);
	}
}
//Was the result button clicked
export const isResBtnClicked:isResultButtonClicked = ():boolean=>{
	//If 'true' it was not clicked, if 'false' it was clicked.
	return UserCpuState.onceResult;
}
//Reset all values to default
export const resetValuesTodefault:IResetValuesByDefault = ():void=>{
	//Hide amount panel
	if(UserCpuBlock?.userLabel){
		UserCpuBlock.userLabel.style.setProperty('--userAmount', 'none');
	}
	PreparedLevelData.allCubeCells = [];
	PreparedLevelData.userResult = 0;
	PreparedLevelData.cpuResult = 0;
	PreparedLevelData.levelElapsedTime = 0;
	PreparedLevelData.isSuccess = false;
	UserCpuState.isValid = false;
	UserCpuState.onceResult = true;
	//Clear input values
	if((UserCpuBlock.userInput !== null) && (UserCpuBlock.cpuInput !== null)){
		UserCpuBlock.userInput.value = "";
		UserCpuBlock.cpuInput.value = "";
	}
}