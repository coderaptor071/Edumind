// src/components/ChatWidget.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, ListGroup } from 'react-bootstrap';

const ChatWidget: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    // Create the WebSocket connection
    const socket = new WebSocket('ws://localhost:8000/chat/ws');
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && input.trim() !== '') {
      ws.send(input);
      setInput('');
    }
  };

  return (
    <div className="mb-4">
      <h2>Chat (ELI5 Explanations)</h2>
      <Card>
        <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {messages.map((msg, idx) => (
              <ListGroup.Item key={idx}>{msg}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Form.Group controlId="formChatInput" className="d-flex">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button variant="primary" type="submit" className="ms-2">
                Send
              </Button>
            </Form.Group>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ChatWidget;
