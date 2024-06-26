import React from 'react';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import {useSelector, useDispatch} from 'react-redux';
import {logout, selectIsAuth} from "../../redux/slices/auth";

export const Header = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const onClickLogout = () => {
        if (window.confirm("Are you sure to log out?")) {
            dispatch(logout());
            localStorage.removeItem('token');
        }

    }

    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                <div className={styles.inner}>
                    <Link className={styles.logo} to="/">
                        <div>AMIRA BLOG</div>
                    </Link>
                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                <Link to="/articles/create">
                                    <Button variant="contained">Написать статью</Button>
                                </Link>
                                <Button onClick={onClickLogout} variant="contained" color="error">
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outlined">Войти</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="contained">Создать аккаунт</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
