const express = require('express')
const db_access = require('./db.js')
const db = db_access.db
const server = express()
const port = 111
server.use(express.json())

server.post(`/user/register`,(req,res)=>{  
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    

    db.run(`INSERT INTO USER (name,email,password,isadmin) VALUES (?,?,?,?)`,[name,email,password,0], (err) => {
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

server.get('/user/:id', (req,res) =>{
    const userId = req.params.id;

    const query = `SELECT * FROM USER WHERE ID = ?`;
    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(row);
    })
})


server.post(`courts/addcourts` ,(req,res)=>{
    const court=req.body.court
    const date=req.bosy.date
    const location=req.body.location
    let query=`INSERT INTO COURTS (COURT,DATE,LOCATION) VALUES
    ('${court}','${date}','${location})`

    db.run(query,(err)=>{
        if(err)
        {
            console.log(err)
            return res.send(err)


        }
        else
        {
            return res.send(`created court succesfully`)
        }
    })
})

server.get(`/courts`, (req,res)=>{
    const query=`SELECT * FROM COURT`
    db.all(query,(err,rows)=>{
        if(err)
        {
            console.log(err)
            return res.send(err)
        }
        else
        {
            return res.json(rows)
        }
    })
})

server.listen(port,()=>{
    console.log(`server started at port ${port}`)
    db.serialize(()=>{
        db.run(db_access.createUserTable);
        db.run(db_access.createCourtsTable);
        db.run(db_access.createBookingTable);
    })
})