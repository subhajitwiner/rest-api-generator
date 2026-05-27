export class ExampleRepository {
    constructor() { }   
    async getFromRepository() {
        return await {
            name: "test",
            email: "test@gmail.com",
            password: "test123"
        }
    }
}