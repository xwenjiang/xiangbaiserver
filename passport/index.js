const passport = require("passport");
const { Strategy } = require("passport-local");
const { getKnex } = require("../db");

const knex = getKnex();
console.log("###indexjs->knex", knex);
passport.serializeUser((user, done) => {
  done(null, { id: user.id });
});

passport.deserializeUser((serializedUser, done) => {
  const { id } = serializedUser;

  knex
    .select()
    .from("users")
    .where("id", id)
    .then(([user]) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    });
});

passport.use(
  "local-user",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      knex
        .select()
        .from("users")
        .where("username", username)
        .where("password", password)
        .then(([user]) => {
          if (!user) {
            return done(null, false, { message: "账号不存在" });
          }

          if (user.password !== password) {
            return done(null, false, { message: "账号或密码错误" });
          }

          return done(null, user);
        });
    }
  )
);
