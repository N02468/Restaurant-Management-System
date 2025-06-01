
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Crud from './components/crud';

function App() {

 

  return (
    <>
     

 <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
         <Route path="/crud" element={<Crud />} />
      </Routes>
    </Router>

     
    </>
  );
}

export default App;
