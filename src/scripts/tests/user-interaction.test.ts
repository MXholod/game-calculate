/**
* @jest-environment jsdom
*/
import {expect, jest, test} from '@jest/globals';
import { UserInteraction } from './../user-Interaction';

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Tests for 'User Interaction' block - the main object",()=>{
	test("Set a level",()=>{
		const spy = jest.spyOn(UserInteraction, 'setLevel');
		const levelSet = UserInteraction.setLevel(5);
		expect(spy).toHaveBeenCalled();
		expect(levelSet).toBe(true);
	});
	test("Get a level",()=>{
		const spy = jest.spyOn(UserInteraction, 'getLevel');
		const levelGet = UserInteraction.getLevel();
		expect(spy).toHaveBeenCalled();
		expect(levelGet.level).toBe(2);
	});
	test("Check level initial numbers",()=>{
		const spy = jest.spyOn(UserInteraction, 'checkLevelInitialNumbers');
		const checkLevelGood = UserInteraction.checkLevelInitialNumbers('-54', '30');
		expect(spy).toHaveBeenCalledTimes(1);
		expect(checkLevelGood).toBe(true);
		const checkLevelBad = UserInteraction.checkLevelInitialNumbers('-2', '2');
		expect(spy).toHaveBeenCalledTimes(2);
		expect(checkLevelBad).toBe(false);
	});
});