const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const database = "my_database";

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const { MongoClient } = require("mongodb");
const uri = "mongodb://your_username:password@mongodb:27017";

// การเปิดฐานข้อมูล MongoDB

app.post("/users/create", async (req, res) => {
  const user = req.body;

  // ตรวจสอบความครบถ้วนของข้อมูลผู้ใช้
  if (!user.id && !user.email && !user.password && !user.username) {
    res.status(400).send({
      status: "error",
      message: "Incomplete user data",
    });
    return;
  }

  // ตรวจสอบความครบถ้วนของข้อมูลผู้ใช้อีกครั้ง
  if (user.id == null || user.email == null || user.password == null || user.username == null) {
    res.status(400).send({
      status: "error",
      message: "Incomplete user data",
    });
    return;
  }

  // ตรวจสอบรูปแบบอีเมลที่ถูกต้อง
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(user.email)) {
    res.status(400).send({
      status: "error",
      message: "Invalid email format",
    });
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();

  // ค้นหาผู้ใช้ที่มี ID ในฐานข้อมูล
  const existingUser = await client.db("database").collection("users").findOne({ id: parseInt(user.id) });

  if (existingUser) {
    res.status(400).send({
      status: "error",
      message: "User with the same ID already exists",
    });
    client.close();
    return;
  }

  // เพิ่มข้อมูลผู้ใช้ใหม่ลงในฐานข้อมูล
  await client.db("database").collection("users").insertOne({
    id: parseInt(user.id),
    email: user.email,
    password: user.password,
    username: user.username,
    nickname: user.nickname,
    birthday: user.birthday,
    address: user.address,
  });

  await client.close();

  res.status(200).send({
    status: "ok",
    message: "User with ID = " + user.id + " is created",
    user: user,
  });
});

// ดึงข้อมูลผู้ใช้ทั้งหมด
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();

  const users = await client.db("database").collection("users").find({}).toArray();

  await client.close();

  res.status(200).send({ status: "ok", users });
});

// ดึงข้อมูลผู้ใช้ด้วย ID
app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // ตรวจสอบความถูกต้องของ ID
  if (isNaN(id)) {
    res.status(400).send({
      status: "error",
      message: "Invalid user ID",
    });
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();

  // ค้นหาผู้ใช้โดยใช้ ID
  const user = await client.db("database").collection("users").findOne({ id: id });

  if (!user) {
    res.status(404).send({
      status: "error",
      message: "User not found",
    });
    return;
  }

  await client.close();

  res.status(200).send({
    status: "ok",
    user: user,
  });
});

// อัปเดตข้อมูลผู้ใช้
app.put("/users/update", async (req, res) => {
  const user = req.body;
  const id = parseInt(user.id);

  // ตรวจสอบความครบถ้วนของข้อมูล
  if (!user.id) {
    res.status(400).send({
      status: "error",
      message: "Please enter ID",
    });
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();

  // อัปเดตข้อมูลผู้ใช้
  await client.db("database").collection("users").updateOne(
    { id: id },
    {
      $set: {
        id: parseInt(user.id),
        email: user.email,
        password: user.password,
        username: user.username,
        nickname: user.nickname,
        birthday: user.birthday,
        address: user.address,
      },
    }
  );

  await client.close();

  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is updated",
    user: user,
  });
});

// ล็อกอิน
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  // ตรวจสอบความครบถ้วนของข้อมูล
  if (!user.email && !user.password) {
    res.status(400).send({
      status: "error",
      message: "Incomplete user data",
    });
    return;
  } else if (!user.email && user.password) {
    res.status(400).send({
      status: "error",
      message: "Please enter email",
    });
    return;
  } else if (user.email && !user.password) {
    res.status(400).send({
      status: "error",
      message: "Please enter password",
    });
    return;
  }

  // ตรวจสอบรูปแบบอีเมล
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0.9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(user.email)) {
    res.status(400).send({
      status: "error",
      message: "Invalid email format",
    });
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();

  // ค้นหาผู้ใช้ที่ตรงกับอีเมลและรหัสผ่าน
  const user = await client.db("database").collection("users").findOne({ email: email, password: password });

  await client.close();

  if (user) {
    res.status(200).send({
      status: "ok",
      message: "Login successful",
      user: user,
    });
  } else {
    res.status(401).send({
      status: "error",
      message: "Login failed",
    });
  }
});

// ล็อกเอาต์
app.post("/users/logout", async (req, res) => {
  res.status(200).send({
    status: "ok",
    message: "Logout successful",
  });
});

// ลบผู้ใช้
app.delete("/users/delete", async (req, res) => {
  const id = parseInt(req.body.id);

  // ตรวจสอบความถูกต้องของ ID
  if (!id || isNaN(id)) {
    res.status(400).send({
      status: "error",
      message: "Please provide a valid ID to delete a user",
    });
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();

  // ค้นหาผู้ใช้โดยใช้ ID
  const existingUser = await client.db("database").collection("users").findOne({ id: id });

  if (!existingUser) {
    res.status(404).send({
      status: "error",
      message: "User with ID = " + id + " not found",
    });
    return;
  }
// ลบผู้ใช้
  await client.db("database").collection("users").deleteOne({ id: id });

  await client.close();

  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is deleted",
  });
});
