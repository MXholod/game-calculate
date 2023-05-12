import gulp from "gulp";
import { paths } from "./service-area/paths.js";
//Keep some values in Global environment, use in other tasks
global.app = {
	gulp,
	isDev: process.env.NODE_ENV.trim() === "development" ? true : false,
	isProd: process.env.NODE_ENV.trim() === "production" ? true : false
}

import { clean, cleanSync, styles, transpilation, scripts, images, templates, ttfToWoff, ttfToWoff2, server } from "./service-area/tasks/index.js";

const fonts = gulp.series(ttfToWoff, ttfToWoff2);
const transpileWithBundle = gulp.series(cleanSync, transpilation, scripts);

function watching(){
	gulp.watch(paths.watch.templates, { events: 'change' }, templates);
	gulp.watch(paths.src.styles, { events: 'change' }, styles);
	gulp.watch(paths.watch.typescript, { events: 'change' }, transpileWithBundle);
	//gulp.watch(paths.src.scripts, { events: 'change' }, scripts);
}

const development = gulp.series(clean, gulp.parallel(templates, styles, transpileWithBundle, images, fonts), server, watching);
const production = gulp.series(clean, gulp.parallel(templates, styles, scripts, images, fonts));

export { 
	development as dev,
	production as prod,	
	clean
}
export { images }

//Default scenario
gulp.task('default', development);