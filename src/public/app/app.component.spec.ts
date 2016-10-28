import {App} from "./app.component";

describe('AppComponent', () => {
    beforeEach(() => {
        this.app = new App();
    });

    it('should have a property', () => {
        expect(this.app.testValue).toBe("test");
    });
});