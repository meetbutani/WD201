/* eslint-disable no-unused-vars */
// sudo service postgresql start
// NODE_ENV=test npx sequelize-cli db:drop && NODE_ENV=test npx sequelize-cli db:create && NODE_ENV=test npx sequelize-cli model:generate --name Todo --attributes title:string,dueDate:string,completed:boolean && NODE_ENV=test npx sequelize-cli db:migrate
// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string,password:string
// npx sequelize-cli db:migrate
// npx sequelize-cli migration:create --name add-user-id-in-todos

const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");

const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const localStrategy = require("passport-local");

const flash = require("connect-flash");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(
  session({
    secret: "my-super-secret-key-72947639475583927",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return error;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

const { log } = require("console");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser("cookie-parser-secret"));
app.use(csrf("we_secure_our_page_with_tinycsrf", ["POST", "PUT", "DELETE"]));

// app.METHOD(PATH, HANDLER)
// or
// app.METHOD(path, callback [, callback ...])

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedInUser = request.user.id;
    // const allTodos = await Todo.getAllTodos(loggedInUser);
    const overdue = await Todo.overdue(loggedInUser);
    const dueToday = await Todo.dueToday(loggedInUser);
    const dueLater = await Todo.dueLater(loggedInUser);
    const completed = await Todo.completed(loggedInUser);

    if (request.accepts("html")) {
      response.render("todos", {
        title: "Todo Application",
        // allTodos,
        overdue,
        dueToday,
        dueLater,
        completed,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        title: "Todo Application",
        // allTodos,
        overdue,
        dueToday,
        dueLater,
        completed,
      });
    }
  }
);

app.get("/signup", async (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});

app.get("/signin", async (request, response) => {
  response.render("signin");
});

app.post("/users", async (request, response) => {
  // hash password using bcrypt
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);

  // Have to create user here
  try {
    const user = await User.create({
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", async (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (request, response) => {
    // console.log(request.user);
    response.redirect("/todos");
  }
);

app.get("/signout", async (request, response, next) => {
  // Signout
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

// app.get("/todos", async (request, response) => {
//   // res.send("Hello World");
//   console.log("Todo List");
//   try {
//     const todos = await Todo.getAllTodos();
//     return response.json(todos);
//   } catch (err) {
//     console.error(err);
//     return response.status(422).json(err);
//   }
// });

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Creating a Todo", request.body);
    // Todo
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        completed: false,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

// PUT http://mytodoapp.com/todos/123/markAsCompleted
app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("We have to update a todo with ID:", request.params.id);
    const todo = await Todo.findByPk(request.params.id);
    try {
      // const updatedTodo = await todo.setCompletionStatus(todo.completed);
      const updatedTodo = await todo.setCompletionStatus();
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Delete a todo by ID:", request.params.id);
    try {
      await Todo.remove(request.params.id, request.user.id);
      return response.json({ success: true });
    } catch (err) {
      // console.error(err);
      return response.status(422).json(err);
    }
  }
);

module.exports = app;
