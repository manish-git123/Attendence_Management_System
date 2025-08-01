import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter , Route,Routes, Link } from 'react-router-dom';
import StudentFormPage from './StudentFormPage';
import StudentRemovalForm from './StudentRemovePage';
import AttendanceDownload from './AttendanceDownload';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App />
     */}
    <BrowserRouter>
      <Routes>
      <Route exact path="/" element={<App />}></Route>
        <Route exact path="/form" element={<StudentFormPage />}></Route>
        <Route exact path="/remove" element={<StudentRemovalForm />}></Route>
        <Route exact path="/data" element={<AttendanceDownload />}></Route>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

