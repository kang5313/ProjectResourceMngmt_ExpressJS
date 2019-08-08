const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router()
const db = require('./db_connection')

//Endpoint for checking project exist before perform any action
router.use('',(req,res,next)=>{
    db.query("SELECT project_name, role_name, check_out_time FROM project")
    .then(results=>{
            projectExist = results.some(row=>{
                return (req.body.projectName === row.project_name && req.body.projectRole === row.role_name && row.check_out_time===null)
            })
            res.locals.projectExist = projectExist
            next()
        })
})

//Endpoint for checking project exist before project check in
router.post('/checkin',(req,res,next)=>{
    if(res.locals.projectExist){
        res.json({
                    msgId:1,
                    msg:"The Project Is Exist"
                })
    }
    else{
        next()
    }
})

//Endpoint for project check in
router.post('/checkin',(req,res)=>{
    db.none(
        "INSERT INTO project(project_name,role_name,cal_session,check_in_time,grace_period) VALUES(${project_name},${role_name},${cal_session},CURRENT_TIMESTAMP,${grace_period})",{
            project_name:req.body.projectName,
            role_name : req.body.projectRole,
            cal_session : req.body.cal_Session,
            grace_period : req.body.grace_period
        }).then(
            res.json({
                msgId : 2,
                msg:"Check-In Successfully"
            })
        ).catch(error=> {res.json({errormsg:error})})
})

//Endpoint for project checking exist before project check out
router.use('/checkout',(req,res,next)=>{
    if(res.locals.projectExist){
        next()
    }
    else{
        res.json({  
                    msgId:1,
                    msg:"The project is not exist or have been checked out."
                })
    }
})

//Endpoint for project check out
router.post('/checkout',async (req,res)=>{
    let result_projectDB = await db.one(
        "SELECT cal_session AS session , grace_period FROM project WHERE project_name = ${project_name} AND role_name = ${role_name} AND check_out_time IS NULL",{
            project_name : req.body.projectName,
            role_name : req.body.projectRole
        }
    )

    let check_out_project_id = await db.one(
        "UPDATE project SET check_out_time = CURRENT_TIMESTAMP WHERE project_name = ${project_name} AND role_name = ${role_name} AND check_out_time IS NULL RETURNING project_id",{
            project_name : req.body.projectName,
            role_name : req.body.projectRole
        },id=>{return id['project_id']})

    let project_time_taken = await db.one(
        "SELECT (DATE_PART('day', CURRENT_TIMESTAMP - check_in_time::timestamp)*24*60 + DATE_PART('hour',CURRENT_TIMESTAMP - check_in_time::timestamp)*60 + DATE_PART('minute',CURRENT_TIMESTAMP - check_in_time::timestamp)) AS result FROM project WHERE project_id = ${id}",{
            id:check_out_project_id
        })

    let role_rate = await db.one(
        "SELECT rate FROM role WHERE role_name = ${check_out_role}",{
            check_out_role:req.body.projectRole
        })

    console.log(result_projectDB['grace_period'])

    //If the project is check out within the grace period, the resource usage will not be calculated. The resource will be set to 0 and save to the table.
    if(project_time_taken['result']<= result_projectDB['grace_period']){
        await db.none("INSERT INTO resource_usage(project_id,rate,res_usage) VALUES (${check_out_project_id},${role_rate},${resource})",{
            check_out_project_id:check_out_project_id,
            role_rate:role_rate['rate'],
            resource:0
        })
         res.json({
             msgId:2,
             msg:"Checked Out Within First 10 mins, Resource Is Not Calculated",
             time:project_time_taken['result'],
             resource:0
        })
    }

    else{
        let numberOfSession = Math.ceil((project_time_taken['result']/(result_projectDB['session'])))
        let resource=(role_rate['rate']*numberOfSession).toFixed(2)
        await db.none("INSERT INTO resource_usage(project_id,rate,res_usage) VALUES (${check_out_project_id},${role_rate},${resource})",{
            check_out_project_id:check_out_project_id,
            role_rate:role_rate['rate'],
            resource:resource
        })

        res.json({
            msgId:2,
            msg:"Checked Out Successfully",
            time:project_time_taken['result'],
            resource:resource
       })    
    }
    
})

//Endpoint for query project resource usage
router.post('/checkout/query-time-usage',async(req,res)=>{
    let result_projectDB = await db.one(
        "SELECT cal_session AS session, grace_period FROM project WHERE project_name = ${project_name} AND role_name = ${role_name} AND check_out_time IS NULL",{
            project_name : req.body.projectName,
            role_name : req.body.projectRole
        }
    )

    let check_out_project_id = await db.one(
        "SELECT project_id FROM project WHERE project_name = ${project_name} AND role_name = ${role_name} AND check_out_time IS NULL",{
            project_name:req.body.projectName,
            role_name:req.body.projectRole
        },id=>{return id['project_id']}
    )

    let project_time_taken = await db.one(
        "SELECT (DATE_PART('day', CURRENT_TIMESTAMP - check_in_time::timestamp)*24*60 + DATE_PART('hour',CURRENT_TIMESTAMP - check_in_time::timestamp)*60 + DATE_PART('minute',CURRENT_TIMESTAMP - check_in_time::timestamp)) AS result FROM project WHERE project_id = ${id}",{
            id:check_out_project_id
        })

    
    let role_rate = await db.one(
        "SELECT rate FROM role WHERE role_name = ${check_out_role}",{
            check_out_role:req.body.projectRole
        })

    let resource

    //If the project is check out within the grace period, the resource usage will not be calculated. The resource will be set to 0 and save to the table.
    if(project_time_taken['result']<=result_projectDB['grace_period']){
        resource = 0
    }
    else{
        let numberOfSession = Math.ceil((project_time_taken['result']/(result_projectDB['session'])))
        resource=(role_rate['rate']*numberOfSession).toFixed(2)
    }
    
    res.json({
        msgId:2,
        time:project_time_taken['result'],
        resource:resource
    })
})



module.exports = router