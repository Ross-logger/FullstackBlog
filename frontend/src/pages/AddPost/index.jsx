import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import {useSelector} from "react-redux";
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate} from "react-router-dom";
import axios from '../../axios'
import {useParams} from "react-router-dom";

export const AddPost = () => {
    const isAuth = useSelector(selectIsAuth);
    const [imageUrl, setImageUrl] = React.useState('')
    const [content, setContent] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [title, setTitle] = React.useState('');
    const inputFileRef = React.useRef();
    const navigate = useNavigate();
    const {id} = useParams();
    const isEditing = Boolean(id);

    React.useEffect( () => {
        if (id) {
             axios.get(`/articles/${id}`)
                .then(res => {
                        console.log(res)
                        setTitle(res.data.title);
                        setContent(res.data.content);
                        setTags(res.data.tags);
                        setImageUrl(res.data.imageUrl);
                    }
                ).catch(error => {
                console.warn(error);
                alert('Error occurred!');
            })
        }
    }, [])

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const {data} = await axios.post('/upload', formData);
            setImageUrl(data.url)
            console.log(data);
        } catch (error) {
            console.warn(error);
            alert('Error sending the file!');
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };


    const onChange = React.useCallback((value) => {
        setContent(value);
    }, []);

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    const onSubmit = async () => {
        try {
            const requestData = {
                'title': title,
                'content': content,
                'tags': tags? tags : [],
                'imageUrl': imageUrl || undefined // Ensure imageUrl is either a valid URL or undefined
            };

            console.log('Submitting data:', requestData);

            const {data} = isEditing
                ? await axios.patch(`/articles/${id}`, requestData)
                : await axios.post('/articles', requestData);

            console.log("Response Data:", data);
            const _id = isEditing ? id : data._id;
            navigate(`/articles/${_id}`);
        } catch (err) {
            console.error('Error:', err);
            if (err.response && err.response.data) {
                console.error('Response Data:', err.response.data);
                alert(`Could not create/update the article! ${err.response.data.message}`);
            } else {
                alert(`An error occurred while processing your request.`);
            }
        }
    };


    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to='/'></Navigate>
    }

    return (
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded"/>
                </>
            )}
            <br/>
            <br/>
            <TextField
                classes={{root: styles.title}}
                variant="standard"
                placeholder="Заголовок статьи..."
                value={title}
                onChange={event => setTitle(event.target.value)}
                fullWidth
            />
            <TextField
                classes={{root: styles.tags}}
                variant="standard"
                placeholder="Тэги"
                value={tags}
                onChange={event => setTags(event.target.value)}
                fullWidth/>
            <SimpleMDE className={styles.editor} value={content} onChange={onChange} options={options}/>
            <div className={styles.buttons}>
                <Button type="button" size="large" variant="contained" onClick={onSubmit}>
                    {isEditing ? 'Отредактировать' : 'Опубликовать'}
                < /Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
