import { createStore, combineReducers } from 'redux';
import userReducer from '../Redux/reducers/User.reducer';
import sessionReducer from '../Redux/reducers/Session.reducer';

const rootReducer = combineReducers( { user: userReducer, sessions: sessionReducer } );

const configureStore = () => { return createStore(rootReducer) };
export default configureStore;
