const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./EduDatabase/information.db");
const dbCareer = new sqlite3.Database("./EduDatabase/career.db");
const dbOpencourse = new sqlite3.Database("./EduDatabase/opencourse.db");
let port = 3000;

app.engine('hbs', hbs({
    layoutsDir: 'views',
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(express.static('public'));
// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// OpenCource
app.get('/open', (req, res) => {
    res.sendFile(path.join(__dirname, 'openClassify.html'));
});
let groupname="";
app.get('/opendata', (req, res) => {   
    setData(req.query.type);
    res.sendFile(path.join(__dirname, 'courcedata.html'));
});
// 開放式課程學群資料庫
app.get('/group',(req,res)=>{
    groupname=getData();
    dbOpencourse.serialize(function () {
        dbOpencourse.all(`SELECT * FROM ${groupname}`, (err, rows) => {
            console.log(rows);
            if (err) console.error(err);
            res.json(rows);
        });
    })
});
function setData(data){
    groupname=data;
}
function getData(){
    return groupname;
}

// 推廣教育
app.get('/edu', (req, res) => {
    res.sendFile(path.join(__dirname, 'promoteClassify.html'));
});
app.get('/edu/classify', (req, res) => {
    console.log(req.query.type);
    console.log(req.query.classify);
    let data = "";
    db.serialize(function () {
        db.all(`SELECT * FROM ${req.query.classify}`, (err, rows) => {
            if (err) console.error(err);
            console.log(typeof (rows));
            rows.forEach(row => {
                console.log(row['課程名稱'] + row['網址']);
                data += `<a href="https:/google.com" target="_blank">${row['課程名稱']}</a>`;

            });
            res.render('layout', {
                type: req.query.type,
                content: req.query.classify,
                item: data
            });
        });

    })

})

// Career Planning
app.get('/career', (req, res) => {
    res.sendFile(path.join(__dirname, 'careerClassify.html'))
});
app.get('/career/tutor',(req,res)=>{
    dbCareer.serialize(function () {
        dbCareer.all(`SELECT * FROM  生涯輔導`, (err, rows) => {
            if (err) console.error(err);
            res.json(rows);
        });
    })
});
app.get('/career/experience',(req,res)=>{
    dbCareer.serialize(function () {
        dbCareer.all(`SELECT * FROM  國際及體驗學習`, (err, rows) => {
            if (err) console.error(err);
            res.json(rows);
        });
    })
});
app.get('/career/recruit',(req,res)=>{
    dbCareer.serialize(function () {
        dbCareer.all(`SELECT * FROM  徵求人才`, (err, rows) => {
            if (err) console.error(err);
            res.json(rows);
        });
    })
});

app.listen(port, function () {
    console.log(`Listeing on ${port} port.`);
});

