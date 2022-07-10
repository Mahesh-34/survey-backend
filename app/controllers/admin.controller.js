require('dotenv').config();
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require ("crypto");
const { json } = require('express/lib/response');
const db = require("../models");
const { send } = require('process');
const Admin = db.admins;
const AdminSession = db.adminsessions;
const Op = db.Sequelize.Op;

var transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const algorithm = 'aes-256-cbc';
var iv = crypto.randomBytes(16);

function decrypt(cryptkey, iv, encryptdata) {
  var decipher = crypto.createDecipheriv(algorithm, cryptkey, iv);
  return Buffer.concat([
      decipher.update(encryptdata),
      decipher.final()
  ]);
}

function encrypt(cryptkey, iv, cleardata) {
  var encipher = crypto.createCipheriv(algorithm, cryptkey, iv);
  return Buffer.concat([
      encipher.update(cleardata),
      encipher.final()
  ]);
}

var cryptkey = crypto.createHash('sha256').update('Nixnogen').digest();

/*var buf = "Here is some data for the encrypt"; // 32 chars
enc = encrypt(cryptkey, buf);
console.log(enc);
var enc_hex = enc.toString('hex')
console.log(enc_hex);
var hex_dec = Buffer.from(enc_hex, 'hex');
console.log(hex_dec);
var dec = decrypt(cryptkey, hex_dec);
console.log(dec.toString('utf8'));*/

// Create and Save a new Admin
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  // Create a Admin
  const admin = {
    name: req.body.name,
    email: req.body.email,      
    email_verified: false,     
    password: bcrypt.hashSync(req.body.password, 10),
    photo: req.body.photo,
    isAdmin: req.body.isAdmin ? req.body.isAdmin : false
  };
  // Save Admin in the database
  Admin.create(admin)
    .then(data => {
      var admin_data = {};
      admin_data.token = createSession(data);
      console.log(admin_data.token);
      admin_data.admin = data;       
       console.log(admin_data);
       res.send(admin_data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Admin."
      });
    });
};
// Retrieve all Admins from the database.
exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
  Admin.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving admins."
      });
    });
};
// Find a single Admin with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Admin.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Admin with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Admin with id=" + id
      });
    });
};
// Update a Admin by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Admin.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Admin was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Admin with id=${id}. Maybe Admin was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Admin with id=" + id
      });
    });
};
// Delete a Admin with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Admin.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Admin was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Admin with id=${id}. Maybe Admin was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Admin with id=" + id
      });
    });
};
// Delete all Admins from the database.
exports.deleteAll = (req, res) => {
  Admin.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Admins were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all admins."
      });
    });
};
// Find all Admins
exports.findAllAdmins = (req, res) => {
  Admin.findAll({ where: { is_admin: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving admins."
      });
    });
};
exports.login = (req, res) => {
 
  var ip = req.connection.remoteAddress;
  const adminemail = req.body.email;
  const adminpassword = req.body.password;
  Admin.findOne({ where: { email: adminemail } })
    .then(data => {
      if(bcrypt.compareSync(adminpassword, data.password)){
       var admin_data = {};
       admin_data.token = createSession(data, ip);
       console.log(admin_data.token);
       admin_data.admin = data;       
        console.log(admin_data);
        res.send(admin_data);
      } else {
        res.status(403).send("Invalid email or password.");
      }
    })
    .catch(err => {
      res.status(403).send({
        message:
          err.message || "Some error occurred while retrieving admins."
      });
    });
    
};
 function createSession(admin, ip){
  console.log('creating a session');
  admindata = {};
  admindata.ip = ip;
  admindata.adminId = admin.id;
  admindata.expires_at = new Date(Date.now() + 2 * (60 * 60 * 1000) ).getTime();
  console.log(admindata);
  var token_data = JSON.stringify(admindata);
  console.log(token_data);
  var tokenenc = encrypt(cryptkey, iv, token_data);
  console.log(tokenenc);
  const session = {
    token: Buffer.from(tokenenc).toString('hex'),
    secret: Buffer.from(iv).toString('hex'),
    adminId: admin.id,      
    ip: ip,
  };
  // Save Admin in the database
  AdminSession.create(session);
  return Buffer.from(tokenenc).toString('hex');
}
function updateSession(data, ip){
  let admindata = {};
  admindata.ip = ip;
  admindata.adminId = data.adminId;
  admindata.expires_at = new Date(Date.now() + 2 * (60 * 60 * 1000) ).getTime();
  var new_token_data = JSON.stringify(admindata);
  console.log(new_token_data);
  var new_tokenenc = encrypt(cryptkey, iv, new_token_data);
  console.log(new_tokenenc);
  const mew_session = {
    token: Buffer.from(new_tokenenc).toString('hex'),
    secret: Buffer.from(iv).toString('hex'),
    adminId: data.adminId,      
    ip: ip,
  };
  // Save Admin in the database
  AdminSession.update(mew_session, {
    where: { token: data.token }
  });  
  return Buffer.from(new_tokenenc).toString('hex');
}
exports.validateSession = (req, res) => {
  const token = req.body.token;  
  //console.log(token);
  AdminSession.findOne({ where: { token : token } })
    .then(data => {
      Admin.findByPk(data.adminId)
      .then(myadmindata => {
        if (myadmindata) {
           admindata = {};
          admindata.id = myadmindata.id;
          admindata.email = myadmindata.email;            
          admindata.email_verified = myadmindata.email_verified;            
          admindata.isAdmin = myadmindata.isAdmin;
          console.log(data.token);
      var token_data = decrypt(cryptkey, Buffer.from(data.secret, 'hex'), Buffer.from(data.token, 'hex'));     
     var date1 = new Date();
    token_json = JSON.parse(token_data);
     var expriresAt = token_json['expires_at'];   
     var ip = req.connection.remoteAddress;
     console.log(data.ip);
      if(expriresAt >= date1.getTime() && ip == data.ip){ 
        var admin_data = {};
        admin_data.token = updateSession(data, ip);
        console.log(admin_data.token); 
        console.log(admindata);
        admin_data.admin = admindata;
        admin_data.admin.ip = ip;
        admin_data.admin.expireAt = date1.getTime();   
      res.send(admin_data);   
         } else {
          res.status(500).send({message : "session Expired"});
        }
      }
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving admins."
      });
    });
    
};


exports.forgotPassword = (req, res) => {
  const email = req.body.email;  
  var code = Buffer.from(crypto.randomBytes(16)).toString('hex');
  Admin.findOne({ where: { email : email } })
    .then(data => {
      if(data){
      const new_code = {
        forgotpassword_code: code,
      };
      // Save Admin in the database
      Admin.update(new_code, {
        where: { email: email }
      }); 

      const mailConfigurations = {  
        from: process.env.SMTP_FROM,
        to: email,      
        subject: 'Reset Password : Survey',          
        html: 'Please click on this <a href="' + process.env.ADMIN_BASE_URL + '/reset-password?code=' + code  + '">link</a> to reset password <br><br> <a href="' + process.env.ADMIN_BASE_URL + '/reset-password?code=' + code  + '">' + process.env.ADMIN_BASE_URL + '/reset-password?code=' + code  + '</a>'
    };
    transport.sendMail(mailConfigurations, function(error, info){
      if (error) throw Error(error);
         console.log('Email Sent Successfully');
      console.log(info);
  });
      res.send("Sent an password reset link to assiocated email account");
} else {
  res.status(401).send({message: "Invalid Email Id."});
}

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving admins."
      });
    });
    
};

exports.sendEmailVerification= (req, res) => { 
  const email = req.body.email;  
  var code = Buffer.from(crypto.randomBytes(16)).toString('hex');
  Admin.findOne({ where: { email : email } })
    .then(data => {
      if(data){
      const new_code = {
        verification_code: code,
      };
      // Save Admin in the database
      Admin.update(new_code, {
        where: { email: email }
      }); 

      const mailConfigurations = {  
        from: process.env.SMTP_FROM,
        to: email,      
        subject: 'Verify Email : Survey',          
        html: 'Please click on this <a href="' + process.env.ADMIN_BASE_URL + '/verify-email?code=' + code  + '&email=' + email  +'">link</a> to verify your email <br><br> <a href="' + process.env.ADMIN_BASE_URL + '/verify-email?code=' + code  + '&email=' + email  + '">' + process.env.ADMIN_BASE_URL + '/verify-email?code=' + code  + '&email=' + email  + '</a>'
    };
    transport.sendMail(mailConfigurations, function(error, info){
      if (error) throw Error(error);
         console.log('Email Sent Successfully');
      console.log(info);
  });
      res.send("Sent an Email Verification link to registered email account");
      } else {
        res.status(401).send({message: "Invalid Email Id."});
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.verifyEmail = (req, res) => {
  const code = req.query.code;  
  console.log(code);
  if(code != null){
  Admin.findOne({ where: { verification_code : code } })
    .then(data => {
      if(!data){
        res.status(401).send({ message:"Invalid verification code"});
      } else {
      const new_code = {
        email_verified: true,
        verification_code: null
      };
      let status = Admin.update(new_code, {
        where: { verification_code: code }
      });
      res.send("Email Verification Successfull");
    }
    }).catch(err => {
      res.status(500).send({ message:"Invalid verification code"});
    });    
    
  } else {
    res.status(500).send({
      message:
        err.message || "Invalid Request"
    });
  }
    
};

exports.resetPassword = (req, res) => {
  const code = req.query.code;  
  console.log(code);
  if(code != null){
  Admin.findOne({ where: { forgotpassword_code : code } })
    .then(data => {
      if(!data){
        res.status(401).send({ message:"Invalid verification code"});
      } else {
      const new_code = {
        password: bcrypt.hashSync(req.body.password, 10),
        forgotpassword_code: null
      };
      let status = Admin.update(new_code, {
        where: { forgotpassword_code: code }
      });
      res.send("Password Reset Successfull");
    }
    }).catch(err => {
      res.status(401).send({ message:"Invalid verification code"});
    });
  } else {
    res.status(500).send({
      message:
        err.message || "Invalid Request"
    });
  }
};



