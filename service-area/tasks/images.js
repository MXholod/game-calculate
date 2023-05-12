import { paths } from "./../paths.js";
import size from'gulp-size';
import newer from'gulp-newer';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from "gulp-imagemin";

export function images(){
	return global.app.gulp.src(paths.src.images)
	.pipe(newer(paths.dist.images))
	.pipe(imagemin([
	gifsicle({interlaced: true}),
	mozjpeg({quality: 70, progressive: true}),
	optipng({optimizationLevel: 5}),
	svgo({
		plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
	.pipe(size({ title: "Images" }))
	.pipe(global.app.gulp.dest(paths.dist.images));
}