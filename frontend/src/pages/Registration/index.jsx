import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import axios from "../../axios"
import {fetchAuthRegister} from "../../redux/slices/auth";
import {Navigate} from "react-router-dom";

export const Registration = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);


    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isValid}
    }
        = useForm({
        defaultValues:
            {
                fullName: 'Yus',
                email: 'test@test.com',
                password: '123456'
            },
        mode: 'onChange'
    });


    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuthRegister(values));
        console.log(data);
        if (!data.payload) {
            return alert('Could not register')
        }
        if ('token' in data.payload) {
            localStorage.setItem('token', data.payload.token)
        }
    }

    if (isAuth) {
        return <Navigate to={'/'}/>
    }

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Создание аккаунта
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.avatar}>
                    <Avatar sx={{width: 100, height: 100}}/>
                </div>
                <TextField className={styles.field}
                           label="Полное имя"
                           error={Boolean(errors.fullName?.message)}
                           helperText={errors.fullName?.message}
                           {...register('fullName', {
                               required: 'Укажите полное имя',
                               minLength: {value: 3, message: "Name should containt at least 3 characters"}
                           })}
                           fullWidth/>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    type="email"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register('email', {
                        required: 'Укажите почту',
                        minLength: {value: 3, message: "Email should containt at least 3 characters"}
                    })}
                    fullWidth
                />
                <TextField className={styles.field}
                           label="Пароль"
                           error={Boolean(errors.password?.message)}
                           helperText={errors.password?.message}
                           {...register('password', {
                               required: 'Напишите пароль',
                               minLength: {value: 6, message: "Password should containt at least 6 characters"}
                           })}
                           fullWidth/>
                <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
