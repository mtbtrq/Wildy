import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Messaging from './components/Messaging';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/messaging" element={<Messaging />} />
            </Routes>
      </Router>
    );
};

export default App;