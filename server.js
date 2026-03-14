const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "users.json");

function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "smarthub-change-in-production",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Register
app.post("/register", async (req, res) => {
  const { username, password, plot } = req.body;
  const trimmedUser = (username || "").trim();
  const trimmedPlot = (plot || "").trim();

  if (!trimmedUser || !password || !trimmedPlot) {
    return res.redirect("/register?error=Please fill all fields");
  }

  const users = loadUsers();
  if (users.some((u) => u.username.toLowerCase() === trimmedUser.toLowerCase())) {
    return res.redirect("/register?error=Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({
    username: trimmedUser,
    password: hashedPassword,
    plot: trimmedPlot,
  });
  saveUsers(users);

  res.redirect("/login?registered=1");
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect("/login?error=Please fill all fields");
  }

  const users = loadUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.redirect("/login?error=Invalid username or password");
  }

  req.session.user = { username: user.username, plot: user.plot };
  res.redirect("/dashboard");
});

// API: current user
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json({
    username: req.session.user.username,
    plot: req.session.user.plot || "—",
  });
});

// Dashboard
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});