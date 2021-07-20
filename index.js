var express = require('express');
var app = express();
var path = require('path');    
var fs = require('fs-extra');
var fs=require("fs")
var multer = require('multer');
var downloadData=require('./modules/download');
var regex=require('./modules/regex');

var arr=[]

const port = 3000

//files setup
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//multer setup
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    //fileFilter: function (req, file, cb) {
    //checkFileType(file, cb);
    //}
}).single('avatar')


// API Routes
app.get('/', (req, res) => {
    res.render("index")
})

app.get('/download', (req, res, next) => {
    var file=arr[0].USERNAME
    downloadData(arr)
    setTimeout(function() {
            var filePath = './public/csv/'+file+'.csv'; 
            var fileName = file+".csv"; 
            res.download(filePath, fileName);  
    }, 3000);
})

app.post('/upload', function (req, res, next) {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            arr.length=0

            var fName=req.file.filename
            var dataBuffer= fs.readFileSync("./public/uploads/"+fName) 
            var datas=dataBuffer.toString() 

            arr=regex(datas)
            res.render("downloadage",{result:arr});  
        }
    });
})


//running the server.
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})