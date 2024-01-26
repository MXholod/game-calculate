import {
	ButtonNumberMode,
	StartNumsBlock,
	chooseRadioMode,
	rememberRangeSliderNodes,
	updateRangeSliderNodes,
	processRangeMode,
	changeModeToCurrent,
	displayRange,
	saveInpValWithRecalc,
	recalculateValToMode,
	rangeNumsKeyboard,
	turnOnOffStartNums,
	resetValsOnEndLevel
} from "./types/game-start-numbers";
import { ILimitLevel, ILimitLevelValues } from "./types/user-interaction";
import { UserInteraction } from "./user-Interaction";

//Object of the modes
export const startNumbers:StartNumsBlock = {
	buttonMode: [ ["Odd", false], ["Even", false], ["Mixed", true] ],
	rangeNumbers: ['0', '0'],
	sliderBlockNodes: {
		mainSliderBlock: null,
		outputFrom: null,
		outputTo: null,
		leftSlider: null,
		rightSlider: null
	},
	randomInputs: {
		leftInp: null,
		rightInp: null
	}
};
//Switch between modes (radio buttons) 'Odd' | 'Even' | 'Mixed'
export const chooseRadio:chooseRadioMode = function(event: Event):void{
	const currentEl:HTMLElement = event.target! as HTMLElement;
	//Get element with class 'widget-game-initial-numbers__title'
	const div:HTMLDivElement = event.currentTarget! as HTMLDivElement;
	//Get element with class 'widget-game-initial-numbers__sliders'
	const div2:HTMLDivElement = <HTMLDivElement>(div?.nextElementSibling?.firstChild);
	const otput1 = <HTMLOutputElement>div2?.children[0]?.children[1];
	const otput2 = <HTMLOutputElement>div2?.children[0]?.children[3];
	let numberMode:string = '';
	if(currentEl.tagName === "LABEL"){
		//Stop label behaviour to prevent double behaviour
		(<PointerEvent>event).preventDefault();
		//Set input as checked when click on the 'label'
		(currentEl.children[0] as HTMLInputElement).checked = true; 
		if(currentEl.childNodes[0]){
			if(currentEl.childNodes[0].nodeType === 3){
				numberMode = currentEl.childNodes[0]?.nodeValue ? currentEl.childNodes[0]?.nodeValue : '';
				processRange(numberMode);
				//Recalculate after switch the mode
				recalculateToMode();
				otput1.textContent = startNumbers.rangeNumbers[0];
				otput2.textContent = startNumbers.rangeNumbers[1];
			}
		}
	}else if(currentEl.tagName === "INPUT"){
		numberMode = <string>currentEl.dataset.name;
		processRange(numberMode);
		//Recalculate after switch the mode
		recalculateToMode();
		otput1.textContent = startNumbers.rangeNumbers[0];
		otput2.textContent = startNumbers.rangeNumbers[1];
	}
}
//The function is called only once when the game starts
export const rememberRangeNodes: rememberRangeSliderNodes = function(timer:HTMLDivElement):boolean{
	let blockNumbers: (null | HTMLDivElement);
	if(timer!.nextSibling?.nodeType === 1){
		blockNumbers = (timer!.nextSibling) as HTMLDivElement;
	}else{
		if(timer!.nextSibling === null) return false;
		blockNumbers = (timer!.nextSibling!.nextSibling) as HTMLDivElement;
	}
	if((blockNumbers.children[0] instanceof HTMLDivElement) && (blockNumbers.children[1] instanceof HTMLDivElement)){
	const slidersBlock:HTMLDivElement = (blockNumbers.children[1].children[0]) as HTMLDivElement;
		//Select a range of numbers from minimum to maximum
		if(slidersBlock?.firstChild?.nodeType === 3){
			//Text description for sliders
			const leftEdge = UserInteraction.limitLevels[0].values.leftSlider[0];
			const rightEdge = UserInteraction.limitLevels[0].values.rightSlider[1];
			slidersBlock.firstChild.textContent = `Select a range of numbers. Possible game values are from a minimum of -9999 to a maximum of 9999. The current number level range is ${leftEdge} to ${rightEdge}`;
		}
		const outFrom:HTMLOutputElement = slidersBlock.children[0].children[1] as HTMLOutputElement;
		const outTo:HTMLOutputElement = slidersBlock.children[0].children[3] as HTMLOutputElement;
		const leftSlider:HTMLInputElement = slidersBlock.children[1] as HTMLInputElement;
		const rightSlider:HTMLInputElement = slidersBlock.children[2] as HTMLInputElement;
			//Assign values to output values
			outFrom.textContent = startNumbers.rangeNumbers[0];
			outTo.textContent = startNumbers.rangeNumbers[1];
			//Assign values to input range values
			leftSlider.min = String(UserInteraction.limitLevels[0].values.leftSlider[0]);
			leftSlider.max = String(UserInteraction.limitLevels[0].values.leftSlider[1]);
			leftSlider.value = String(startNumbers.rangeNumbers[0]);
			rightSlider.min = String(UserInteraction.limitLevels[0].values.rightSlider[0]);
			rightSlider.max = String(UserInteraction.limitLevels[0].values.rightSlider[1]);
			rightSlider.value = String(startNumbers.rangeNumbers[1]);
		//Assign nodes to object properties
		startNumbers.sliderBlockNodes.mainSliderBlock = slidersBlock;
		startNumbers.sliderBlockNodes.outputFrom = outFrom;
		startNumbers.sliderBlockNodes.outputTo = outTo;
		startNumbers.sliderBlockNodes.leftSlider = leftSlider;
		startNumbers.sliderBlockNodes.rightSlider = rightSlider;
		return true;
	}
	return false;
}
//The function is called before the start of each level to write down values into HTML
export const updateRangeNodes: updateRangeSliderNodes = function(currentLevelIndex: number):boolean{
	//Text description for sliders
	const leftEdge = UserInteraction.limitLevels[currentLevelIndex].values.leftSlider[0];
	const rightEdge = UserInteraction.limitLevels[currentLevelIndex].values.rightSlider[1];
	const text = `Select a range of numbers. Possible game values are from a minimum of -9999 to a maximum of 9999. The current number level range is ${leftEdge} to ${rightEdge}`;
	if(startNumbers.sliderBlockNodes.mainSliderBlock !== null)
		startNumbers.sliderBlockNodes.mainSliderBlock.firstChild!.textContent = text;
	//Output elements
	if(startNumbers.sliderBlockNodes.outputFrom !== null && startNumbers.sliderBlockNodes.outputTo !== null){
		startNumbers.sliderBlockNodes.outputFrom!.textContent = startNumbers.rangeNumbers[0];
		startNumbers.sliderBlockNodes.outputTo!.textContent = startNumbers.rangeNumbers[1];
	}
	//Input values
	if(startNumbers.sliderBlockNodes.leftSlider !== null && startNumbers.sliderBlockNodes.rightSlider !== null){
		const inputValue: ILimitLevelValues = UserInteraction.limitLevels[currentLevelIndex].values;
		startNumbers.sliderBlockNodes.leftSlider!.min = String(inputValue.leftSlider[0]);
		startNumbers.sliderBlockNodes.leftSlider!.max = String(inputValue.leftSlider[1]);
		startNumbers.sliderBlockNodes.leftSlider!.value = String(startNumbers.rangeNumbers[0]);
		startNumbers.sliderBlockNodes.rightSlider!.min = String(inputValue.rightSlider[0]);
		startNumbers.sliderBlockNodes.rightSlider!.max = String(inputValue.rightSlider[1]);
		startNumbers.sliderBlockNodes.rightSlider!.value = String(startNumbers.rangeNumbers[1]);
	}
	return true;
} 
//Save current mode and recalculate values according to it
const processRange:processRangeMode = (rangeMode: string):boolean=>{
	//Checking whether the same mode is selected again or not
	const chooseSameMode = startNumbers.buttonMode.find((el)=>(el[0] === rangeMode && el[1] === true));
	//The same mode is selected again
	if(Array.isArray(chooseSameMode)){
		return false;
	}
	switch(rangeMode){
		case 'Odd' : changeMode('Odd'); return true;
		case 'Even' : changeMode('Even'); return true;
		case 'Mixed': changeMode('Mixed'); return true;
		default: return false;
	}
}
//Set the correct mode
const changeMode:changeModeToCurrent = (numValue:string):void=>{
	//Find element with 'true' value
	startNumbers.buttonMode.map((elArr)=>{
		if(elArr[1] === true){
			return elArr[1] = false;
		}else if(elArr[0] === numValue){
			//Recalculate values according to the 'Odd' | 'Even' | 'Mixed' for new mode
			return elArr[1] = true;
		}
		return elArr[1] = false;
	});
}
//Range sliders 
export const displayRangeNums:displayRange = (rangeInput:HTMLInputElement, recalc:boolean = false):string=>{
	return saveInputValues(rangeInput.name, rangeInput.value, recalc) ?? rangeInput.value;
} 
//Range sliders to output
const saveInputValues:saveInpValWithRecalc = function(elemName:string, value:string, recalc:boolean):(string | undefined){
	//If random values are generated, they are removed when the sliders are dragged
	if((startNumbers.randomInputs?.leftInp !== null) && (startNumbers.randomInputs.rightInp !== null)){
		startNumbers.randomInputs.leftInp.value = '';
		startNumbers.randomInputs.rightInp.value = '';
		startNumbers.randomInputs.leftInp = null;
		startNumbers.randomInputs.rightInp = null;
	}
	if(elemName === "range1"){
		if(!recalc){
			startNumbers.rangeNumbers[0] = value;
		}else{//When release slider
			recalculateToMode();
		}
		return startNumbers.rangeNumbers[0];
	}else if(elemName === "range2"){
		if(!recalc){
			startNumbers.rangeNumbers[1] = value;
		}else{//When release slider
			recalculateToMode();
		}
		return startNumbers.rangeNumbers[1];
	}
}
//Recalculate values when dragging sliders according to the 'mode'. It invokes on mouse-up event 
export const recalculateToMode:recalculateValToMode = ():void=>{
	const indexLevel = UserInteraction.gameLevel - 1;
	const { values: { leftSlider, rightSlider } } = UserInteraction.limitLevels[(indexLevel)];
	//Define current mode
	const index = startNumbers.buttonMode.findIndex((el)=>el[1] === true);
	const mode = startNumbers.buttonMode[index][0];
	//From string to number
	let leftRange:number = 0;
	let rightRange:number = 0;
	//If random numbers are generated and random values exist
	const inputs = startNumbers.randomInputs;//Input elements or null
	const leftRand = startNumbers.rangeNumbers[0];
	const rightRand = startNumbers.rangeNumbers[1];
	let isRandom = false;
	if((inputs?.leftInp !== null && leftRand !== "") && (inputs?.rightInp !== null && rightRand !== "")){
		leftRange = parseInt(startNumbers.rangeNumbers[0]);
		rightRange = parseInt(startNumbers.rangeNumbers[1]);
		isRandom = true;
	}else{
		leftRange = parseInt(startNumbers.rangeNumbers[0]); //Left slider value
		rightRange = parseInt(startNumbers.rangeNumbers[1]); //Right slider value
	}
	if(mode === 'Odd'){
		let leftR = (leftRange % 2 === 0) ? leftRange !== 0 ? leftRange + (-1) : leftRange : leftRange;
			leftR = (leftR >= 0) ? 0 : leftR;
			leftR = (leftR <= (leftSlider[0] + 1)) ? (leftSlider[0] + 1) : leftR;
			startNumbers.rangeNumbers[0] = String(leftR);
		let rightR = (rightRange % 2 === 0) ? rightRange + (-1) : rightRange;
			rightR = (rightR <= 0) ? 0 : rightR;
			rightR = (rightR >= (rightSlider[1] - 1)) ? (rightSlider[1] - 1) : rightR;
			startNumbers.rangeNumbers[1] = String(rightR);
			if(isRandom){
				startNumbers.randomInputs!.leftInp!.value = String(leftR);
				startNumbers.randomInputs!.rightInp!.value = String(rightR);
			}
	}else if(mode === 'Even'){
		let leftR = (leftRange % 2 === 0) ? leftRange : (leftRange + 1);
			leftR = (leftR >= 0) ? 0 : leftR;
			leftR = (leftR <= leftSlider[0]) ? leftSlider[0] : leftR;
			startNumbers.rangeNumbers[0] = String(leftR);
		let rightR = (rightRange % 2 === 0) ? rightRange : (rightRange + 1);
			rightR = (rightR <= 0) ? 0 : rightR;
			rightR = (rightR >= rightSlider[1]) ? rightSlider[1] : rightR;
			startNumbers.rangeNumbers[1] = String(rightR);
			if(isRandom){
				startNumbers.randomInputs!.leftInp!.value = String(leftR);
				startNumbers.randomInputs!.rightInp!.value = String(rightR);
			}
	}else{//Mixed
		startNumbers.rangeNumbers[0] = String(leftRange);
		startNumbers.rangeNumbers[1] = String(rightRange);
		if(isRandom){
			startNumbers.randomInputs!.leftInp!.value = String(leftRange);
			startNumbers.randomInputs!.rightInp!.value = String(rightRange);
		}
	}
}
//Range sliders arrow keys
export const displayRangeNumsKeyboard:rangeNumsKeyboard = (rangeInput:HTMLInputElement):string=>{
	return saveInputValues(rangeInput.name, rangeInput.value, true) ?? rangeInput.value;
}
export const turnOnOffStartNumbers:turnOnOffStartNums = (onOrOff:boolean):boolean=>{
	const { mainSliderBlock, leftSlider, rightSlider } = startNumbers.sliderBlockNodes;
	//Radio buttons
	const radioBtns = <HTMLDivElement>(mainSliderBlock!.parentNode!.parentNode!.children[0]!.lastChild);
	(radioBtns!.children[0]!.lastChild as HTMLInputElement).disabled = onOrOff;
	(radioBtns!.children[1]!.lastChild as HTMLInputElement).disabled = onOrOff;
	(radioBtns!.children[2]!.lastChild as HTMLInputElement).disabled = onOrOff;
	//Sliders
	(leftSlider as HTMLInputElement).disabled = onOrOff;
	(rightSlider as HTMLInputElement).disabled = onOrOff;
	//Random button
	const randomBtn = <HTMLInputElement>(mainSliderBlock!.parentNode!.children[1]!.children[1]!.lastChild);
	randomBtn.disabled = onOrOff;
	if(mainSliderBlock && radioBtns && leftSlider && rightSlider && randomBtn){
		return true;
	}
	return false;
}
export const resetValuesOnEndLevel:resetValsOnEndLevel = ():void=>{
	startNumbers.rangeNumbers[0] = '0';
	startNumbers.rangeNumbers[1] = '0';
	//Reset HTML values
	startNumbers.sliderBlockNodes!.outputFrom!.textContent = '0';
	startNumbers.sliderBlockNodes!.outputTo!.textContent = '0';
	startNumbers.sliderBlockNodes!.leftSlider!.value = '0';
	startNumbers.sliderBlockNodes!.rightSlider!.value = '0';
	if((startNumbers.randomInputs?.leftInp !== null) && (startNumbers.randomInputs.rightInp !== null)){
		startNumbers.randomInputs.leftInp.value = '';
		startNumbers.randomInputs.rightInp.value = '';
	}
} 
export const randomRangeValues = function(randomInputBtn:HTMLInputElement):void{
	//If the button input is not clicked skip the logic 
	if(randomInputBtn.type !== 'button') return;
	//Random inputs
	const leftRandomInp = <HTMLInputElement>(randomInputBtn!.parentNode!.children[1]);
	const rightRandomInp = <HTMLInputElement>(randomInputBtn!.parentNode!.children[3]);
	//Save random input nodes
	startNumbers.randomInputs.leftInp ??= leftRandomInp;
	startNumbers.randomInputs.rightInp ??= rightRandomInp;
	//Limit range values for the current level
	const leftEdge = UserInteraction.limitLevels[(UserInteraction.gameLevel - 1)].values.leftSlider[0];
	const rightEdge = UserInteraction.limitLevels[(UserInteraction.gameLevel - 1)].values.rightSlider[1];
	//Left edge
	let rand1 = Math.round(Math.random() * leftEdge);
	rand1 = (Math.abs(rand1) === 0) ? 0 : rand1;
	startNumbers.rangeNumbers[0] = String(rand1); 
	//Right edge
	let rand2 = Math.round(Math.random() * rightEdge);
	startNumbers.rangeNumbers[1] = String(rand2);
	//Recalculate
	recalculateToMode();
	//Assign values to random input values
	leftRandomInp!.value = startNumbers.rangeNumbers[0];
	rightRandomInp!.value = startNumbers.rangeNumbers[1]; 
	//Assign values to slider outputs and and beside inputs above random block
	startNumbers.sliderBlockNodes!.outputFrom!.textContent = startNumbers.rangeNumbers[0];
	startNumbers.sliderBlockNodes!.outputTo!.textContent = startNumbers.rangeNumbers[1];
	startNumbers.sliderBlockNodes!.leftSlider!.value = startNumbers.rangeNumbers[0];
	startNumbers.sliderBlockNodes!.rightSlider!.value = startNumbers.rangeNumbers[1];
};
export {
	processRange as testProcessRange,
	changeMode as testChangeMode,
	displayRangeNums as testDisplayRangeNums,
	saveInputValues as testSaveInputValues
}