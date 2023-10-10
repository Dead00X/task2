# task2
Create Users (สร้างผู้ใช้):
ตั้งค่า URL เป็น http://localhost:3000/users/create
ใส่ข้อมูลผู้ใช้ในรูปแบบ JSON
{
  "id": 1,
  "email": "user@example.com",
  "password": "password123",
  "username": "username123",
  "nickname": "Nickname",
  "birthday": "2000-01-01",
  "address": "123 Main St"
}

Get Users (ดึงข้อมูลผู้ใช้ทั้งหมด):
http://localhost:3000/users

Get Users by ID (ดึงข้อมูลผู้ใช้ด้วย ID):
http://localhost:3000/users/{user_id} โดยแทน {user_id}ด้วย ID 

Update Users (อัปเดตข้อมูลผู้ใช้):
http://localhost:3000/users/update

Login (ล็อกอิน):
http://localhost:3000/users/login

Logout (ล็อกเอาท์):
http://localhost:3000/users/logout

Delete Users by ID (ลบผู้ใช้ด้วย ID):
http://localhost:3000/users/delete
