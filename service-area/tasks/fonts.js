import { paths } from "./../paths.js";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";

function ttfToWoff(){
	return global.app.gulp.src(paths.src.fonts)
	.pipe(ttf2woff())
	.pipe(global.app.gulp.dest(paths.dist.fonts));
}
function ttfToWoff2(){
	return global.app.gulp.src(paths.src.fonts)
	.pipe(ttf2woff2())
	.pipe(global.app.gulp.dest(paths.dist.fonts));
}

export { ttfToWoff, ttfToWoff2 }
