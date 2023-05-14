import { paths } from "./../paths.js";
import size from'gulp-size';
import gulpIf from 'gulp-if';
import { browserSyncServer } from "./server.js"; 
import cssUrlReplace from 'gulp-css-url-replace';
import rename from "gulp-rename";
import groupMediaQueries from 'gulp-group-css-media-queries';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from'gulp-clean-css';
import sourcemaps from'gulp-sourcemaps';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

export function styles(){
	return global.app.gulp.src(paths.src.styles, { sourcemaps: true })
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(groupMediaQueries())
		.pipe(autoprefixer({
			grid: true, //Support Grid rules
			overrideBrowserlist: ['last 3 versions'],
			cascade: true
		}))
		// img:'./dist/images/', font:'./dist/fonts/'
		.pipe(cssUrlReplace({ img: '../assets/images/', font: '../assets/fonts/' }))
		.pipe(cleanCss()) //Minification {level: 2}
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(sourcemaps.write("./")) // write() - inline maps
		.pipe(size({ title: "CSS" }))
		.pipe(global.app.gulp.dest(paths.dist.styles))
		.pipe(gulpIf(global.app.isDev, browserSyncServer.stream()))
}