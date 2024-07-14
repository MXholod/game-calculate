/**
* @jest-environment jsdom
*/
import {expect, jest, test, it} from '@jest/globals';
import { buttonStateChanging } from './../game-statistics';

describe("Tests for 'game-statistics'",()=>{
	test("Button changes its title and state", ()=>{
		const btn:HTMLButtonElement = document.createElement("BUTTON") as HTMLButtonElement;
		const mockButtonStateChanging = jest.fn(buttonStateChanging);
		expect(mockButtonStateChanging(btn)).toBeTruthy();
		expect(mockButtonStateChanging).toHaveBeenCalledTimes(1);
		//Restore Mock
		mockButtonStateChanging.mockReset();
	});
});