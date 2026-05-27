import { Router } from 'express';
import { Container } from '../systems/container.core';
import { ApiRouter } from './api.router';

export class IndexRouter {
  router = Router(); 
  constructor(private container: Container) {} // ✅ inject container
  route(){
    ApiRouter(this.router,'/api', this.container);
    return this.router;
  }
}