// src/components/Quiz.tsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Quiz: React.FC = () => {
  const [syllabusId, setSyllabusId] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questionTypes, setQuestionTypes] = useState<string>('MCQs');
  const [quiz, setQuiz] = useState<any>(null);

  const generateQuiz = async () => {
    const formData = new FormData();
    formData.append('syllabus_id', syllabusId);
    formData.append('topic', topic);
    formData.append('difficulty', difficulty);
    formData.append('num_questions', numQuestions.toString());
    formData.append('question_types', questionTypes);

    try {
      const res = await axios.post('http://localhost:8000/quiz/generate', formData);
      setQuiz(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mb-4">
      <h2>Generate Quiz</h2>
      <Form>
        <Form.Group controlId="formSyllabusId" className="mb-3">
          <Form.Label>Syllabus ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter syllabus ID"
            value={syllabusId}
            onChange={(e) => setSyllabusId(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formTopic" className="mb-3">
          <Form.Label>Topic</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDifficulty" className="mb-3">
          <Form.Label>Difficulty</Form.Label>
          <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formNumQuestions" className="mb-3">
          <Form.Label>Number of Questions</Form.Label>
          <Form.Control
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          />
        </Form.Group>
        <Form.Group controlId="formQuestionTypes" className="mb-3">
          <Form.Label>Question Types</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., MCQs, fill-in-blanks, true/false"
            value={questionTypes}
            onChange={(e) => setQuestionTypes(e.target.value)}
          />
        </Form.Group>
        <Button variant="success" onClick={generateQuiz}>
          Generate Quiz
        </Button>
      </Form>
      {quiz && (
        <Alert variant="info" className="mt-3">
          <h5>Quiz Generated:</h5>
          <pre>{JSON.stringify(quiz, null, 2)}</pre>
        </Alert>
      )}
    </div>
  );
};

export default Quiz;
