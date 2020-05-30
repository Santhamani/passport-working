var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var cors= require("cors");
const nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var session = require('express-session');
var expressFlash = require('express-flash');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, db);


const bcrypt = require('bcrypt');
const saltRounds = 10;
var md5 = require('md5');



 
var index = require('./routes/index');
var users = require('./routes/users');
 
var app = express();
 
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views','views');

// production mode
// if(process.env.NODE_ENV === 'production') {  
  // app.use(express.static(path.join(__dirname, '/home/obscst')));
  // app.get('*', (req, res) => {    
  //   res.sendfile(path.join(__dirname = '/home/obscst/public_html/index.html'));  
  // })
  // };
 
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views'));
var sessionMiddleware = session({
  secret: 'sessionscrete',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge: 365 * 24 * 60 * 60 * 1000}
});
app.use(sessionMiddleware);

// create reusable transporter object using the default SMTP transport--from mailid
let smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'snth.ammu@gmail.com',
      pass : 'ammu@584'
  }
});
 
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  // database: "local"
});
 
db.connect();
// db.connect(function(err) {
  // if(err) throw err;
  console.log("connected")
  db.query("CREATE DATABASE IF NOT EXISTS apple_test", function(err,results){
    if(err) throw err;
    console.log("Blueappletechno DB Created")
  });
// })
 
// db.connect(function(err){
// if(err) throw err;
db.query("USE apple_test",(err,results) => {
  if(err) throw err;
  console.log("Using Apple test")
});
// })
 
 
var continent_sql = "CREATE TABLE IF NOT EXISTS continent (unique_continent_id int(11) NOT NULL primary key UNIQUE AUTO_INCREMENT, continent_name VARCHAR(255) UNIQUE, continent_area_rank int(11), continent_area int(100))";
 
var country_sql = "CREATE TABLE IF NOT EXISTS country (unique_country_id int(11) primary key UNIQUE AUTO_INCREMENT, unique_continent_id VARCHAR(255), country_name VARCHAR(255) UNIQUE, country_area INT(100), country_area_rank INT(255), country_rank_id INT(100))";
 
var state_sql = "CREATE TABLE IF NOT EXISTS state (unique_state_id int(11) primary key UNIQUE AUTO_INCREMENT, unique_country_id VARCHAR(255), state_name VARCHAR(255) UNIQUE, state_area INT(100), state_area_rank INT(100), state_rank_id INT(100))";
 
var district_sql = "CREATE TABLE IF NOT EXISTS district (unique_district_id int(11) primary key UNIQUE AUTO_INCREMENT, unique_state_id VARCHAR(255), district_name VARCHAR(255) UNIQUE, district_area INT(100), district_area_rank INT(100), district_rank_id INT(100))";
 
// var signup_sql = "CREATE TABLE IF NOT EXISTS REGISTER (id INT(11) PRIMARY KEY UNIQUE AUTO_INCREMENT, fname VARCHAR(255) UNIQUE NOT NULL, lname VARCHAR(255), phoneno VARCHAR(20) NOT NULL, username VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL)"

var login_sql = "CREATE TABLE IF NOT EXISTS LOGIN(id INT(11) PRIMARY KEY UNIQUE AUTO_INCREMENT, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL)"

var signin_sql = "CREATE TABLE IF NOT EXISTS SIGNIN(id INT(11) PRIMARY KEY UNIQUE AUTO_INCREMENT, email VARCHAR(255) UNIQUE, otp VARCHAR(255), phoneno VARCHAR(255) UNIQUE)"

  
  db.query(signin_sql, function (err, result) {
    if (err) throw err;
    console.log("Sign In Table created");
  });

  // db.query(signup_sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Register Table created");
  // });

  db.query(login_sql, function(err,result) {
    if(err) throw err
    console.log("Login Table created")
  })

  db.query(continent_sql, function (err, result) {
    if (err) throw err;
    console.log("Continent Table created");
  });

  db.query(country_sql, function (err, result) {
    if (err) throw err;
    console.log("Country Table created");
  });

  db.query(state_sql, function (err, result) {
    if (err) throw err;
    console.log("State Table created");
  });

  db.query(district_sql, function (err, result) {
    if (err) throw err;
    console.log("Disrtict Table created");
  });
 
app.get('/continents', (req,res,next) => {
  db.query("SELECT * FROM continent", function (err, result, fields) {
    if (err) {
      return res.send(err);
    }
    else{
      return res.json({
        data:result
      })
    }
    });
})
 
app.get('/countries', (req,res,next) => {
  db.query("SELECT * FROM country", function (err, result, fields) {
    if (err) {
      return res.send(err);
    }
    else{
      return res.json({
        data:result
      })
    }
    });
})
 
app.get('/states', (req,res,next) => {
  db.query("SELECT * FROM state", function (err, result, fields) {
    if (err) {
      return res.send(err);
    }
    else{
      return res.json({
        data:result
      })
    }
    });
})
 
app.get('/districts', (req,res,next) => {
  db.query("SELECT * FROM district", function (err, result, fields) {
    if (err) {
      return res.send(err);
    }
    else{
      return res.json({
        data:result
      })
    }
    });
})
  
// Insert continents if it is not exists
app.post('/continents/add', (req,res,next) => {
  // console.log(req.body);
  db.query('select unique_continent_id,continent_area from continent where continent_name = "'+req.body.continent_name+'"', function(err,data){
    // console.log("190",data);
    if(data.length !== 0){ 
      // console.log("Already Exists" , data);
      res.json({Success:false, message:"Continent Already Exists"})
    } else {
        // db.query('select unique_continent_id,continent_area, continent_area_rank from continent where  continent_area < "'+req.body.continent_area+'"', function(err,data){
        // console.log(req.body.continent_area, "Not Exixts", data);
        // })
        db.query('select * from continent', function(err,data){
          if (data.length !== 0){
            // console.log("area", data);
                db.query('select MAX(c.continent_area_rank) AS max, MIN(c.continent_area_rank) AS min from continent c where c.continent_area <= "'+req.body.continent_area+'"', function(err, data) {
                  if(err)
                  throw err
                  else
                  console.log("235 min max values",data, data[0].min, data[0].max);
                  //New entry with highest rank and small area
                  if(data[0].min == null && data[0].max == null){
                    console.log("238")
                    db.query('select c1.continent_area_rank As rank from continent c1 ORDER By c1.continent_area_rank DESC LIMIT 1;' ,(err, rankdata) => {
                      if(err){
                      console.log("error", err);
                      } else{
                        console.log("area rank value",rankdata[0].rank+1, rankdata[0].rank, rankdata);
                        db.query('INSERT INTO continent (continent_name, continent_area_rank, continent_area) VALUES ("'+req.body.continent_name+'","'+ (rankdata[0].rank + 1) +'", "'+req.body.continent_area+'")', (err, data) => {
                          if(err)
                          throw err
                          else
                          console.log({Success:true, message:"Least value inserted"})
                        })
                      }
                    })
                    console.log("min val")
                  } else {
                    //Between(top-bottom-> >= area(area between big area(lowest rank) & small area(highest rank)) <=) and Lowest(big area) rank 
                    db.query('UPDATE continent set continent_area_rank = continent_area_rank + 1 where continent_area_rank >= "'+ data[0].min +'"', function(err, data){
                      if(err)
                      console.log(err,"error")
                      else 
                      console.log({Success:true, message:"Continents Updated succesfully"});
                    });
                    db.query('INSERT INTO continent (continent_name, continent_area_rank, continent_area) VALUES ("'+req.body.continent_name+'","'+ (data[0].min) +'", "'+req.body.continent_area+'")', function(err, data){
                      if(err)
                      console.log(err,"error")
                      else 
                      console.log({Success:true, message:"New Continent Inserted succesfully"});
                    });
                    console.log("max-min vals" , data,data[0].min, data[0].max)
                  }
                })
          }
          // If db is null no data
          else {
            db.query('INSERT INTO continent (continent_name, continent_area, continent_area_rank) VALUES("'+req.body.continent_name+'","'+req.body.continent_area+'", "'+ 1 +'")', function(err,data){  
              if(err){
                  res.json({success: false});
                }else{
                  res.json({success: true});
                }
            });
          }
        });    
    }
  })
})
 
app.post('/countries/add', (req,res,next) => {
  console.log(req.body);
  // var min = 0 , max = 0,ConRank, Area;
  // db.query('select c2.continent_area_rank as ConRank from continent c2 where unique_continent_id = "'+req.body.unique_continent_id+'"', (err, data) => {
  // if(err){
  //   console.log("error",err)
  // } 
  // else {
  //   console.log("254 ConRank", data, data[0].ConRank)
  //   ConRank = data[0].ConRank;
  //   console.log("256",ConRank);
  // }
  // })
  db.query('select unique_country_id,country_area from country where country_name = "'+req.body.country_name+'"', function(err,data){
    console.log(data);
    if(data.length !== 0){ 
      // console.log("Already Exists" , data);
      res.json({Success:false, message:"Country Already Exists"})
    } else {
        db.query('select * from country', function(err,data){
          if (data.length !== 0){
            // console.log("area", data);
                db.query('select MAX(cc.country_area_rank) AS cmax, MIN(cc.country_area_rank) AS cmin from country cc where cc.country_area <= "'+req.body.country_area+'"  ', function(err, data) {
                  if(err)
                  throw err
                  else
                  console.log(" 265 min max values",data, data[0].cmin, data[0].cmax);
                  //New entry with highest rank and small area
                  if(data[0].cmin == null && data[0].cmax == null){
                    db.query('select c1.country_area_rank As rank from country c1 ORDER By c1.country_area_rank DESC LIMIT 1;' ,(err, rankdata) => {
                      if(err){
                      console.log("error", err);
                      } else{
                        console.log("272 area rank value",rankdata[0].rank+1, rankdata[0].rank, rankdata);
                        db.query('select c2.continent_area_rank as ConRank from continent c2 where unique_continent_id = "'+req.body.unique_continent_id+'"',(err,data) => {
                          if (err){
                            console.log("error",err);
                          } else {
                            console.log("con rank", data, data[0].ConRank);
                            console.log("278 area rank value",rankdata[0].rank+1, rankdata[0].rank, rankdata);
                            db.query('INSERT INTO country (country_name, country_area_rank, country_area, unique_continent_id, country_rank_id) VALUES ("'+req.body.country_name+'","'+ (rankdata[0].rank + 1) +'", "'+req.body.country_area+'","'+req.body.unique_continent_id+'","'+data[0].ConRank+(rankdata[0].rank + 1)+'")', (err, data) => {
                              if(err)
                              throw err
                              else
                              console.log({Success:true, message:"Least value inserted"})
                            })
                          }
                        })
                      }
                    })
                    console.log("min val")
                  } else {
                    //Between(top-bottom-> >= area(area between big area(lowest rank) & small area(highest rank)) <=) and Lowest(big area) rank 
                    db.query('select c2.continent_area_rank as ConRank from continent c2 where unique_continent_id = "'+req.body.unique_continent_id+'"', (err, rdata) => {
                      if(err){
                        console.log("error",err)
                      } 
                      else {
                        db.query('UPDATE country set country_area_rank = country_area_rank + 1 where country_area_rank >= "'+ data[0].cmin +'"', function(err, data){
                        if(err)
                        console.log(err,"error")
                        else 
                        console.log({Success:true, message:"Countries Updated succesfully"});
                        });
                        console.log("ConRank", rdata, rdata[0].ConRank, data[0].cmin)
                        db.query('INSERT INTO country (country_name, country_area_rank, country_area, unique_continent_id, country_rank_id) VALUES ("'+req.body.country_name+'","'+ data[0].cmin +'", "'+req.body.country_area+'","'+req.body.unique_continent_id+'","'+rdata[0].ConRank+(data[0].cmin)+'")', function(err, data){
                        if(err)
                        console.log(err,"error")
                        else 
                        console.log({Success:true, message:"New Country Inserted succesfully"});
                        });
                        db.query('UPDATE country set country_rank_id = "'+rdata[0].ConRank+country_rank_area+'" where country_area_rank > "'+ data[0].cmin +'"', (err,data) => {
                          if(err){
                            console.log("Err", err)
                          } else {
                            console.log("Area Rank id updated successfully");
                          }
                        })
                      }
                    })
                    console.log("max-min vals" , data,data[0].cmin, data[0].cmax)
                  }
                })
          }
          // If db is null no data
          else {
            console.log("intial entry", req.body);
            db.query('select c2.continent_area_rank as ConRank from continent c2 where unique_continent_id = "'+req.body.unique_continent_id+'"', (err,data) => {
              if(err){
                console.log("Err", err)
              } else {
                db.query('INSERT INTO country (country_name, country_area_rank, country_area, unique_continent_id, country_rank_id) VALUES ("'+req.body.country_name+'","'+ 1 +'", "'+req.body.country_area+'","'+req.body.unique_continent_id+'","'+data[0].ConRank+1+'")', function(err,data){  
                  if(err){
                      res.json({success: false});
                      console.log("error", err)
                    }else{
                      res.json({success: true});
                      console.log("intial entry inserted")
                    }
                });
              }
            })
            
          }
        });    
    }
  })
  // const INSERT_CUSTOMER_QUERY = `INSERT INTO 'continent' (continent_name) values('${continent_name}')`;
  // res.send("add names...");
  // db.query(INSERT_CUSTOMER_QUERY,(err,result) => {
  //   if(err){
  //      return res.send(err);
  //   } else {
  //     res.send('added successfully....')
  //   }
  // })
})
 
app.post('/states/add', (req,res,next) => {
  console.log(req.body);
  // const {continent_name} = req.query
  db.query('select state_id from state where state_name = "'+req.body.state_name+'"', function(err,data){
    console.log(data);
    if(data.length !== 0){ 
      console.log("Already Exists" , data);
      res.json({Success:false, message:"State Already Exists"})
    } else {
      console.log("Not Exixts");
      db.query('INSERT INTO state (country_id,state_name) VALUES("'+req.body.country_id+'","'+req.body.state_name+'")', function(err,data){  
            if(err){
                res.json({success: false});
              }else{
                res.json({success: true});
              }
            });
        }
  })
  // const INSERT_CUSTOMER_QUERY = `INSERT INTO 'continent' (continent_name) values('${continent_name}')`;
  // res.send("add names...");
  // db.query(INSERT_CUSTOMER_QUERY,(err,result) => {
  //   if(err){
  //      return res.send(err);
  //   } else {
  //     res.send('added successfully....')
  //   }
  // })
})
 
app.post('/districts/add', (req,res,next) => {
  console.log(req.body);
  // const {continent_name} = req.query
  db.query('select district_id from district where district_name = "'+req.body.district_name+'"', function(err,data){
    console.log(data);
    if(data.length !== 0){ 
      console.log("Already Exists" , data);
      res.json({Success:false, message:"District Already Exists"})
    } else {
      console.log("Not Exixts");
      db.query('INSERT INTO district (state_id,district_name) VALUES("'+req.body.state_id+'","'+req.body.district_name+'")', function(err,data){  
            if(err){
                res.json({success: false});
              }else{
                res.json({success: true});
              }
            });
        }
  })
  // const INSERT_CUSTOMER_QUERY = `INSERT INTO 'continent' (continent_name) values('${continent_name}')`;
  // res.send("add names...");
  // db.query(INSERT_CUSTOMER_QUERY,(err,result) => {
  //   if(err){
  //      return res.send(err);
  //   } else {
  //     res.send('added successfully....')
  //   }
  // })
})
 
// app.post('/login', (req,res,next) => {
//   console.log(req.body)
//   var passDecrypt = md5(req.body.password);
//   db.query('SELECT  email,password FROM register where email = "'+req.body.email+'" AND password = "'+passDecrypt+'"', function(err,data){
//     if(err){
//       console.log(err)
//     } 
//     else {
//       db.query('INSERT INTO login (email,password) values("'+req.body.email+'","'+req.body.password+'")', function(err,data){
//         if(err){
//           console.log({success:false,message:"Login Failed"});
//         }
//         else{
//           console.log({success:true, message:"Logged iin successfully"});
//         }
//       })
//     }

//   })
// })

app.use('/', index);
app.use('/users', users);
// app.use('/names', names)

app.use(passport.initialize());
app.use(passport.session());
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
 
var http = require('http');
module.exports = app;
var server = http.createServer(app);
server.listen(8080);



 

