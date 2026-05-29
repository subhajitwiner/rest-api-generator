# 🚀 Rest API Generator (RAG)

**Rest API Generator (RAG)** is a CLI-based framework that helps developers scaffold and maintain REST APIs using **TypeScript**, **Express**, and **TypeORM** with a clean, scalable project structure.

It reduces repetitive setup work and gives you a ready-to-use architecture for building APIs faster.

## ✨ Features

- ⚡ Zero-config project scaffolding
- 🧱 Clean architecture: **Controller → Service → Repository → Database**
- 🔌 Dependency Injection support with **Awilix**
- 🧰 Modular router structure for large applications
- 🗄️ MySQL integration using TypeORM
- 🔐 JWT authentication support
- 🔑 Password hashing with bcrypt
- 🛠️ CLI-based code generation
- 📦 Scalable folder structure for real-world projects

## 📦 Core Dependencies

- **express** — HTTP API framework
- **typeorm** — ORM for database access
- **mysql2** — MySQL driver
- **cors** — Cross-origin support
- **body-parser** — JSON/body parsing
- **compression** — Response compression
- **dotenv** — Environment variable loading
- **jsonwebtoken** — JWT authentication
- **bcrypt** — Password hashing
- **awilix** — Dependency injection container
- **awilix-express** — Express integration for DI
- **reflect-metadata** — Required by TypeORM patterns
- **ts-node**, **typescript**, **nodemon** — Development tooling

## ⚙️ Installation

Install the CLI globally:

```bash
npm install -g typescript-rest-api-generator
```

## 🚀 Getting Started

Create a new project:

```bash
rag create new <project-name>
```

This will:

- create a new project folder
- generate the TypeScript setup
- install dependencies
- create the base architecture
- add the starter files for controllers, services, repositories, routes, systems, and database setup

## 🧠 CLI Usage

Main command:

```bash
rag
```

## 📁 Code Generation Commands

Create a controller:

```bash
rag create controller <name>
```

Create a service:

```bash
rag create service <name>
```

Create a repository:

```bash
rag create repository <name>
```

Create a model:

```bash
rag create model <name>
```

## 🏗️ Project Structure

```txt
src/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── models/
 ├── router/
 ├── database/
 ├── systems/
 └── index.ts
```

### Folder purpose

- **controllers** — Handle HTTP requests and responses
- **services** — Hold business logic
- **repositories** — Handle database/data access logic
- **models** — TypeORM entity classes
- **router** — Route grouping and route registration
- **database** — TypeORM connection and entity registration
- **systems** — DI container setup and shared system files
- **index.ts** — Application bootstrap entry point

## 🔁 Architecture Flow

```txt
Router → Controller → Service → Repository → Database
```

### Dependency Injection flow

```txt
systems/container.ts
    ↓
router/*.ts
    ↓
controller
    ↓
service
    ↓
repository
    ↓
database
```

The framework supports DI across layers:

- **Repository** can be injected into **Service**
- **Service** can be injected into **Controller**
- The container is created inside `src/systems`
- The container is passed to the router layer
- Routers resolve controllers through Awilix and `awilix-express`

## 🔌 Dependency Injection Setup

This project supports dependency injection using **Awilix** and **awilix-express**.

### Example repository

```ts
export class ExampleRepository {
    async getFromRepository() {
        return {
            name: "test",
            email: "test@gmail.com",
            password: "test123"
        };
    }
}
```

### Example service

```ts
import { ExampleRepository } from "../repositories/example.repository";

export class ExampleService {
    private readonly repository: ExampleRepository;

    constructor({ exampleRepository }: { exampleRepository: ExampleRepository }) {
        this.repository = exampleRepository;
    }

    async ReturnFromService() {
        return await this.repository.getFromRepository();
    }
}
```

### Example controller

```ts
import { Request, Response } from "express";
import { ExampleService } from "../services/example.service";

export class ExampleController {
    private readonly exampleService: ExampleService;

    constructor({ exampleService }: { exampleService: ExampleService }) {
        this.exampleService = exampleService;
    }

    welcome = async (req: Request, res: Response) => {
        const info = await this.exampleService.ReturnFromService();
        res.status(200).json({ data: info });
    };
}
```

### Container registration

```ts
import { createContainer, asClass } from "awilix";
import { ExampleRepository } from "../repositories/example.repository";
import { ExampleService } from "../services/example.service";
import { ExampleController } from "../controllers/example.controller";

const container = createContainer();

container.register({
    exampleRepository: asClass(ExampleRepository).scoped(),
    exampleService: asClass(ExampleService).scoped(),
    exampleController: asClass(ExampleController).scoped(),
});

export { container };
```

### Router usage

```ts
import { makeInvoker } from "awilix-express";
import { Router } from "express";
import { ExampleController } from "../controllers/example.controller";

const controller = makeInvoker(ExampleController);

export const ApiRouter = (router: Router, prefix = "") => {
    router.get(prefix + "/welcome", controller("welcome"));
};
```

## 🌐 Request Flow

Example request lifecycle:

```txt
Request
 → Router
 → Controller
 → Service
 → Repository
 → Database
 → Response
```

## 🗄️ Database Setup

The project uses TypeORM with MySQL.

### Included database files

- `src/database/typeORM.ts` — creates and initializes the TypeORM DataSource
- `src/database/model.array.ts` — registers entities
- `src/models/*.ts` — entity classes

### Example entity

```ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExampleTable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;
}
```

## 🚀 Application Entry Point

The app starts from `src/index.ts`:

- creates the Express app
- enables middleware
- attaches routers
- starts the HTTP server

### Typical startup flow

```ts
import express from "express";
import { IndexRouter } from "./router";
import { container } from "./systems/container";

const app = express();
const indexRouter = new IndexRouter(container);

app.use("/", indexRouter.route());
```

## 🧪 Example Usage

```bash
rag create new my-app
cd my-app

rag create controller user
rag create service user
rag create repository user
rag create model user
```

## 🛠️ Development Scripts

```bash
npm start   # Start the development server
npm run build
```

## 🎯 Goal

- Reduce setup time
- Enforce scalable architecture
- Improve development speed
- Maintain consistency across projects
- Support dependency injection in large applications

## 🛣️ Roadmap

- ✅ Project initialization (`rag create new`)
- ✅ Controller/service/repository/model generation
- ✅ Dependency injection support
- ✅ Modular router support
- ⏳ Middleware generator
- ⏳ DTO and validation support
- ⏳ Swagger/OpenAPI integration
- ⏳ Role-based authentication
- ⏳ Automatic module discovery

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit a pull request.

## 📄 License

MIT License

## 👨‍💻 Author

Built to simplify backend API development using TypeScript and TypeORM.
