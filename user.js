const express = require('express');
// Init express app
const app = express();
const multer = require('multer');
const Path = require('path');
const ejs = require('ejs');
const Port = process.env.port || 3000;

app.use(express.static(Path.join(__dirname, 'public')));

// configuring disk Engine
 const fileStore = multer.diskStorage({
 	destination: './public/uploads',
 filename: (req, file, cb)=> {
 		const imageFile = file.fieldname + '-'+Date.now().toString()+Path.extname(file.originalname);
 		cb(null, imageFile);
 }});

 const upload = multer({
 	storage: fileStore,
 	limits: {fileSize : 1000000},
 	fileFilter: (req, file, cb)=>{
 		checkMimeTypes(file, cb);
 	}
 }).single('image');


// initializing template engine
 	app.set('view engine', 'ejs');
 	app.set('views', 'views')





app.get('/', (req,res)=>{
	res.render('index');
})


	app.post('/upload', (req,res)=>{
		upload(req, res, (err)=>{
			if(err){
				res.render('index', {msg: err})
			}else{
				console.log(req.file)
				if(req.file == undefined){
					res.render('index', {
						msg:'select a file!'
					})
				}else{
				res.render('index', {
					msg: 'successfully uploaded!',
					file: req.file.filename
				})	
				}
				
			}
		})
	});

app.listen(Port, () =>{
	console.log(`server is running on port ${Port}`);
});


function checkMimeTypes(file, cb){
	// find the match
		const fileTypes = /jpeg|jpg|png|gif/;
		const mimes = fileTypes.test(file.mimetype) // check the mimes

		const extFile = fileTypes.test(Path.extname(file.originalname).toLowerCase());

	if(extFile && mimes){
		return cb(null, file)
	}else{
	 cb("Error: Upload only images");
	}
}