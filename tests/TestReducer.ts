export default class TestReducer {
  private _reducer: any;
  private _iniState: any;
  private _state: any;

  constructor(reducer, iniState = undefined) {
    this._reducer = reducer;

    this._iniState = this._state = iniState;
  }

  setIniState(iniState) {
    this._iniState = iniState;
  }

  start() {
    this._state = this._iniState;
    return this.dispatchAction({});
  }

  dispatchAction(action) {
    const newState = this._reducer(this._state, action);
    this._state = newState;
    const s = this.dispatchAction.bind(this);
    return s;
  }

  getState() {
    return this._state;
  }
}
