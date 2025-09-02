// src/App.tsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import SyllabusUpload from './components/SyllabusUpload';
import Quiz from './components/Quiz';
import ChatWidget from './components/ChatWidget';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">EduMind AI</h1>
      <SyllabusUpload />
      <Quiz />
      <ChatWidget />
      <Dashboard />
    </Container>
  );
}

export default App;
