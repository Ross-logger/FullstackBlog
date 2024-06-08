import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios';
import Grid from '@mui/material/Grid';
import { Post } from '../../components/Post';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
import { fetchTags } from '../../redux/slices/articles';

export const ArticlesByTag = () => {
    const { tag } = useParams();
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();
    const tags = useSelector(state => state.articles.tags);
    const userData = useSelector(state => state.auth.data);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`/tags/${tag}`);
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [tag]);

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const isTagsLoading = tags.status === 'loading';

    return (
        <>
            <h1>Articles with Tag: {tag}</h1>
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    {(isLoading ? [...Array(5)] : articles).map((obj, index) => (
                        isLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post
                                key={index}
                                id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                                user={{
                                    avatarUrl: obj.user.avatarUrl,
                                    fullName: obj.user.fullName,
                                }}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.commentsCount || 0}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />
                        )
                    ))}
                </Grid>
                <Grid item xs={4}>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'User One',
                                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'This is a test comment',
                            },
                            {
                                user: {
                                    fullName: 'User Two',
                                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'Another test comment',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
