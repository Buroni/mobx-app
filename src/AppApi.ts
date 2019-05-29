export class AppApi {

    // This info would be on the server in the real world.
    public exampleApps = [
        {title: "App 1", headline: "this is app 1", lifecycle: "PUBLIC", id: 0},
        {title: "App 2", headline: "this is app 2", lifecycle: "PUBLIC", id: 1}
    ];

    public getAppById(id: number): Promise<any> {
        return new Promise((resolve) => {
            const app = this.exampleApps.find(exampleApp => exampleApp.id === id);
            setTimeout(() => resolve(app), 500);
        });
    }

    public saveApp(appJson: any): Promise<any> {
        return new Promise((resolve) => {
            const idxToChange = this.exampleApps.map(app => app.id).indexOf(appJson.id);
            setTimeout(() => {
                this.exampleApps[idxToChange] = appJson;
                resolve(true);
            }, 500);
        });
    }
}

export const appApiInstance = new AppApi();