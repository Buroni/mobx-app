## Overview

This example is split up into 4 parts: 
* The app store `AppStore`, which stores the `App` object and provides a method to change the current instance of the app.
* The class which generates the `App` object. This contains several `observable` properties such as title, headline, private. By setting these properties to be observable, we allow them to be updated programmatically whenever an `observer` component changes one of the properties.
* A fake `AppApi` class which stores and loads/saves app objects.
* The actual view component `App.tsx` which contain several `observer` components, allowing the `App` to be easily viewed and manipulated.

## AppStore
The `AppStore` contains one `observable` variable, `app`. It also contains a `transportLayer`, which is just an instance of the API class we'll be using to load and save apps to/from the back-end.
```javascript
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
```

## App
The `App` class itself contains some observable properties (title, headline, private, id). These are the properties the user will see and change, so we want them to be part of the mobx action -> state -> reaction lifecycle.

This class also contains one `computed` value, and one `reaction`. These two concepts are similar, in that they are automatically triggered by state changes. However the difference is that a `computed` value is generally a pure function which returns a value, whereas a `reaction` is a side effect. For example in the code below, the computed value `asJson` returns a json-serialised object, whereas the reaction `saveHandler` automatically saves changes to the API in response to state change.

This is also a good time to mention that the `App` class is responsible for (de)serialisation. When a new app is loaded using the method in `AppStore`, the app object itself deserialises the json object from the back-end using its `updateFromJson` method. Inversely, when the save reaction is triggered the `App` object data is piped through its own `asJson` value.

```javascript
export class App {
    @observable public title: string = "";
    @observable public headline: string = "";
    @observable public private = false;
    @observable public id: number = Math.random() * 10;

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

    constructor(store: any, json: any = blankAppJson) {
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
```

## App.tsx

This is the view component which renders the `App` and allows the object to be updated by the user. 

The `AppEditor` component below is an `@observer` component, which means that it subscribes to the `@observable` properties in the store and is able to trigger state changes. There are two actions, `onChange` and `onClick` which trigger state changes in `AppStore`. Note that simply changing a property in `store.app` is enough to trigger this change in the app store.

```javascript
@observer
class AppEditor extends Component<{store: AppStore}> {
  public render() {
    const { app } = this.props.store;
    return <div>
            Title: <input type={"text"} value={app.title} onChange={(e) => app.title = e.target.value}/>
            <br />
            <input type={"checkbox"} id={"vis"} onClick={() => app.private = !app.private}/> Public
          </div>;
  }
}
```

The `AppViewer` component simply renders the current state of the app object, re-rendering  the view when state changes occur.

```javascript
@observer
class AppViewer extends Component<{store: AppStore}> {
  public render() {
    const { app } = this.props.store;

    return <div>
        <h3>{app.title} ({app.private ? "PRIVATE" : "PUBLIC"})</h3>
        <p>
          {app.headline}
        </p>
    </div>
  }
}
```

## Notes

The store normally wouldn't be initiated in the App and passed through as props everywhere. Different stores will usually be unified into one `RootStore` which is accessed via context.

## Further info

This example is based on the mobxjs best practices article https://mobx.js.org/best/store.html

mobx github: https://github.com/mobxjs/mobx
