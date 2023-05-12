import { paths } from "./../paths.js";
import { deleteSync } from 'del';

export function cleanSync(cb){
	//Clean 'src/scripts/temp' folder
	const path = paths.dist.tempScripts.substring((paths.dist.tempScripts.length - 1), -1);
	deleteSync([paths.dist.tempScripts+"**", "!"+path]); 
	cb();
}