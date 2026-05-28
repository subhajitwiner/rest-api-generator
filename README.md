# 🚀 Rest Api Generator (RAG)

**Rest Api Generator (RAG)** is a CLI-based framework that helps developers quickly scaffold and maintain REST APIs using **TypeScript** and **TypeORM**—without manual configuration.

It enforces a clean architecture and eliminates repetitive boilerplate so you can focus on building features.

---

## ✨ Features

* ⚡ Zero-config API setup
* 🧱 Clean architecture (Controller → Service → Repository → Model)
* 🔐 Built-in JWT authentication support
* 🔑 Secure password hashing with bcrypt
* 🗄️ MySQL integration using TypeORM
* 🛠️ CLI-based code generation
* 📦 Modular and scalable structure

---

## 📦 Core Dependencies

* **express** – API framework
* **typeorm** – ORM for database
* **cors** – Cross-origin support
* **jsonwebtoken** – Authentication
* **mysql2** – MySQL driver
* **bcrypt** – Password hashing

---

## ⚙️ Installation

Install globally:

```bash
npm install -g rest-api-generator
```

---

## 🚀 Getting Started

### 🔹 Initialize a New Project

```bash
rag init <project-name>
```

This will:

* Create a new project folder
* Setup TypeScript configuration
* Install dependencies
* Setup base architecture

---

## 🧠 CLI Usage

Main command:

```bash
rag
```

---

## 📁 Code Generation Commands

### 🔹 Create Controller

```bash
rag create controller <name>
```

### 🔹 Create Service

```bash
rag create service <name>
```

### 🔹 Create Repository

```bash
rag create repository <name>
```

### 🔹 Create Model

```bash
rag create model <name>
```

---

## 🏗️ Project Structure

```
src/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── models/
 ├── routes/
 ├── config/
 └── app.ts
```

---

## 🔁 Architecture Flow

```
Controller → Service → Repository → Database
```

* **Controller** → Handles HTTP requests/responses
* **Service** → Business logic
* **Repository** → Database queries
* **Model** → TypeORM entities

---

## 💡 Example Usage

```bash
rag init my-app
cd my-app

rag create controller user
rag create service user
rag create repository user
rag create model user
```

---

## 🧪 Example Code

### 🔹 User Controller

```ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
```

---

### 🔹 User Service

```ts
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers() {
    return await this.userRepository.findAll();
  }
}
```

---

### 🔹 User Repository

```ts
import { AppDataSource } from "../config/data-source";
import { User } from "../models/user.model";

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  async findAll() {
    return await this.repo.find();
  }
}
```

---

### 🔹 User Model

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```

---

## 🎯 Goal

* Reduce setup time
* Enforce scalable architecture
* Improve development speed
* Maintain consistency across projects

---

## 🛣️ Roadmap

* ✅ Project initialization (`rag init`)
* ⏳ Middleware generator
* ⏳ DTO & validation support
* ⏳ Swagger/OpenAPI integration
* ⏳ Role-based authentication

---

## 🤝 Contributing

Feel free to fork the repository and submit pull requests.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built to simplify backend API development using TypeScript and TypeORM.
