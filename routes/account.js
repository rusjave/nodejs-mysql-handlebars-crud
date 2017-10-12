var express = require('express');
var router = express.Router();
async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	var con = req.con;
	async.parallel (
	[
		function(callback){
			con.query('SELECT * FROM account', function(errors,accounts){
				callback(errors, accounts);

			});	
		}
	],
	function(err, results){
		var data = {accounts: results[0]};
		res.render('account/index', data);
		}
	);  
});

/* GET all pets and user. */
router.get('/pets', function(req, res, next) {
	var con = req.con;
	async.parallel (
	[
		function(callback){
			con.query('SELECT account.id, account.username, account.full_name, pest.pet_name, pest.bread, pest.species FROM account LEFT JOIN pest ON account.id = pest.id ORDER BY account.full_name ', function(errors,pets){
				callback(errors, pets);

			});	
		}
	],
	function(err, results){
		var data = {pets: results[0]}; console.log(data);
		res.render('account/pets', data);
		}
	);  
});

/* GET add user  page. */
router.get('/add', function(req, res, next) {
	res.render('account/add');

});

/* API for add new user*/
router.post('/add', function(req, res, next) {
	var con = req.con;
	async.parallel (
	[
		function(callback){
			con.query('INSERT INTO account(username, password, full_name) values(?,?,?)', [req.body.username, req.body.password, req.body.full_name], 
				function(errors,accounts){
					callback(errors);
			});	
		}
	],
	function(err, results){
		res.redirect('/account');
		}
	);  

});

/* API for delete new user */
router.get('/delete/:id', function(req, res, next) {
	var con = req.con;
	async.parallel (
	[
		function(callback){
			con.query('DELETE FROM account WHERE id = ?', [req.params.id], function(errors,accounts){
					callback(errors);
			});	
		}
	],
	function(err, results){
		res.redirect('/account');
		}
	);  

});

/* API for edit new user */
router.get('/edit/:id', function(req, res, next) {
	var con = req.con;
	async.parallel (
	[
		function(callback){
			con.query('SELECT * FROM account WHERE id = ?', [req.params.id], function(errors,accounts){
					callback(errors, accounts[0]);
			});	
		}
	],
	function(err, results){
		var data = {account: results[0]};
		res.render('account/edit', data);
		}
	);  

});

/* API for edit new user */
router.post('/edit/', function(req, res, next) {
	var con = req.con;
	async.parallel (
	[
		function(callback){
			con.query('SELECT * FROM account WHERE id = ?', [req.body.id], function(errors,accounts){
				var account = accounts[0].password;
					if(req.body.password !=''){
						account.password = req.body.password;
					}
					con.query('UPDATE  account set username  = ?, password = ?, full_name = ? WHERE id = ?', 
						[req.body.username, password, req.body.full_name, req.body.id], function(errors,accounts){
						callback(errors); 
					});		
			});	
		}
	],
	function(err, results){
			res.redirect('/account');
		}
	);  

});

module.exports = router;
