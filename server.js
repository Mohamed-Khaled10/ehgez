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
    let PHONENUM = req.body.PHONENUM
    

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

server.get('/users', (req, res) =>{
    db.all('SELECT * FROM USER', (err, rows) =>{
        if (err) return res.status(500).send(err)
        res.status(200).json(rows)
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

server.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, PHONENUM } = req.body;
    db.run('UPDATE USER SET NAME = ?, EMAIL = ?, PASSWORD = ?, PHONENUM = ? WHERE ID = ?',
        [name, email, password, PHONENUM, id],
        (err) => {
            if (err) {
                return res.status(500).send(err);
            } else {
            res.status(200).send('User updated successfully');
 }});
});

server.delete('/user/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM USER WHERE ID = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('User deleted successfully');
    });
});

server.post(`/courts/addcourts` ,(req,res)=>{
    const name=req.body.name
    const price=req.bosy.price
    const location=req.body.location
    const rating=req.body.rating
    const phonenum=req.body.phonenum
    const court_amenities=req.body.court_amenities

    db.run(`INSERT INTO COURTS (NAME, PRICE, LOCATION, RATING, PHONENUM, COURT_AMENITIES) VALUES
    (?,?,?,?,?,?)`, [name, price, location, rating, phonenum, court_amenities], (err) => {
        if(err)
        {
            console.log(err)
            return res.status(401).send(err)
        }
        else
        {
            return res.status(200).send(`created court succesfully`)
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

server.put('/court/:id', (req, res) => {
    const { id } = req.params;
    const { name, location, price, rating, PHONENUM, court_amenities } = req.body;
    db.run('UPDATE COURTS SET NAME = ?, LOCATION = ?, PRICE = ?, RATING = ?, PHONENUM = ?, COURT_AMENITIES = ? WHERE ID = ?',
        [name, location, price, rating, PHONENUM, court_amenities, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.status(200).send('Court updated successfully');
        });
});

server.delete('/court/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM COURTS WHERE ID = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Court deleted successfully');
    });
});

server.post('/booking', (req, res) => {
    const { time, date, PHONENUMBER } = req.body;
    db.run('INSERT INTO BOOKING (TIME, DATE, PHONENUMBER) VALUES (?, ?, ?)',
        [time, date, PHONENUMBER],
        (err) => {
            if (err) return res.status(401).send(err)
            res.status(200).send('Booking added successfully')
        })
})

server.put('/booking/:id', (req, res) => {
    const { id } = req.params
    const { time, date, PHONENUMBER } = req.body
    db.run('UPDATE BOOKING SET TIME = ?, DATE = ?, PHONENUMBER = ? WHERE ID = ?',
        [time, date, PHONENUMBER, id],
        (err) => {
            if (err) return res.status(500).send(err)
            res.status(200).send('Booking updated successfully')
        })
})

server.delete('/booking/:id', (req, res) => {
    const { id } = req.params
    db.run('DELETE FROM BOOKING WHERE ID = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Booking deleted successfully')
    })
})

server.post('/review', (req, res) => {
    const { court_id, user_id, rating, comment } = req.body
    db.run('INSERT INTO REVIEWS (COURT_ID, USER_ID, RATING, COMMENT) VALUES (?, ?, ?, ?)',
        [court_id, user_id, rating, comment],
        (err) => {
            if (err) return res.status(401).send(err)
            res.status(200).send('Review added successfully')
        })
})

server.put('/review/:id', (req, res) => {
    const { id } = req.params
    const { court_id, user_id, rating, comment } = req.body
    db.run('UPDATE REVIEWS SET COURT_ID = ?, USER_ID = ?, RATING = ?, COMMENT = ? WHERE ID = ?',
        [court_id, user_id, rating, comment, id],
        (err) => {
            if (err) return res.status(500).send(err)
            res.status(200).send('Review updated successfully')
        })
})

server.delete('/review/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM REVIEWS WHERE ID = ?', [id], (err) => {
        if (err) return res.status(500).send(err)
        res.status(200).send('Review deleted successfully')
    })
})

server.listen(port,()=>{
    console.log(`server started at port ${port}`)
    db.serialize(()=>{
        db.run(db_access.createUserTable, (err)=>{
            if (err){
                console.error("did not create user table",err);
            
            } else {
                console.log("User table got created succesfully");
            }
    });
        db.run(db_access.createCourtsTable, (err)=>{
            if (err){
                console.error("did not create court table",err);
            
            } else {
                console.log("Court table got created succesfully");
            }
    });
        
        db.run(db_access.createBookingTable, (err)=>{
            if (err){
                console.error("did not create Booking table",err);
            
            } else {
                console.log("Court table got created succesfully");
            }
    });
        db.run(db_access.createReviewTablel,  (err)=>{
            if (err){
                console.error("did not create court table",err);
            
            } else {
                console.log("Court table got created succesfully");
            }
    });
    })
})