const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

const BLOGS_FILE = path.join(__dirname, "blogs.json");
const USERS_FILE = path.join(__dirname, "users.json");

let users = [{ username: "noname", name: "No Name", password: "yesman" }];

try {
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } else {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
} catch (error) {
  console.error("Error loading users:", error);
}

let blogs = [];
try {
  if (fs.existsSync(BLOGS_FILE)) {
    const data = fs.readFileSync(BLOGS_FILE, "utf8");
    blogs = JSON.parse(data);
  } else {
    blogs = [
      {
        id: 1,
        title: "this is a blog post yup defineadly true dont doubt it its true",
        author: "Onni Hölttä",
        url: "https://github.com/Juoksumatto/Fullstack-5",
        likes: 72376,
        userId: "noname",
      },
      {
        id: 2,
        title: "Now this is not a blog post I think",
        author: "Onni Hölttä",
        url: "https://github.com/Juoksumatto/Fullstack-5",
        likes: 23,
        userId: "noname",
      },
    ];
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
  }
} catch (error) {
  console.error("Error loading blogs:", error);
  blogs = [
    {
      id: 1,
      title: "this is a blog post yup defineadly true dont doubt it its true",
      author: "Onni Hölttä",
      url: "https://github.com/Juoksumatto/Fullstack-5",
      likes: 72376,
      userId: "noname",
    },
    {
      id: 2,
      title: "Now this is not a blog post I think",
      author: "Onni Hölttä",
      url: "https://github.com/Juoksumatto/Fullstack-5",
      likes: 23,
      userId: "noname",
    },
  ];
}

const saveBlogs = () => {
  try {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
  } catch (error) {
    console.error("Error saving blogs:", error);
  }
};

const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

app.post("/api/users", (req, res) => {
  const { username, name, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "username already exists" });
  }
  if (!name || !username || !password) {
    return res.status(400).json({ error: "name, username, and password are required" });
  }
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "username already exists" });
  }
  const newUser = { username, name, password };
  users.push(newUser);
  saveUsers();
  res.status(201).json(newUser);
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  let user = users.find((u) => u.username === username);

  if (!user) {
    user = { username, name: username, password };
    users.push(user);
    saveUsers();
  } else {
    if (user.password !== password) {
      return res.status(401).json({ error: "invalid username or password" });
    }
  }

  const token = `token_${username}_${Date.now()}`;

  res.json({
    token,
    username: user.username,
    name: user.name,
  });
});

app.post("/api/testing/reset", (req, res) => {
  blogs = [];
  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
  res.status(204).end();
});

app.put("/api/blogs/:id", (req, res) => {
  const id = Number(req.params.id);
  const { likes } = req.body;

  const blog = blogs.find((b) => b.id === id);
  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }

  blog.likes = likes;
  saveBlogs();
  res.json(blog);
});

app.delete("/api/blogs/:id", (req, res) => {
  const id = Number(req.params.id);
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const token = authorization.substring(7);
  const username = token.slice(6, token.lastIndexOf("_"));
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }

  const blog = blogs.find((b) => b.id === id);
  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }

  if (blog.userId !== user.username) {
    return res
      .status(403)
      .json({ error: "only the creator can delete this blog" });
  }

  const index = blogs.findIndex((b) => b.id === id);
  blogs.splice(index, 1);
  saveBlogs();
  res.status(204).end();
});

app.get("/api/blogs", (req, res) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  res.json(sortedBlogs);
});


app.post("/api/blogs", (req, res) => {
  const { title, author, url } = req.body;
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const token = authorization.substring(7);
  const username = token.slice(6, token.lastIndexOf("_"));
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }

  const newBlog = {
    id: blogs.length > 0 ? Math.max(...blogs.map((b) => b.id)) + 1 : 1,
    title,
    author,
    url,
    likes: 0,
    userId: user.username,
    user: { name: user.name, username: user.username },
  };

  blogs.push(newBlog);
  saveBlogs();
  res.status(201).json(newBlog);
});

app.get("/api/Users", (req, res) => {
  const usersWithBlogCount = users.map((user) => ({
    ...user,
    blogs: blogs.filter((blog) => blog.userId === user.username).length,
  }));
  const sortedUsers = usersWithBlogCount.sort((a, b) => b.blogs - a.blogs);
  res.json(sortedUsers);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
