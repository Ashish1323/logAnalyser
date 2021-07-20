var express = require('express');
var app = express();
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');
var fs=require("fs")
var csvwriter=require('csv-writer')
var createCsvWriter = csvwriter.createObjectCsvWriter
app.use(busboy());
var arr=[]
var multer = require('multer');


const port = 3000

//files setup

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//var uploads = multer({ dest: 'uploads/' })

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


//Routes

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/download', (req, res, next) => {
    console.log("sdsd")
    console.log(arr)
    var file=arr[0].USERNAME
    const csvWriter = createCsvWriter({
        
        // Output csv file name is geek_data
        path: './public/csv/'+file+'.csv' ,
        header: [
        
          // Title of the columns (column_names)
          {id: 'IP', title: 'IP-ADDRESS'},
          {id: 'TimeStamp', title: 'TIME STAMP'},
          {id: 'INFO', title: 'INFO'},
          {id: 'REQUEST', title: 'REQUEST'},
          {id: 'USERAGENT', title: 'USER-AGENT'},
          {id: 'API', title: 'API-DEFINITION'},
          {id: 'USERNAME', title: 'USER-NAME'},
          {id: 'USERLOGIN', title: 'USER-LOGIN'},
          {id: 'ENTERPRISENAME', title: 'ENTERPRISE-NAME'},
          {id: 'ENTERPRISEID', title: 'ENTERPRISE-ID'},
          {id: 'STATUSCODE', title: 'STATUS-CODE'},
          {id: 'RESPONSETIME', title: 'RESPONSE-TIME'},
          {id: 'REQUESTBODY', title: 'REQUEST-BODY'},
          {id: 'AUTHSTATUS', title: 'AUTH-STATUS'}
      
        ]
      });
        
      // Values for each column through an array
      const results = arr
      // Writerecords function to add records
      csvWriter
        .writeRecords(results)
        .then(()=> console.log('Data uploaded into csv successfully'));
        setTimeout(function() {
            var filePath = './public/csv/'+file+'.csv'; // Or format the path using the `id` rest param
            var fileName = file+".csv"; // The default name the browser will use
            res.download(filePath, fileName);  
        }, 3000);  
})

app.get('/downloadm', function (req, res) {
    console.log("koda")
    const file = `${__dirname}./public/uploads/avatar-1626697470158.pdf`;
    res.download(file); // Set disposition and send it.
});


app.post('/upload', function (req, res, next) {
    


    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            arr=[]
            //console.log(req.file, req.file.filename)
            var fName=req.file.filename
            var dataBuffer= fs.readFileSync("./public/uploads/"+fName) 
            var data=dataBuffer.toString() 



            var time= /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})/
            var IP=/(\d+.\d+\.\d+\.\d+)/
            var info=/(INFO|ERROR|WARN|TRACE|DEBUG|FATAL)/
            var request=/(?<=!Request-Type\=).*?[^#]*/
            var userAgent=/(?<=!User-Agent\=).*?[^#]*/
            var api=/(?<=!API\=).*?[^#]*/
            var userName=/(?<=!User-Name\=).*?[^#]*/
            var userLogin=/(?<=!User-Login\=).*?[^#]*/
            var EnterpriseName=/(?<=!EnterpriseName\=).*?[^#]*/
            var EnterpriseId=/(?<=!EnterpriseId\=).*?[^#]*/
            var requestBody=/(?<=!Request-Body\=).*?[^#]*/
            var responseTime=/(?<=!Response-Time\=).*?[^#]*/
            var statusCode=/(?<=!Status-Code\=).*?[^#]*/
            var authStatus=/(?<=!Auth-Status\=).*?[^#]*/

            var str=data.split("\n")



            for(var i=0;i<str.length;i++){
            var json={}

            json["IP"]=str[i].match(IP)[0]
            json["TimeStamp"]=str[i].match(time)[0]
            json["INFO"]=str[i].match(info)[0]
            json["REQUEST"]=str[i].match(request)[0]
            json["USERAGENT"]=str[i].match(userAgent)[0]
            json["API"]=str[i].match(api)[0]
            json["USERNAME"]=str[i].match(userName)[0]
            json["USERLOGIN"]=str[i].match(userLogin)[0]
            json["ENTERPRISENAME"]=str[i].match(EnterpriseName)[0]
            json["ENTERPRISEID"]=str[i].match(EnterpriseId)[0]
            json["REQUESTBODY"]=str[i].match(requestBody)[0]
            json["RESPONSETIME"]=str[i].match(responseTime)[0]
            json["STATUSCODE"]=str[i].match(statusCode)[0]
            json["AUTHSTATUS"]=str[i].match(authStatus)[0]
            
            arr.push(json)
            }
            res.render("downloadage",{result:arr});
            console.log(arr)  
        }
    });
})
//running the server.

// app.post('/upload',
//     (function (req, res, next) {
//         console.log("loda")
//         var fstream;
//         req.pipe(req.busboy);
//         req.busboy.on('file', function (fieldname, file, filename) {
//             console.log("Uploading: " + filename);

//             //Path where image will be uploaded
//             fstream = fs.createWriteStream(__dirname + '/file/' + filename);
//             file.pipe(fstream);
//             fstream.on('close', function () {
//                 console.log("Upload Finished of " + filename);
//                 res.redirect('/');           //where to go next
//             });
//         });
//     }));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})