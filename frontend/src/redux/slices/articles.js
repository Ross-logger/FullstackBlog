import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from '../../axios';

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
    const {data} = await axios.get('/articles')
    return data;
})

export const fetchTags = createAsyncThunk('articles/fetchTags', async () => {
    const {data} = await axios.get('/tags');
    return data;
})

export const fetchDeleteArticle = createAsyncThunk('articles/fetchDeleteArticle', async (id) => {
        await axios.delete(`/articles/${id}`);
    }
)

const initialState = {
    articles: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

const articlesSlice = createSlice({
        name: 'articles',
        initialState,
        reducer: {},
        extraReducers: {
            [fetchArticles.pending]: (state, action) => {
                state.articles.items = [];
                state.articles.status = 'loading';
            },
            [fetchArticles.fulfilled]: (state, action) => {
                state.articles.items = action.payload;
                state.articles.status = 'loaded';
            },
            [fetchArticles.rejected]: (state) => {
                state.articles.items = [];
                state.articles.status = 'error';
            },
            [fetchTags.pending]: (state, action) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            },
            [fetchTags.fulfilled]: (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            },
            [fetchTags.rejected]: (state) => {
                state.tags.items = [];
                state.tags.status = 'error';
            },
            [fetchDeleteArticle.pending]: (state, action) => {
                console.log(action)
                state.articles.items = state.articles.items.filter(article => article._id !== action.meta.arg);
                state.tags.status = 'loaded';
            }
        }
    }
);

export const articlesReducer = articlesSlice.reducer;