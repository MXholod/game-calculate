/**
* @jest-environment jsdom
*/
import {expect, jest, test, it} from '@jest/globals';
import { calculateCubesAmount, testGenerateCells, testNumsWithSigns, testRandomNumbersFromRange, getLevelInfoInstance, makeTimeFormat } from './../game-core';
import { preparedData, IPreparedLevelData } from './../types/game-core';

describe("Tests for the 'Core game'", ()=>{
	afterEach(() => {
		//Restore the spy created with spyOn
		jest.restoreAllMocks();
	});
	test("The amount of cells, it mustn't throw an error", ()=>{
		const calcCubesAmount = jest.fn(calculateCubesAmount);
		expect(()=>{ calcCubesAmount(4) }).not.toThrow();
		expect(calcCubesAmount).toHaveBeenCalled();
		expect(calcCubesAmount).toBeCalledTimes(1);
		expect(()=>{ calcCubesAmount(0) }).toThrow();
		expect(calcCubesAmount).toBeCalledTimes(2);
		calcCubesAmount.mockReset();
	});
	test("Must be an array of HTML DIV elements for each level", ()=>{
		const testGenCells = jest.fn(testGenerateCells);
		const arrDivElems = testGenCells();
		expect(testGenCells).toHaveReturned();
		expect(arrDivElems).toBeInstanceOf(Array);
		expect(testGenCells).toHaveBeenCalled();
		expect(testGenCells).toBeCalledTimes(1);
		testGenCells.mockReset();
	});
	test("Must be an array of numbers from the range", ()=>{
		const testRandNumsFromRange = jest.fn(testRandomNumbersFromRange);
		const arrNums = testRandNumsFromRange();
		expect(testRandNumsFromRange).toHaveReturned();
		expect(arrNums).toBeInstanceOf(Array);
		expect(testRandNumsFromRange).toHaveBeenCalled();
		expect(testRandNumsFromRange).toBeCalledTimes(1);
		testRandNumsFromRange.mockReset();
	});
	test("Must be an array of strings with the signs", ()=>{
		const testNumbersWithSigns = jest.fn(testNumsWithSigns);
		const arrNumsWithSigns = testNumbersWithSigns();
		expect(testNumbersWithSigns).toHaveReturned();
		expect(arrNumsWithSigns).toBeInstanceOf(Array);
		expect(testNumbersWithSigns).toHaveBeenCalled();
		expect(testNumbersWithSigns).toBeCalledTimes(1);
		testNumbersWithSigns.mockReset();
	});
	const observer = getLevelInfoInstance();
	test("Calling the Observer's method prepareLevelData", ()=>{
		const prepData:preparedData = {
			allCubeCells: [{ order:1 , sign:"+", value: 21 }],
			levelElapsedTime: 57,
			userResult: 34,
			cpuResult: 34,
			isSuccess: true
		} 
		const prepDataMethod = jest.spyOn(observer, 'prepareLevelData');
		observer.prepareLevelData(prepData);
		expect(prepDataMethod).toHaveBeenCalled();
	});
	test("Calling the Observer's method subscribe", ()=>{
		const subscribeMethod = jest.spyOn(observer, 'subscribe');
		const subs = (allLevsData:IPreparedLevelData[]):void=>{};
		observer.subscribe(subs);
		expect(subscribeMethod).toHaveBeenCalled();
	});
	test("Calling the Observer's method notifyAll", ()=>{
		const notifyAll = jest.spyOn(observer, 'notifyAll');
		observer.notifyAll();
		expect(notifyAll).toHaveBeenCalled();
	});
	test("Calling the Observer's method resetByDefault", ()=>{
		const resetByDefault = jest.spyOn(observer, 'resetByDefault');
		observer.resetByDefault();
		expect(resetByDefault).toHaveBeenCalled();
	});
	it("Checking the time format",()=>{
		const testMakeTimeFormat = jest.fn(makeTimeFormat);
		testMakeTimeFormat(30);
		expect(testMakeTimeFormat).toHaveBeenCalled();
		expect(testMakeTimeFormat).toBeCalledTimes(1);
		expect(testMakeTimeFormat(30)).toBe("00:30");
		expect(testMakeTimeFormat(30)).not.toBe("00:35");
		testMakeTimeFormat.mockReset();
	});
});
