# Resumy

Resumy is a full-stack web application for resume analysis and resume building. It leverages AI to analyze resumes against job descriptions and provides users with customizable resume templates.

## Features

- **Resume Analyzer:** Upload your resume (PDF) and a job description to receive an AI-powered analysis, including match percentage, key skills, experience relevance, missing qualifications, and suggestions for improvement.
- **Resume Builder:** Create and customize resumes using modern, professional templates. Add, remove, or edit fields as needed.
- **Frontend:** Built with React, Tailwind CSS, and Vite for a fast and responsive user experience.
- **Backend:** Powered by FastAPI and Google Gemini AI for PDF parsing, OCR, and resume analysis.

## Project Structure

```
resumy/
├── resumy_backend/
│   ├── main.py                # FastAPI backend for resume analysis
│   └── requriments.txt        # Backend dependencies
├── resumy_frontend/
│   ├── src/
│   │   ├── pages/             # Main pages (Home, Resume, ResumePreview)
│   │   ├── components/        # UI components and resume templates
│   │   └── ...
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend)

### Backend Setup
1. Navigate to the backend folder:
   ```powershell
   cd resumy_backend
   ```
2. Install dependencies:
   ```powershell
   pip install -r requriments.txt
   ```
3. Set your Google Gemini API key as an environment variable:
   ```powershell
   $env:GEMINI_API_KEY = "your-gemini-api-key"
   ```
4. Start the FastAPI server:
   ```powershell
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```powershell
   cd resumy_frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

### Usage
- Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).
- Use the Resume Analyzer to upload your resume and a job description for instant feedback.
- Use the Resume Builder to create and customize your resume with different templates.

## Technologies Used
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** FastAPI, PyMuPDF, Pillow, Google Generative AI, Python-Multipart

## License
This project is for educational purposes.
