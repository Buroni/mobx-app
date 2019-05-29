import React, {Component} from 'react';
import './App.css';

import {observer} from "mobx-react";
import {AppStore} from "./stores/AppStore";
import {appApiInstance} from "./AppApi";

// Observer components subscribe to the AppStore observable, updating the @observable variables (i.e. store.app)
// whenever a change occurs.

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


// In this component, onChange and onClick are actions which trigger the store to update.
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


const App: React.FC = () => {
  const store = new AppStore(appApiInstance, 0);
  return (
      <div className="App">

        <div className="section">
          <AppViewer store={store}/>
        </div>

        <div style={{marginTop: "5em"}}>
          <AppEditor store={store}/>
        </div>
      </div>
  );
};

export default App;
