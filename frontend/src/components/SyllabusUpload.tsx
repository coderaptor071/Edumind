// src/components/SyllabusUpload.tsx
import React, { useState } from 'react';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import axios from 'axios';

const SyllabusUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [syllabusName, setSyllabusName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !syllabusName) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', syllabusName);
    setUploading(true);
    try {
      const res = await axios.post('http://localhost:8000/syllabus/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <h2>Syllabus Upload</h2>
      <Form>
        <Form.Group controlId="formSyllabusName" className="mb-3">
          <Form.Label>Syllabus Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter syllabus name"
            value={syllabusName}
            onChange={(e) => setSyllabusName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload File</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        {uploading && <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />}
        <Button variant="primary" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Syllabus'}
        </Button>
      </Form>
      {result && (
        <Alert variant="success" className="mt-3">
          Syllabus Uploaded Successfully!
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Alert>
      )}
    </div>
  );
};

export default SyllabusUpload;
