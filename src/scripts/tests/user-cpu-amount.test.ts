/**
* @jest-environment jsdom
*/
import { expect, jest, test, it } from "@jest/globals";
import { allowUserAmount, handleUserInput } from "./../user-cpu-amount";
import { mainCube } from "./../types/user-cpu-amount";
//The fake structure of the DOM.
const userCpuWrapper = <HTMLDivElement>document.createElement("DIV");
const section = <HTMLElement>document.createElement("SECTION");
const Sdiv = <HTMLDivElement>document.createElement("DIV");
	section.appendChild(Sdiv);
const aside = <HTMLElement>document.createElement("ASIDE");
const Adiv1 = <HTMLDivElement>document.createElement("DIV");
const Adiv2 = <HTMLDivElement>document.createElement("DIV");
const Adiv3 = <HTMLDivElement>document.createElement("DIV");
	aside.appendChild(Adiv1);
	aside.appendChild(Adiv2);
		const A1 = <HTMLDivElement>document.createElement("DIV");
			const span1 = <HTMLSpanElement>document.createElement("SPAN");
			const label1 = <HTMLLabelElement>document.createElement("LABEL");
			const input1 = <HTMLInputElement>document.createElement("INPUT");
			const button1 = <HTMLButtonElement>document.createElement("BUTTON");
				label1.appendChild(input1);
				A1.appendChild(span1);
				A1.appendChild(label1);
				A1.appendChild(button1);
		const A2 = <HTMLDivElement>document.createElement("DIV");
		const A3 = <HTMLDivElement>document.createElement("DIV");
			const span2 = <HTMLSpanElement>document.createElement("SPAN");
			const label2 = <HTMLLabelElement>document.createElement("LABEL");
			const input2 = <HTMLInputElement>document.createElement("INPUT");
				label2.appendChild(input2);
				A3.appendChild(span2);
				A3.appendChild(label2);
			Adiv3.appendChild(A1);
			Adiv3.appendChild(A2);
			Adiv3.appendChild(A3);
	aside.appendChild(Adiv3);
userCpuWrapper.appendChild(section);
userCpuWrapper.appendChild(aside);
const entryPoint = (userCpuWrapper!.firstChild!.firstChild! as HTMLDivElement);
//
const inputElem = <HTMLInputElement>document.createElement("INPUT");

describe("Tests for the 'User-cpu-amount' block", ()=>{
	it("Accepting CPU correct data", ()=>{
		const testAllowUserAmount = jest.fn(allowUserAmount);
		const mainCubeData:mainCube = { allCubeCells: [ { order:1, sign: "+", value:2 } ], cpuResult: 1 };
		testAllowUserAmount(entryPoint, mainCubeData);
		expect(testAllowUserAmount).toHaveBeenCalled();
		expect(testAllowUserAmount).not.toBeFalsy();
	});
});