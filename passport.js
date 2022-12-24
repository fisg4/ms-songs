const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    return done(null, true);
  })
);

module.exports = passport;
