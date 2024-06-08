import {configureStore} from '@reduxjs/toolkit';
import {articlesReducer} from "./slices/articles";
import {authReducer} from "./slices/auth";

const store = configureStore({
    reducer: {
        articles: articlesReducer,
        auth: authReducer,
    },
});
export default store;