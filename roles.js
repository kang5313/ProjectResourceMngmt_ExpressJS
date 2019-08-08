const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router()
const db=require("./db_connection")

router.get('/displayroles',(req,res)=>{
    let role_name = []
    let rate = []
    db.query("SELECT role_name, rate FROM role")
    .then(results=>{
        results.forEach(role => {
            role_name.push(role['role_name'])
            rate.push(role['rate'])
        });
        res.json({
            results:results
        });
    })
})

router.post('/create-role',(req,res,next)=>{
    db.query("SELECT role_name FROM role")
    .then(results=>{
        roleExist = results.some(row=>{
            return (req.body.roleName === row.role_name)
        })
        res.locals.roleExist = roleExist
        next()
    })
})

router.post('/create-role',(req,res)=>{
    if(res.locals.roleExist){
        res.json({
            msgId:1,
            msg:"Role Existed"
        });
    }

    else{
        db.none(
            "INSERT INTO role(role_name,rate) VALUES (${roleName}, ${roleRate})",{
                roleName:req.body.roleName,
                roleRate:req.body.rate
        }).then(
            res.json({
                msgId:2,
                msg:"Create Successful"
            })
        )
    }
})

router.post('/delete-role', (req, res) => {
    db.none("DELETE FROM role WHERE role_name = ${roleName}",{
        roleName:req.body.roleName
    }).then(
         res.json({
             msgId:2,
             msg:"Delete Successful"
         })
    )
});

router.post('/set-role-rate',(req,res)=>{
    db.none("UPDATE role SET rate = ${roleRate} WHERE role_name = ${roleName}",{
        roleName:req.body.roleName,
        roleRate:req.body.rate
    }).then(
         res.json({
             msgId:2,
             msg:"Update Successful"
         })
    )
})



module.exports = router