/**
* @jest-environment jsdom
*/
import {expect, jest, test} from '@jest/globals';
import { StartNumsBlock, changeModeToCurrent } from "./../types/game-start-numbers"; 
import { chooseRadio, rememberRangeNodes, updateRangeNodes, testProcessRange,
testChangeMode, testSaveInputValues } from "./../start-numbers"; 

const startNumbers:StartNumsBlock = {
	radioBtnElems: { mixed: null, odd: null, even: null },
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

const parentDivTimer = <HTMLDivElement>document.createElement("DIV");
parentDivTimer.innerHTML = `<div class="widget-game-timer"><h2>Game timer</h2><div class="widget-game-timer__info"><div>Level:<span>1</span></div><time>00:00</time></div></div>`;

const parentDivStartNumbers = document.createElement("DIV");
parentDivStartNumbers.innerHTML = `<div class="widget-game-initial-numbers__title"><span>Initial numbers to start the game.</span><span>Choose between (even/odd) or mixed.</span><div class="widget-game-initial-numbers__radios"><label>Odd<input type="radio" data-name="Odd" name="init_nums"></label><label>Even<input type="radio" data-name="Even" name="init_nums"></label><label>Mixed<input type="radio" data-name="Mixed" name="init_nums" checked="checked"></label></div></div><div class="widget-game-initial-numbers__range"><div class="widget-game-initial-numbers__sliders">Select a range of numbers. Possible game values are from a minimum of -9999 to a maximum of 9999. The current number level range is -50 to 50<div><span>From:</span><output>0</output><span>to:</span><output>0</output></div><input type="range" min="-50" max="0" value="0" name="range1"><input type="range" min="0" max="50" value="0" name="range2"></div><div class="widget-game-initial-numbers__random"><span>Generate random numbers</span><div><span>From:</span><input type="number" value="0" min="-50" max="0" readonly="readonly" size="5"><span>to:</span><input type="number" value="0" min="0" max="50" readonly="readonly" size="5"><input type="button" value="Random numbers"></div></div></div>`

describe("Tests for the 'Start-numbers' block", ()=>{
	test("Set correct active radio button when click on it", ()=>{
		//Mock 'chooseRadio'
		const testChooseRadio = jest.fn(chooseRadio);
		parentDivStartNumbers!.firstChild!.addEventListener("click", function(e:Event){
			testChooseRadio(e);
		});
		(parentDivStartNumbers!.firstChild! as HTMLDivElement).click();
		expect(testChooseRadio).toHaveBeenCalled();
		expect(testChooseRadio).toBeCalledTimes(1);
		testChooseRadio.mockReset();
	});
	test("Memorizing range block nodes at the start of the game",()=>{
		//Mock 'rememberRangeNodes'
		const testRememberRangeNodes = jest.fn(rememberRangeNodes);
		testRememberRangeNodes(parentDivTimer);
		expect(testRememberRangeNodes).toHaveBeenCalled();
		expect(testRememberRangeNodes).toBeCalledTimes(1);
		expect(testRememberRangeNodes).toBeTruthy();
		testRememberRangeNodes.mockReset();
	});
	test("Update memorizing block nodes before each level",()=>{
		//Mock 'updateRangeNodes'
		const levelIndexes:Array<number> = [0,1,2,3,4,5,6,7,8,9];
		const testUpdateRangeNodes = jest.fn(updateRangeNodes);
		testUpdateRangeNodes(Math.round(Math.random() * (levelIndexes.length - 1)));
		expect(testUpdateRangeNodes).toBeTruthy();
		testUpdateRangeNodes.mockReset();
	});
	test("Change mode between 'Odd' or 'Even' or 'Mixed'", ()=>{
		//Mock 'processRange'
		const processRange = jest.fn(testProcessRange);
		expect(processRange('Odd')).toBe(true);
		expect(processRange('Even')).toBe(true);
		expect(processRange('Mixed')).toBe(true);
		expect(processRange('Oops!')).toBe(false);
		processRange.mockReset();
	});
	test("Only one radio button is active",()=>{
		//Mock 'changeMode'
		const changeMode = jest.fn(testChangeMode);
		changeMode("Even");
		expect(changeMode).toHaveBeenCalled();
		changeMode.mockReset();
	});
	test("",()=>{
		//Mock 'testSaveInputValues'
		const saveInputValues = jest.fn(testSaveInputValues);
		expect(saveInputValues("range1", "19", true)).toBe("0");
		expect(saveInputValues("range2", "34", true)).toBe("0");
		expect(saveInputValues("range1", "23", false)).toBe("23");
		expect(saveInputValues("range2", "15", false)).toBe("15");
		saveInputValues.mockReset();
	});
});