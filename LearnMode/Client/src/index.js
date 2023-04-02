import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Styles/index.scss'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home';
import Modules from './Pages/Modules';
import CreateModule from './Pages/CreateModule';
import Module from './Pages/Module';
import Error from './Pages/Error';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path='/module/:id' element={<Module/>}/>
      <Route path='/modules' element={<Modules/>}/>
      <Route path='/create-module' element={<CreateModule/>}/>
      <Route path="*" element={<Error/>} />
    </Routes>
  </Router>
);