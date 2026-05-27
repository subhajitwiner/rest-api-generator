export class Container {
    private factories = new Map<any, any>();

    register<T>(token: any, factory: (c: Container) => T) {
        this.factories.set(token, factory);
    }

    get<T>(token: any): T {
        const factory = this.factories.get(token);
        if (!factory) throw new Error(`Dependency not found: ${token.toString()}`);
        return factory(this);
    }
}