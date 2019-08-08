const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db_connection')
const role = require('./roles')
const project = require('./project')

const app = express()
const port = 3000

var corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET','POST','OPTIONS'],
    optionsSuccessStatus: 200,
    maxAge: 1800
}

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/role',role)
app.use('/project',project)


app.get('/getRoleName',(req,res)=>{
    let roleName = []
    db.query("SELECT role_name FROM role")
    .then(results=>{
        results.forEach(element => {
            roleName.push(element['role_name'])
        });
        res.json({
            ROLES : roleName
        })
    })
})
app.listen(port, () => {
    console.log(`Server started on port : `+port);
});