import {computed, observable, reaction} from "mobx";

const blankAppJson = {title: "", headline: "", private: false, id: Math.random() * 10};


export class AppStore {
    @observable public app = new App(this);

    public transportLayer: any;

    constructor(transportLayer: any, id: number) {
        this.transportLayer = transportLayer;
        this.loadApp(id);
    }

    public loadApp(id: number) {
        this.transportLayer.getAppById(id).then((appJson: any) => {
            this.app.updateFromJson(appJson);
        });
    }
}

export class App {
    @observable public title: string = "";
    @observable public headline: string = "";
    @observable public private = false;

    public id: number = Math.random() * 10;

    @computed
    get asJson() {
        return {
            title: this.title,
            headline: this.headline,
            private: this.private,
            id: this.id
        };
    }

    private store: AppStore;
    private saveHandler: any;

    constructor(store: AppStore, json: any = blankAppJson) {
        this.store = store;

        this.saveHandler = reaction(
            () => this.asJson,
            appJson => this.store.transportLayer.saveApp(appJson)
        );

        this.updateFromJson(json);
    }

    public updateFromJson(json: any) {
        this.title = json.title;
        this.headline = json.headline;
        this.private = json.private;
        this.id = json.id;
    }
}