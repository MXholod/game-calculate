/**
* @jest-environment jsdom
*/
//Above DOCS is for usage 'jsdom' in this test file
import { 
	testStartTimer, 
	testInitTimer,
	testTimeCounter,
	//testTimerSuspend
} from "./../timer";
import { ITSCallback, tS } from "./../types/game-timer";
import { IUserInteraction } from "./../types/user-interaction";

type IUserInteractionSomeTypes = Pick<IUserInteraction, 'additionalSecToLevel' | 'totalLevelSeconds'>;

const UserInter:IUserInteractionSomeTypes = {
	additionalSecToLevel: 10,
	totalLevelSeconds: 0
};

const timerSuspend:tS = (widgetTimer:HTMLDivElement, callback:ITSCallback):boolean=>{
	return true;
}

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
		expect(mockTestStartTimer(1, divEl)).toBeUndefined();
		//Restore Mock
		mockTestStartTimer.mockReset();
	});
	it("Display time format of elapsed time depends on a level", ()=>{
		expect(testInitTimer()).toBeTruthy();
		expect(testInitTimer()).toMatch(/^(([0-5]?\d):)?([0-5]?\d)$/);
	});
	it("Create time format of elapsed time", ()=>{
		expect(testTimeCounter()).toBeTruthy();
		expect(testTimeCounter()).toMatch(/^(([0-5]?\d):)?([0-5]?\d)$/);
	});
	it("Suspend timer", ()=>{
		const divEl:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		expect(divEl).not.toBeNull();
		//Create Mock function
		const mockTestTimerSuspend = jest.fn(timerSuspend);
		//mockTestTimerSuspend.mockImplementation(timerSuspend);
		mockTestTimerSuspend(divEl, (isStopped:boolean)=>{ return true; });
		expect(mockTestTimerSuspend).toHaveBeenCalledTimes(1);
		expect(mockTestTimerSuspend).toBeTruthy();
		//Restore Mock
		mockTestTimerSuspend.mockReset();
	});
});