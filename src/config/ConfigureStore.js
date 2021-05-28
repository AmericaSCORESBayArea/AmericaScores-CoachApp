import { createStore, combineReducers } from 'redux';
import userReducer from '../Redux/reducers/User.reducer';
import sessionReducer from '../Redux/reducers/Session.reducer';
import sessionScreenReducer from '../Redux/reducers/SessionScreen.reducer';

const rootReducer = combineReducers( { user: userReducer, sessions: sessionReducer, sessionScreen:sessionScreenReducer } );

const configureStore = () => { return createStore(rootReducer) };
export default configureStore;
