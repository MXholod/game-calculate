import { curLevel, toggleLBoard, updateLBoard } from './types/level-board';
import { UserInteraction } from './user-Interaction';

let currentLevel: curLevel;

export const toggleLevelBoard: toggleLBoard = (timer:HTMLDivElement, move:boolean):boolean=>{
	const aside = (timer?.parentNode) as HTMLElement;
	const cubeArea = (aside?.parentNode?.children[0]) as HTMLElement;
	//Find the Level Board Element
	const levelBoardBlock = (cubeArea?.children[0]) as HTMLDivElement;
	if(!levelBoardBlock) return false;
	//Get the current level data
	currentLevel = UserInteraction.getLevel();
	if(move){
		if(levelBoardBlock!.classList?.contains('content__level-board-show')){
			levelBoardBlock!.classList?.remove('content__level-board-show');
		}
		levelBoardBlock!.classList?.add('content__level-board-hide');
		updateLevelBoard(levelBoardBlock, currentLevel);
	}else{
		if(levelBoardBlock!.classList?.contains('content__level-board-hide')){
			levelBoardBlock!.classList?.remove('content__level-board-hide');
		}
		levelBoardBlock!.classList?.add('content__level-board-show');
		updateLevelBoard(levelBoardBlock, currentLevel);
	}
	return true;
}

const updateLevelBoard:updateLBoard = (levelBoard:HTMLDivElement, currentLevel:curLevel):boolean=>{
	//Get values according to the current level
	const { level, values: { leftSlider, rightSlider } } = currentLevel;
	//Get level-board nodes to insert values
	const curLevel = <HTMLDivElement>(levelBoard?.firstChild);
	const curRangeNums = <HTMLDivElement>(levelBoard?.lastChild);
	if(curLevel instanceof HTMLDivElement && curRangeNums instanceof HTMLDivElement){
		curLevel!.lastChild!.textContent = String(level);
		curRangeNums!.lastChild!.textContent = `from ${leftSlider[0]} to ${rightSlider[1]}`;
		return true;
	}
	return false;
}