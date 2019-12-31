const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const House = require('./models/house');
const Review = require('./models/review');

User.sync({ alter: true });
House.sync({ alter: true });
Review.sync({ alter: true });

const sequelize = require('./database.js');

const sessionStore = new SequelizeStore({
  db: sequelize,
});

sessionStore.sync();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function(email, password, done) {
      if (!email || !password) {
        done('Email and password required', null);
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        done('User not found', null);
        return;
      }

      const valid = await user.isPasswordValid(password);

      if (!valid) {
        done('Email and password do not match', null);
        return;
      }

      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ where: { email } }).then(user => {
    done(null, user);
  });
});

nextApp.prepare().then(() => {
  const server = express();
  server.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        // make rawBody available
        req.rawBody = buf;
      },
    })
  );
  server.use(
    session({
      secret: 'r4nd0m$7r!ng', // enter a random string here
      resave: false,
      saveUninitialized: true,
      name: 'airbnb',
      cookie: {
        // secure: false, // CRITICAL on localhost
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
      store: sessionStore,
    }),
    passport.initialize(),
    passport.session()
  );

  server.post('/api/auth/register', async (req, res) => {
    const { email, password, passwordconfirmation } = req.body;

    if (password !== passwordconfirmation) {
      res.send(
        JSON.stringify({ status: 'error', message: 'Passwords do not match' })
      );
      return;
    }

    try {
      const user = await User.create({ email, password });
      req.login(user, err => {
        if (err) {
          res.statusCode = 500;
          res.send(JSON.stringify({ status: 'error', message: err }));
        }
      });
      return res.send(
        JSON.stringify({ status: 'success', message: 'User added' })
      );
    } catch (error) {
      res.statusCode = 550;
      let message = 'An error occurred c';
      if (error.name === 'SequelizeUniqueConstraintError') {
        message = 'User already exists';
      }
      res.send(JSON.stringify({ status: 'error', message }));
    }
  });

  server.post('/api/auth/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    return res.send(
      JSON.stringify({ status: 'success', message: 'Logged Out' })
    );
  });

  server.post('/api/auth/login', async (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        res.statusCode = 500;
        res.send(
          JSON.stringify({
            status: 'error',
            message: err,
          })
        );
        return;
      }

      if (!user) {
        res.statusCode = 500;
        res.send(
          JSON.stringify({
            status: 'error',
            message: 'No user matching credentials',
          })
        );
        return;
      }

      req.login(user, err => {
        if (err) {
          res.statusCode = 500;
          res.send(
            JSON.stringify({
              status: 'error',
              message: err,
            })
          );
          return;
        }

        return res.send(
          JSON.stringify({
            status: 'success',
            message: 'Logged in',
          })
        );
      });
    })(req, res, next);
  });

  server.get('/api/houses', (req, res) => {
    House.findAndCountAll().then(result => {
      const houses = result.rows.map(house => house.dataValues);

      res.status(200).send(JSON.stringify(houses));
    });
  });

  server.get('/api/houses/:id', (req, res) => {
    const { id } = req.params;

    House.findByPk(id).then(house => {
      // console.log(house);
      if (house) {
        Review.findAndCountAll({
          where: {
            houseId: house.id,
          },
        }).then(reviews => {
          console.log(reviews);
          house.dataValues.reviews = reviews.rows.map(
            review => review.dataValues
          );
          house.dataValues.reviewsCount = reviews.count;
        });
        console.log(house.dataValues);
        res.status(200).send(JSON.stringify(house.dataValues));
      } else {
        res.status(400).send(JSON.stringify({ message: 'Not found' }));
      }
    });
  });

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
