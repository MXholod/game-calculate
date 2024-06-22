/**
* @jest-environment jsdom
*/
import { ISQuareBlock, cubeCells } from './../types/main-cube';
import { startCubeAnimation, backCubeAnimation, appllyNumsToCube, clearNumsOfCube, calculateCorrectResult } from './../main-cube';
//'testStartCubeAnimation'
const parentTimer:HTMLElement = document.createElement('ASIDE') as HTMLElement; 
const timer:HTMLDivElement = document.createElement('DIV') as HTMLDivElement; 
	parentTimer.appendChild(timer);
const content:HTMLDivElement = document.createElement('SECTION') as HTMLDivElement;
const contentGame:HTMLDivElement = document.createElement('SECTION') as HTMLDivElement;
const levelBoard:HTMLDivElement = document.createElement('DIV') as HTMLDivElement; 
const contentMain:HTMLDivElement = document.createElement('DIV') as HTMLDivElement; 
const threeDWrapper:HTMLDivElement = document.createElement('DIV') as HTMLDivElement; 
const threeD:HTMLDivElement = document.createElement('DIV') as HTMLDivElement; 
	threeDWrapper.appendChild(threeD);
	contentMain.appendChild(threeDWrapper);
	contentGame.appendChild(levelBoard);
	contentGame.appendChild(contentMain);
	content.appendChild(contentGame);
	content.appendChild(parentTimer);
//'testAppllyNumsToCube'
const cells: HTMLDivElement[] = [ 
	document.createElement("DIV") as HTMLDivElement,
	document.createElement("DIV") as HTMLDivElement
];
const nums:string[] = ["(+) 34", "(*) 221"];
const mainCube:HTMLDivElement = document.createElement('DIV') as HTMLDivElement; 
	threeD.appendChild(mainCube);

const blocks:ISQuareBlock = {
	mainS: contentMain,
	threeBW: threeDWrapper,
	threeB: threeD
}
	
describe("Tests for the 'Main Cube' block",()=>{
	test("Starting the cube animation. The scale of the cube increases",()=>{
		const testStartCubeAnimation = jest.fn(startCubeAnimation);
		testStartCubeAnimation(timer);
		expect(testStartCubeAnimation).toHaveBeenCalled();
		expect(testStartCubeAnimation(timer)).toBeTruthy();
	});
	test("Rewind the cube animation. The scale of the cube decreases",()=>{
		const testBackCubeAnimation = jest.fn(backCubeAnimation);
		testBackCubeAnimation();
		expect(testBackCubeAnimation).toHaveBeenCalled();
		expect(testBackCubeAnimation(()=>{})).toBeTruthy();
	});
	it("Merging elements with values", ()=>{
		const testAppllyNumsToCube = jest.fn(appllyNumsToCube);
		testAppllyNumsToCube(cells, nums);
		expect(testAppllyNumsToCube).toHaveBeenCalled();
		expect(testAppllyNumsToCube(cells, nums)).toBeTruthy();
	});
	it("Clear child elements", ()=>{
		const testClearNumsOfCube = jest.fn(clearNumsOfCube);
		testClearNumsOfCube();
		expect(testClearNumsOfCube).toHaveBeenCalled();
		expect(testClearNumsOfCube()).toBeTruthy();
	});
	it("Calculation of the correct result", ()=>{
		const testCalculateCorrectResult = jest.fn(calculateCorrectResult);
		const testCubeCells:cubeCells = [
			{ order:1, sign:'', value:5 },
			{ order:2, sign:'(-)', value:3 },
			{ order:3, sign:'(+)', value:8 }
		];
		testCalculateCorrectResult(testCubeCells);
		expect(testCalculateCorrectResult).toHaveBeenCalledTimes(1);
		expect(testCalculateCorrectResult(testCubeCells)).toBe(10);
	});
});