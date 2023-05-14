import browserSync from "browser-sync";

export const browserSyncServer = browserSync.create(); //Create new connection

export function server(cb){
	browserSyncServer.init({
		server: { 
			baseDir: "./dist",
			port: 3000,
			notify: false, 	//Disable status notifications
			online: false,	//To work offline only on the local machine, without local network
		}
	});
	cb();
}