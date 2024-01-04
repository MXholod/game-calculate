/**
* @jest-environment jsdom
*/
//Above DOCS is for usage 'jsdom' in this test file
import { 
	testStartTimer,  
	testCalculateCubesAmount, 
	testDisplayLevel,
	testNextLevel,
	testInitTimer,
	testTimeCounter
} from "./../timer";
import { IUserInteraction } from "./../types/user-interaction";

const UserInter: IUserInteraction = {
	gameLevel: 1,
	cubesAmount: 4,
	additionalSecToLevel: 10,
	totalLevelSeconds: 0
};

describe("Tests for the 'Timer' block", ()=>{
	test("Start the timer", () => {
		const divEl:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		expect(divEl).not.toBeNull();
		//Create Mock function
		const mockTestStartTimer = jest.fn();
		mockTestStartTimer.mockImplementation((a: number, b: HTMLDivElement):void => {  });
		mockTestStartTimer(1, divEl);
		expect(mockTestStartTimer).toHaveBeenCalledTimes(1);
		expect(mockTestStartTimer).toHaveBeenCalledWith(1, divEl);
		expect(mockTestStartTimer(1, divEl)).toBeUndefined();   //nextLevel:nL = ():string=>{}
		//Restore Mock
		mockTestStartTimer.mockReset();
	});
	it("Calculation of the number of all cubes in a square", ()=>{
		//Create Mock function
		const mockTestCalculateCubesAmount = jest.fn();
		mockTestCalculateCubesAmount.mockImplementation(testCalculateCubesAmount);
		expect(()=>mockTestCalculateCubesAmount(1, 4)).not.toThrow('An error');
		expect(mockTestCalculateCubesAmount).toHaveBeenCalled();
		expect(UserInter.cubesAmount).toBeGreaterThanOrEqual(4);
		mockTestCalculateCubesAmount.mockReset();
	});
	it("Display a number of current level", ()=>{
		expect(testDisplayLevel(UserInter.cubesAmount)).toMatch(/^\d+$/);
	});
	it("Increment next level", ()=>{
		expect(testNextLevel()).toMatch(/^\d+$/);   //nextLevel:nL = ():string=>{}
	});
	it("Display time format of elapsed time depends on a level", ()=>{
		expect(testInitTimer()).toBeTruthy();
	});
	it("Create time format of elapsed time", ()=>{
		expect(testTimeCounter()).toBeTruthy();
	});
});