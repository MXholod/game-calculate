import { deleteAsync } from 'del';
import { paths } from "./../paths.js";

export const clean = async ()=>{
	// Delete all './dist/**' except 'dist' itself and 'dist/images' in it
	return await deleteAsync([ 
		paths.clean+'/**', 
		`!${paths.clean}`,		//'dist'
		`!${paths.dist.images}`, //'dist/images'
		`!${paths.dist.images}*.(jpg|jpeg|png|gif|webp|svg)` //'dist/images/*.(jpg|jpeg|png|gif|webp|svg)'
	]); 
}