/**
* @jest-environment jsdom
*/
//Above DOCS is for usage 'jsdom' in this test file
import { 
	testStartTimer, 
	testInitTimer,
	testTimeCounter,
	//testTimerSuspend
	testWriteLevelToHtml
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

let timer: (HTMLDivElement | null) = null;

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
	it("Write the level number into HTML",()=>{
		const timerWidget:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		const divElChild1:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		const divElChild2:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		const divElChild3:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		const divElChild4:HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
		divElChild4.textContent = "1";
		expect(divElChild4).not.toBeNull();
		expect(divElChild3).not.toBeNull();
			divElChild3.appendChild(divElChild4);
		expect(divElChild2).not.toBeNull();
			divElChild2.appendChild(divElChild3);
		expect(timerWidget).not.toBeNull();
			timerWidget.appendChild(divElChild1);
			timerWidget.appendChild(divElChild2);
		timer = timerWidget;
		//Create Mock function
		const mockTestWriteLevelToHtml = jest.fn(testWriteLevelToHtml);
		mockTestWriteLevelToHtml(timerWidget);
		expect(mockTestWriteLevelToHtml).toHaveBeenCalledTimes(1);
		expect(timer).not.toBeNull();
		//Restore Mock
		mockTestWriteLevelToHtml.mockReset();
	});
});