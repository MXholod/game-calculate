/**
* @jest-environment jsdom
*/
import { curLevel } from './../types/level-board';
import { toggleLevelBoard, updateLevelBoard } from './../level-board';

//HTML for 'toggleLevelBoard' function
const levelBoard = `<div class="level-board_level-number"><span>Level number:</span><span>1</span></div>`;
const content:HTMLElement = document.createElement("SECTION");
const content_game:HTMLElement = document.createElement("SECTION");
content_game.innerHTML = levelBoard;
const aside:HTMLElement = document.createElement("ASIDE");
const timer:HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
aside.appendChild(timer);
content.appendChild(content_game);
content.appendChild(aside);

const currentLevel:curLevel = { level: 1, isActive: false, values: { leftSlider: [-50,0], rightSlider: [0,50] } }; 
//HTML for 'updateLevelBoard' function
const levelBoardParent:HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
const boardLevel:HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
const bLSpan1:HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
const bLSpan2:HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
boardLevel.appendChild(bLSpan1);
boardLevel.appendChild(bLSpan2);
const boardRange:HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
levelBoardParent.appendChild(boardLevel);
const bRSpan1:HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
const bRSpan2:HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
boardRange.appendChild(bRSpan1);
boardRange.appendChild(bRSpan2);
levelBoardParent.appendChild(boardRange);

describe("Tests for the 'level-board' block", ()=>{
	it("Switching between classes of the 'level-board' block",()=>{
		//Create Mock function
		const mockToggleLevelBoard = jest.fn(toggleLevelBoard);
		mockToggleLevelBoard(timer, true);
		expect(mockToggleLevelBoard).toHaveBeenCalledTimes(1);
		expect(mockToggleLevelBoard(timer, true)).toBeTruthy();
		//Restore Mock
		mockToggleLevelBoard.mockReset();
	});
	it("Update data of the 'level-board' before each level",()=>{
		//Create Mock function
		const mockUpdateLevelBoard = jest.fn(updateLevelBoard);
		mockUpdateLevelBoard(timer, currentLevel);
		expect(mockUpdateLevelBoard).toHaveBeenCalledTimes(1);
		expect(mockUpdateLevelBoard(levelBoardParent, currentLevel)).toBeTruthy();
		//Restore Mock
		mockUpdateLevelBoard.mockReset();
	});
});