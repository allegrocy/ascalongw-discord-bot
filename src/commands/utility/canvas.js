//import { createCanvas, loadImage } from 'canvas';
let pureimage = require('pureimage');
let streams = require('memory-streams');
import fs from 'fs';

export function loadImage(path) {
	console.log("loading image " + path);
	if (/\.png$/i.exec(path)) {
		return pureimage.decodePNGFromStream(fs.createReadStream(path));
	}
	return pureimage.decodeJPEGFromStream(fs.createReadStream(path));
}
export function createCanvas(width, height) {
	let canvas = pureimage.make(width, height);
	//canvas.toBuffer = canvasToBuffer;
	return canvas;
}
export async function canvasToBuffer(canvas) {
	// Write method
	let writer = new streams.WritableStream();

	await pureimage.encodePNGToStream(canvas, writer);

	return writer.toBuffer();
}