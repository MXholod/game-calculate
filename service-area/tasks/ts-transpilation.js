import { paths } from "./../paths.js";
import ts from "gulp-typescript";

const tsProject = ts.createProject("tsconfig.json");

export function transpilation(){
	return tsProject.src()
	.pipe(tsProject()).js
	.pipe(global.app.gulp.dest(paths.dist.tempScripts)); //Save JS temporary
}
