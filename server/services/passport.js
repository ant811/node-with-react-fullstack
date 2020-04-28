const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const { googleClientID, googleClientSecret } = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  // the is used here is not the Google user id, it is the
  // id auto-assigned to the record by Mongo
  done(null, user.id);
});

// first argument id is whatever we stuffed inside of token/cookie (the Mongo record's id, not Google id)
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
  //done(null, id)
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log('accessToken:', accessToken);
      // console.log('refreshToken:', refreshToken);
      // console.log('profile:', profile);
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        done(null, existingUser);
      } else {
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      }
    }
  )
);
