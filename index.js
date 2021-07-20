var express = require('express');
var app = express();
var path = require('path');    
var fs = require('fs-extra');
var fs=require("fs")
var multer = require('multer');
var downloadData=require('./modules/download');
var regex=require('./modules/regex');
var maxCalls=require('./modules/mostcalls')
var bodyParser=require('body-parser');
var arr=[]
var mapData=[];
const port = 8000

//files setup
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
}).single('avatar')


// API Routes
app.get('/', (req, res) => {
    res.render("home",{error:false,file:false})
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
            res.redirect('/')
        }
        else {
            try{
            arr.length=0
            var fName=req.file.filename ? req.file.filename : null
            if(fName && fName[fName.length-3]+fName[fName.length-2]+fName[fName.length-1]=="txt"){
            var dataBuffer= fs.readFileSync("./public/uploads/"+fName) 
            var datas=dataBuffer.toString() 

            arr=regex(datas)
    

            mapData=maxCalls(arr)
            res.render("displayLog",{result:arr, IPCount:mapData});  
            }
            else{
                res.render('home',{error:true,file:false})
            }
            }
            catch{
                res.render('home',{error:false,file:true})
            }
        }
    });
})

app.post('/filter',function(req,res){
    
    var value=req.body.filterData.toUpperCase();
    if(value=='ALL')
        res.render("displayLog",{result:arr, IPCount:mapData}); 
    else{
        var fData=[];
        for(var i=0;i<arr.length;i++){
            if(arr[i].INFO==value)
                fData.push(arr[i]);
            
        
        }
        res.render("displayLog",{result:fData, IPCount:mapData} )
    }   
    
})

//running the server.
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})