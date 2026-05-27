import { Router } from 'express';
import { Container } from '../systems/container.core';
import { TYPES } from '../systems/types';
import { ExampleController } from '../controllers/example.controller';


export const ApiRouter = (router: Router, prefix = '', container: Container) => {
    const controller = container.get<ExampleController>(TYPES.ExampleController);
    router.get(prefix + '/welcome', controller.welcome);
};