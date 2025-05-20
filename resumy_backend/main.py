from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import google.generativeai as genai
from PIL import Image
import tempfile
import os
import shutil
import io
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
generation_config = {
  "temperature": 0
}
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config
)

def convert_pdf_to_images(pdf_content):
    """Convert PDF content to images"""
    temp_dir = tempfile.mkdtemp()
    image_paths = []
    
    # Create PDF document from bytes
    doc = fitz.open(stream=pdf_content, filetype="pdf")
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        matrix = fitz.Matrix(10, 10)  # Higher quality
        pix = page.get_pixmap(matrix=matrix)
        
        output_path = os.path.join(temp_dir, f'page_{page_num + 1}.png')
        pix.save(output_path)
        image_paths.append(output_path)
    
    doc.close()
    return temp_dir, image_paths

def extract_text_from_images(image_paths):
    """Extract text from images using Gemini API"""
    all_text = ""
    
    for img_path in image_paths:
        image = Image.open(img_path)
        prompt = "Extract all the text from this resume image"
        response = model.generate_content([image, prompt])
        all_text += response.text + "\n\n"
    
    return all_text

def analyze_resume(resume_text, job_description):
    """Analyze resume against job description using Gemini API"""
    analysis_prompt = f"""
    You are an experienced Technical Human Resource Manager, your task is to review the provided resume against the job description. 
    Please share your professional evaluation on whether the candidate's profile aligns with the role.

    You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, 
    your task is to evaluate the resume against the provided job description. Give me the percentage of match if the resume matches
    the job description.

    Be very strict and give a detailed analysis.

    Given this resume text and job description, provide an analysis:
    
    Resume: {resume_text}
    
    Job Description: {job_description}
    
    Please analyze:
    1. Give a percentage score of how well the resume matches the job description.
    2. Key skills match
    3. Experience relevance
    4. Missing qualifications
    5. Suggestions for improvement

    Answer in JSON format:
    The structure of the JSON is as follows:

    - overall_match_percentage: String
    - key_skills_match: String
    - experience_relevance: String
    - missing_qualifications: String
    - suggestions_for_improvement: String

    Keep the response short and in plain text.
    """
    
    response = model.generate_content(analysis_prompt)
    return response.text

@app.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Read the PDF content
        pdf_content = await file.read()
        
        # Convert PDF to images
        temp_dir, image_paths = convert_pdf_to_images(pdf_content)
        
        try:
            # Extract text from images
            resume_text = extract_text_from_images(image_paths)
            
            # Analyze resume
            analysis = analyze_resume(resume_text, job_description)
            
            return {
                "status": "success",
                "extracted_text": resume_text,
                "analysis": analysis[8:-4]
            }
            
        finally:
            # Cleanup temporary files
            shutil.rmtree(temp_dir)
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Something went wrong: {str(e)}"}
        )