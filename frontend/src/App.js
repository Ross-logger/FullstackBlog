import React from "react";
import Container from "@mui/material/Container";
import {Routes, Route} from 'react-router-dom';
import {Header} from "./components";
import {Home, FullPost, Registration, AddPost, Login, ArticlesByTag} from "./pages";
import {useDispatch} from "react-redux";
import {fetchAuthMe} from "./redux/slices/auth";

function App() {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchAuthMe());
    }, [])
    return (
        <>
            <Header/>
            <Container maxWidth="lg">
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/articles/:id' element={<FullPost/>}/>
                    <Route path='/articles/create' element={<AddPost/>}/>
                    <Route path='/articles/edit/:id' element={<AddPost/>}/>
                    <Route path="/tags/:tag" element={<ArticlesByTag/>} />
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Registration/>}/>
                </Routes>
            </Container>
        </>
    );
}

export default App;
