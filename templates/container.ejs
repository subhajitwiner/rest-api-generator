import { Container } from "./container.core";
import { TYPES } from "./types";


import { ExampleService } from "../services/example.service";
import { ExampleController } from "../controllers/example.controller";
import { ExampleRepository } from "../repositories/example.repository";

const container = new Container();


// Register dependencies

// Example: Registering a repository
container.register(TYPES.ExampleRepository, () => {
    return new ExampleRepository();
});

// Example: Registering a service with its dependencies
container.register(TYPES.ExampleService, (c) => {
    return new ExampleService(
        c.get(TYPES.ExampleRepository)
    );
});

// Example: Registering a controller with its dependencies
container.register(TYPES.ExampleController, (c) => {
    return new ExampleController(
        c.get(TYPES.ExampleService)
    );
});

export { container };