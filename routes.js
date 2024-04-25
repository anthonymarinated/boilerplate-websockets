
const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports = function (app, myDataBase) {
  // Be sure to change the title
  app.route('/').get((req, res) => {
    //Change the response to render the Pug template
    res.render('index', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true
    });
  });

  app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };
  
  app.get('/profile', ensureAuthenticated, (req,res) => {
    res.render('profile', { username: req.user.username });
  });

  app.get('/logout', (req, res) => {
    req.logout((err) => {
      if(err){
        console.log('Logout error: ', err);
        return next(err);
      }
      res.redirect('/');
    });
  });

  app.route('/register').post((req, res, next) => {
    // hash request body password 
    const hash = bcrypt.hashSync(req.body.password, 12)
    // console.log(req.body); // we get req.body.username and req.body.password from lines 24 and 27 in index.pug
    myDataBase.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        //if a user is not found and no errors occur, then insertOne into the database with username and password
        myDataBase.insertOne({ username: req.body.username, password: hash}, (err, doc) => {
          if (err) res.redirect('/');
          //as long as no errors occur there call next to go to step 2 which is to authenticate on line 165
          else next(null, doc.ops[0]); // The inserted document is held within the ops property of the doc
        });
      }
    });
  },
    passport.authenticate('local', { failureRedirect: '/' }), (req, res, next) => {
      res.redirect('/profile');
    }
  );

  app.route('/auth/github').get(passport.authenticate('github'));
  app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/'}), (req, res) => {
    res.redirect('/profile');
  });

  app.use((req, res, next) => {
    res.status(404).type('text').send('Not Found');
  });

}