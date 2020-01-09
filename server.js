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
const { Op } = require('sequelize');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('./models/user');
const House = require('./models/house');
const Review = require('./models/review');
const Booking = require('./models/bookings');

User.sync({ alter: true });
House.sync({ alter: true });
Review.sync({ alter: true });
Booking.sync({ alter: true });

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
      if (house) {
        Review.findAndCountAll({
          where: {
            houseId: house.id,
          },
        }).then(reviews => {
          house.dataValues.reviews = reviews.rows.map(
            review => review.dataValues
          );
          house.dataValues.reviewsCount = reviews.count;
          res.status(200).send(JSON.stringify(house.dataValues));
        });
      } else {
        res.status(400).send(JSON.stringify({ message: 'Not found' }));
      }
    });
  });

  const canBookThoseDates = async (houseId, startDate, endDate) => {
    const results = await Booking.findAll({
      where: {
        houseId,
        startDate: {
          [Op.lte]: new Date(endDate),
        },
        endDate: {
          [Op.gte]: new Date(startDate),
        },
      },
    });
    return !(results.length > 0);
  };

  server.post('/api/houses/reserve', async (req, res) => {
    const { startDate, endDate, houseId, sessionId } = req.body;

    const userEmail = req.session.passport.user;
    User.findOne({ where: { email: userEmail } }).then(user => {
      Booking.create({
        houseId,
        userId: user.id,
        startDate,
        endDate,
        sessionId,
      }).then(() => {
        res
          .status(200)
          .send(JSON.stringify({ status: 'success', message: 'ok' }));
      });
    });
  });

  const getDatesBetweenDates = (startDate, endDate) => {
    let dates = [];
    while (startDate < endDate) {
      dates = [...dates, new Date(startDate)];
      startDate.setDate(startDate.getDate() + 1);
    }
    dates = [...dates, endDate];
    return dates;
  };

  server.post('/api/houses/check', async (req, res) => {
    const { startDate, endDate, houseId } = req.body;

    let message = 'free';
    if (!(await canBookThoseDates(houseId, startDate, endDate))) {
      message = 'busy';
    }

    res.json({
      status: 'success',
      message,
    });
  });

  server.post('/api/houses/booked', async (req, res) => {
    const { houseId } = req.body;

    const results = await Booking.findAll({
      where: {
        houseId,
        endDate: {
          [Op.gte]: new Date(),
        },
      },
    });

    let bookedDates = [];

    for (const result of results) {
      const dates = getDatesBetweenDates(
        new Date(result.startDate),
        new Date(result.endDate)
      );
      bookedDates = [...bookedDates, ...dates];
    }

    // remove duplicates
    bookedDates = [...new Set(bookedDates.map(date => date))];

    res.json({
      status: 'success',
      message: 'ok',
      dates: bookedDates,
    });
  });

  server.post('/api/stripe/session', async (req, res) => {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          name: 'Booking house on Airbnb clone',
          amount: amount * 100,
          currency: 'usd',
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/bookings`,
      cancel_url: `${process.env.BASE_URL}/bookings`,
    });

    res.status(200).send(
      JSON.stringify({
        status: 'success',
        sessionId: session.id,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      })
    );
  });

  server.post('/api/stripe/webhook', async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(
        JSON.stringify({
          status: 'success',
          message: `Webhook Error: ${err.message}`,
        })
      );
      console.log(err.message);
    }

    if (event.type === 'checkout.session.completed') {
      const sessionId = event.data.object.id;

      try {
        Booking.update({ paid: true }, { where: { sessionId } });
      } catch (err) {
        console.error(err);
      }
    }

    res.status(200).send(JSON.stringify({ recieved: true }));
  });

  server.get('/api/bookings/list', async (req, res) => {
    if (!req.session.passport || !req.session.passport.user) {
      res
        .status(403)
        .send(JSON.stringify({ status: 'error', message: 'Unauthorized' }));
    }

    const userEmail = req.session.passport.user;
    const user = await User.findOne({ where: { email: userEmail } });
    Booking.findAndCountAll({
      where: {
        paid: true,
        userId: user.id,
        endDate: {
          [Op.gte]: new Date(),
        },
      },
      order: [['startDate', 'ASC']],
    }).then(async result => {
      const bookings = await Promise.all(
        result.rows.map(async booking => {
          const data = {};
          data.booking = booking.dataValues;
          data.house = (await House.findByPk(data.booking.houseId)).dataValues;
          return data;
        })
      );
      res.status(200).send(JSON.stringify(bookings));
    });
  });

  server.post('/api/bookings/clean', (req, res) => {
    Booking.destroy({
      where: {
        paid: false,
      },
    });

    res.status(200).send(
      JSON.stringify({
        status: 'success',
        message: 'ok',
      })
    );
  });

  server.get('/api/host/list', async (req, res) => {
    if (!req.session.passport || !req.session.passport.user) {
      res
        .status(403)
        .send(JSON.stringify({ status: 'error', message: 'Unauthorized' }));
    }

    const userEmail = req.session.passport.user;
    const user = await User.findOne({ where: { email: userEmail } });

    const houses = await House.findAll({
      where: {
        house: user.id,
      },
    });

    const houseIds = houses.map(house => house.dataValues.id);

    const bookingsData = await Booking.findAll({
      where: {
        paid: true,
        houseId: {
          [Op.in]: houseIds,
        },
        endDate: {
          [Op.gte]: new Date(),
        },
      },
      order: [['startDate', 'ASC']],
    });

    const bookings = await Promise.all(
      bookingsData.map(async booking => ({
        booking: booking.dataValues,
        house: houses.filter(
          house => house.dataValues.id === booking.dataValues.houseId
        )[0].dataValues,
      }))
    );
    res.status(200).send(JSON.stringify({ bookings, houses }));
  });

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
