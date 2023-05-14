import * as nodePath from 'path';

const rootFolder = nodePath.basename(nodePath.resolve());
const distFolder = './dist';
const sourceFolder = './src';

//Use in gulpfile.js Here are paths from 'src' to 'dist'
export const paths = {
	dist:{
		//html: distFolder+"/",
		styles: distFolder+"/css/",
		tempScripts: sourceFolder+"/scripts/temp/",
		scripts: distFolder+"/js/",
		images: distFolder+"/assets/images/",
		mainPage: distFolder+"/",
		pages: distFolder+"/pages/",
		fonts: distFolder+"/assets/fonts/"
	},
	src:{
		//html: sourceFolder+"/index.html",
		styles: sourceFolder+"/scss/**/*.scss",
		scripts: sourceFolder+"/scripts/temp/scripts/**/*.js", //All JS comes from tsconfig.json
		images: sourceFolder+"/images/*",
		//mainPage: distFolder+"/index.pug", // Main page is being filtering in the task 'templates'
		pages: [sourceFolder+"/templates/pages/*.pug"], //"!"+sourceFolder+"/templates/pages/index.pug"
		fonts: sourceFolder+"/fonts/*"
	},
	watch:{
		typescript: [sourceFolder+"/scripts/**/*.ts", "!"+sourceFolder+"/scripts/temp"],
		templates: sourceFolder+"/templates/**/*.pug"
	},
	distFolder,
	sourceFolder,
	clean: `${distFolder}`,
	rootFolder
};