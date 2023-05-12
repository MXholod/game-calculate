import { paths } from "./../paths.js";
import gulpIf from 'gulp-if';
import { browserSyncServer } from "./server.js";
import size from'gulp-size';
import sourcemaps from'gulp-sourcemaps';
import uglify from "gulp-uglify";
import concat from "gulp-concat";
//import babel from "gulp-babel";
import browserify from "gulp-browserify";
import babelify from "babelify";

//Typescript to JavaScript
export function scripts() {
	return global.app.gulp.src(paths.src.scripts, { sourcemaps: true })
	.pipe(browserify({
		transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
	}))
	.pipe(uglify())
	.pipe(concat("main.min.js"))
	.pipe(size({ title: "JS" }))
	.pipe(global.app.gulp.dest(paths.dist.scripts))
	.pipe(gulpIf(global.app.isDev, browserSyncServer.stream()));
	
}