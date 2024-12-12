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
    const phonenum = req.body.phonenum
    

    db.run(`INSERT INTO USER (name,email,password,phonenum, isadmin) VALUES (?,?,?,?,?)`,[name,email,password,phonenum,0], (err) => {
            if(err)
                return res.status(401).send(err)
            else
            return res.status(200).send('Registration Succesful')
        })
})

server.post('/user/login' , (req,res) =>{
    const email =req.body.email
    const password = req.body.password
    db.get('SELECT * FROM USER WHERE email = ? AND password = ?' , [email, password], (err,row)=> {
            if(err|| !row)
                return res.status(401).send('Invalid Credentials!')
            return res.status(200).send('Login Succesfull!')
    })
})

server.get('/users', (req, res) => {
    const { name, email, isadmin } = req.body

    
    let query = 'SELECT * FROM USER'
    const conditions = []
    const params = []

    if (name) {
        conditions.push('name LIKE ?')
        params.push(`%${name}%`)
    }
    if (email) {
        conditions.push('email = ?')
        params.push(email)
    }
    if (isadmin !== undefined) {
        conditions.push('ISADMIN = ?')
        params.push(isadmin)
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ')
    

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).send('Database error')
        res.status(200).json(rows)
    })
})


server.get('/user/:id', (req,res) =>{
    const { id }  = req.params;
    db.get('SELECT * FROM USER WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).send('Error retrieving user.');
        if (!row) return res.status(404).send('User not found.');
        res.status(200).json(row);
    });
});

server.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, PHONENUM } = req.body;
    //db.run('UPDATE USER SET NAME = ?, EMAIL = ?, PASSWORD = ?, PHONENUM = ? WHERE ID = ?',
    //     [name, email, password, PHONENUM, id],
    db.run('UPDATE USER SET password = ? WHERE id = ?',
        [password, id],
        (err) => {
            if (err) {
                return res.status(500).send(err);
            } else {
            res.status(200).send('User updated successfully');
 }});
});

server.delete('/user/:id', (req, res) => {
    const { id } = req.params
    db.run('DELETE FROM USER WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send('Error deleting the user')
        res.status(200).send('User deleted successfully')
    })
})

server.post(`/courts/addcourts` ,(req,res)=>{
    const name=req.body.name
    const price=req.body.price
    const location=req.body.location
    const rating=req.body.rating
    const phonenum=req.body.phonenum
    const court_amenities=req.body.court_amenities

    db.run('INSERT INTO COURTS (name, price, location, rating, phonenum, court_amenities) VALUES(?,?,?,?,?,?)', 
        [name, price, location, rating, phonenum, court_amenities], (err) => {
        if (err) return res.status(500).send('Error adding court.')
            res.status(201).send('Court added successfully.')
        }
    )
})

server.get(`/courts`, (req,res)=>{
    const query=`SELECT * FROM COURTS`
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

server.put('/courts/:id', (req, res) => {
    const { id } = req.params; 
    const { name, location, price, rating, phonenum, court_amenities } = req.body;
    let queryadd = [];
    let paramm = [];

    
    if (name) {
        queryadd.push(`name = ?`); 
        paramm.push(name);
    }
    if (location) {
        queryadd.push(`location = ?`);
        paramm.push(location);
    }
    if (price) {
        queryadd.push(`price = ?`);
        paramm.push(price);
    }
    if (rating) {
        queryadd.push(`rating = ?`);
        paramm.push(rating);
    }
    if (phonenum) {
        queryadd.push(`phonenum = ?`);
        paramm.push(phonenum);
    }
    if (court_amenities) {
        queryadd.push(`court_amenities = ?`);
        paramm.push(court_amenities);
    }

    if (queryadd.length === 0) {
        return res.status(400).send('No fields to update.');
    }
   
    paramm.push(id);

    db.run(
        `UPDATE COURTS SET ${queryadd.join(', ')} WHERE id = ?`,
        paramm,
        (err) => {
            if (err) return res.status(500).send(err.message); 
            res.status(200).send('Court updated successfully');
        }
    );
});



server.delete('/courts/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM COURTS WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Court deleted successfully');
    });
});

server.get('/courts/location', (req,res) => {
    const {location} =req.query
    db.all('SELECT * FROM COURTS WHERE location = ?', [location], (err,rows) => {
        if (err) return res.status(500).send('Error retrieving courts')
            res.status(200).json(rows)
    })
})

server.post('/booking', (req, res) => {
    const { time, date, Pphonenum, user_id } = req.body;
    db.run('INSERT INTO BOOKING (time, date, phonenum, user_id) VALUES (?, ?, ?, ?)',
        [time, date, phonenum, user_id],
        (err) => {
            if (err) return res.status(500).send('Booking unsuccesful')
            res.status(200).send('Booking added successfully')
        })
})

server.get('/user/booking/:id', (req, res) => {
    const { id } = req.params
    db.all('SELECT * FROM BOOKING WHERE user_id = ?', [id], (err, rows) => {
        if (err) return res.status(500).send('Error retrieving bookings.')
        res.status(200).json(rows)
    })
})

server.get('/booking/court/:court_id', (req, res) => {
    const { court_id } = req.params;
    db.all('SELECT * FROM BOOKING WHERE court_id = ?', [court_id], (err, rows) => {
        if (err) return res.status(500).send('Error retrieving bookings.')
        res.status(200).json(rows)
    })
})


server.put('/booking/:id', (req, res) => {
    const { id } = req.params
    const { time, date, phonenum} = req.body
    db.run('UPDATE BOOKING SET time = ?, date = ?, phonenum = ? WHERE id = ?',
        [time, date, phonenum, id],
        (err) => {
            if (err) return res.status(500).send(err)
            res.status(200).send('Booking updated successfully')
        })
})

server.delete('/booking/:id', (req, res) => {
    const { id } = req.params
    db.run('DELETE FROM BOOKING WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Booking deleted successfully')
    })
})

server.post('/review', (req, res) => {
    const { court_id, user_id, rating, comment } = req.body
    db.run('INSERT INTO REVIEWS (court_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [court_id, user_id, rating, comment],
        (err) => {
            if (err) return res.status(401).send(err)
            res.status(200).send('Review added successfully')
        })
})

server.put('/review/:id', (req, res) => {
    const { id } = req.params
    const { court_id, user_id, rating, comment } = req.body

    db.run('UPDATE REVIEWS SET court_id = ?, user_id = ?, rating = ?, comment = ? WHERE id = ?',
        [court_id, user_id, rating, comment, id],
        (err) => {
            if (err) return res.status(500).send(err)
            res.status(200).send('Review updated successfully')
        })
})

server.delete('/review/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM REVIEWS WHERE id = ?', [id], (err) => {
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
                console.log("Booking table got created succesfully");
            }
    });
        db.run(db_access.createReviewTable,  (err)=>{
            if (err){
                console.error("did not create court table",err);
            
            } else {
                console.log("Review table got created succesfully");
            }
    });
    })
})