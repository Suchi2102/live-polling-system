import { Routes, Route } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentPage />} />
      <Route path="/teacher" element={<TeacherPage />} />
    </Routes>
  );
}

export default App;