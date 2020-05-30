var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
var mysql = require("mysql");
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var session = require('express-session');
var expressFlash = require('express-flash');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, db);

var sessionMiddleware = session({
	secret: 'sessionscrete',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie:{maxAge: 365 * 24 * 60 * 60 * 1000}
  });
router.use(sessionMiddleware);

router.use(passport.initialize());
router.use(passport.session());

var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	// database: "local"
  });

  db.connect();

  console.log("connected")
  db.query("CREATE DATABASE IF NOT EXISTS apple_test", function(err,results){
    if(err) throw err;
    console.log("Blueappletechno DB Created")
  });

db.query("USE apple_test",(err,results) => {
  if(err) throw err;
  console.log("Using Apple test")
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('hi users...');
});


// create reusable transporter object using the default SMTP transport--from mailid
let smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'snth.ammu@gmail.com',
      pass : 'ammu@584'
  }
});

//post for OTP
router.post('/getotp', async function(req,res,next){
	// console.log(req);
	var email = req.body.email;
	var code = '';
	var possible = "0123456789";
	for (var i = 0; i < 8; i++){
		code += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	db.query('SELECT email,phoneno from signin where email="'+req.body.email+'" OR phoneno="'+req.body.phoneno+'"', function(err,updatedata){
		if(updatedata.length != 0){
			db.query('UPDATE signin set otp="'+code+'" where email="'+req.body.email+'" OR phoneno="'+req.body.phoneno+'"', function(err,data){
				if(err){
					console.log(err)
				}
				else{
					console.log("signin updated", code)
				}
			})
		}
		else {
			db.query('INSERT INTO SIGNIN(email,otp,phoneno) VALUES("'+req.body.email+'","'+code+'","'+req.body.phoneno+'")', function(err,insertdata){
				if(err){
					console.log(err)
				}
				else {
					console.log("signin table inserted")
				}
			})
		}
	})
    var mailOptions={
        from: 'OBSCST Registration',
        to : email,
        subject : "OBSCST OTP VERIFICATION PROCESS ",
        // text: "Haii"
        html : "Hello,<br>Please enter the OTP to complete the registration.<br><h2>"+code+"</h2>."
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
            // res.end("error");
            res.json({success:false, message:"error"})
     }else{
            console.log("Message sent: " + response.message);
            // res.end("sent");
            res.json({success:true});
         }
    });
})

passport.serializeUser(function(user, done) {
	console.log("user", user)
	done(null, user.email);
});
passport.deserializeUser(function(email, done) {
	db.query("SELECT * FROM sigin WHERE email = '"+email+"'", function(err, rows){
	  done(err, rows[0]);
	});
});

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'otp',
    passReqToCallback : true
  },
  function(req, email, done) {
	console.log("email,otp", email,otp);
    db.query("SELECT * FROM signin WHERE email = '"+email+"'", function(err, rows){
      if (err)
        return done(err);
      if (!rows.length) {
        return done(null, false, 'No user found.');
      }
      if ((otp) !== rows[0].otp){
        return done(null, false, 'Oops! Wrong password.');
      }
      return done(null, rows[0]);
    });
  })
)

//Login
router.post('/login', function(req, res){
	console.log(req.body.otp)
	if (req.isAuthenticated()){
		console.log("login success")
		res.sendFile(path.join(__dirname+'/clinet/public/index.html'));
	  
	}else{
		res.redirect('/');
		console.log("login failed")
	}
  });

//   app.post('/userhome', function(req, res){
// 	passport.authenticate('local-login',function(err, user, info){
// 	  if(!user){
// 		res.json({success: false, errmsg: info});
// 	  }else{
// 		req.logIn(user, function(err){
// 		  var username = req.body.username;
// 		  var password = md5(req.body.password);
// 		  db.query("SELECT onlineindication FROM register WHERE uname= '"+username+"' AND pswd = '"+password+"'", function(err, data){
// 			if(data[0].onlineindication === 'Offline'){
// 			  db.query("UPDATE register SET onlineindication= 'Online',lastseen= NULL WHERE uname= '"+username+"'");
// 			  setUserInfo();
// 			}else{
// 			  setUserInfo();
// 			}
// 			function setUserInfo(){
// 			  return res.json({success: true, username: username});
// 			}
// 		  });
// 		});
// 	  }
// 	})(req, res);
//   });

module.exports = router;