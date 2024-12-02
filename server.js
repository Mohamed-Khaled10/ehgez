const express = require('express')
const db_access = require('./db.js')
const db = db_access.db
const server = express()
const port = 111
server.use(express.json())

server.post('/user/register' ,(req,res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const IsAdmin = req.body.IsAdmin
    db.run(`INSERT INTO USER(name,email,password,IsAdmin) Values ('${name}',
        '${email}', '${password}', ${IsAdmin})`, (err) => {
            if(err)
                return res.status(401).send(err)
            else
            return res.status(200).send('Registration Succesful')
        })
})

server.post('/user/login' , (req,res) =>{
    const email =req.body.email
    const password = req.body.email
    db.get(`SELECT * FROM USER WHERE EMAIL = '${email}' 
        AND PASSWORD = '${password}'` ,(err,row)=>{
            if(err|| !row)
                return res.status(401).send("Invalid Credentials!")
            else
            return res.status(200).send('Login Succesfull!')
        })
})











server.listen(port,()=>{
    console.log(`server started at port ${port}`)
    db.serialize(()=>{
        db.exec(db.createUserTable);
        db.exec(db.createCourtsTable);
        db.exec(db.createBookingTable);
    })
})