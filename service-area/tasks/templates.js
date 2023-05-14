import { paths } from "./../paths.js";
import { browserSyncServer } from "./server.js";
import gulpIf from 'gulp-if';
import pug from "gulp-pug";
import htmlmin from "gulp-htmlmin";
import path from "path";
import foreach from "gulp-foreach";
import filter from "gulp-filter";
import replaceImageSrc from "gulp-replace-image-src";

export function templates(cb){
	// Create filter instance inside task function to exclude index.html file
	const f = filter(['!index.html']);
	global.app.gulp.src(paths.src.pages)
		.pipe(pug({
			// Our options are here
		}))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(foreach(function(stream, file){
			let filename = path.basename(file.path, '.html');
			if(filename === "index"){
				return stream.pipe(replaceImageSrc({ 
					prependSrc : "assets/images/",
					keepOrigin : false
				}))
				.pipe(global.app.gulp.dest(paths.dist.mainPage))
				.pipe(f);
			}
			return stream;
		}))
		.pipe(replaceImageSrc({ 
			prependSrc : "../assets/images/",
			keepOrigin : false
		}))
		.pipe(global.app.gulp.dest(paths.dist.pages))
		.pipe(gulpIf(global.app.isDev, browserSyncServer.stream()));
	cb();	
}