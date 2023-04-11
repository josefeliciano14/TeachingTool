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
import Sections from './Pages/Sections';
import Section from './Pages/Section';
import Error from './Pages/Error';
import CreateSection from './Pages/CreateSection';
import Instructors from './Pages/Instructors';
import Instructor from './Pages/Instructor';
import AddInstructor from './Pages/AddInstructor';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path='/module/:mid' element={<Module/>}/>
      <Route path='/modules' element={<Modules/>}/>
      <Route path='/create-module' element={<CreateModule/>}/>
      <Route path='/sections' element={<Sections/>}/>
      <Route path='/section/:sid' element={<Section/>}/>
      <Route path='/create-section' element={<CreateSection/>}/>
      <Route path='/instructors' element={<Instructors/>}/>
      <Route path='/add-instructor' element={<AddInstructor/>}/>
      <Route path='/instructor/:iid/:sid' element={<Instructor/>}/>
      <Route path="*" element={<Error/>} />
    </Routes>
  </Router>
);