"""
AI-powered career analysis service for resume evaluation and career recommendations.
"""
import json
import base64
import requests
import fitz  # PyMuPDF
from typing import Dict, List, Any
from django.conf import settings
from openai import OpenAI


class PDFParser:
    """Service to download and parse PDF resumes from Cloudinary."""
    
    @staticmethod
    def download_and_convert_to_images(url: str, max_pages: int = 3) -> List[str]:
        """
        Download PDF from Cloudinary URL and convert pages to base64 images for GPT-4o vision.
        
        Args:
            url: Cloudinary URL of the PDF resume
            max_pages: Maximum number of pages to process (default 3 for cost control)
            
        Returns:
            List of base64-encoded images (one per page)
            
        Raises:
            Exception: If download or conversion fails
        """
        try:
            # Download PDF from Cloudinary
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Open PDF with PyMuPDF
            pdf_document = fitz.open(stream=response.content, filetype="pdf")
            base64_images = []
            
            # Convert each page to image (PNG format)
            pages_to_process = min(pdf_document.page_count, max_pages)
            
            for page_num in range(pages_to_process):
                page = pdf_document[page_num]
                
                # Render page to image (higher DPI for better quality)
                pix = page.get_pixmap(dpi=150)
                
                # Convert to PNG bytes
                img_bytes = pix.tobytes("png")
                
                # Encode to base64
                base64_image = base64.b64encode(img_bytes).decode('utf-8')
                base64_images.append(base64_image)
            
            pdf_document.close()
            
            return base64_images
            
        except requests.RequestException as e:
            raise Exception(f"Failed to download PDF from Cloudinary: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to convert PDF to images: {str(e)}")


class CareerAnalyzer:
    """AI-powered career analysis using OpenAI GPT-4o with vision."""
    
    def __init__(self):
        """Initialize OpenAI client with API key from settings."""
        api_key = getattr(settings, 'OPENAI_API_KEY', None)
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in settings")
        self.client = OpenAI(api_key=api_key)
        # Use gpt-4o by default (cheaper and supports vision)
        self.model = getattr(settings, 'OPENAI_MODEL', 'gpt-4o')
    
    def analyze_career_path(
        self,
        quiz_data: Dict[str, str],
        work_history: List[Dict[str, Any]],
        resume_images: List[str]
    ) -> Dict[str, Any]:
        """
        Analyze user data and resume images to provide career recommendations.
        
        Args:
            quiz_data: User's quiz responses (interests, work environment, etc.)
            work_history: List of work history entries
            resume_images: List of base64-encoded resume page images
            
        Returns:
            Structured career analysis with resume score and recommendations
        """
        # Build the analysis prompt
        prompt = self._build_analysis_prompt(quiz_data, work_history)
        
        try:
            # Build messages with resume images
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are an expert career counselor and resume analyst. "
                        "Analyze the provided resume images along with quiz data and work history. "
                        "Return ONLY a valid JSON response with resume analysis and career recommendations. "
                        "Do not include any explanatory text outside the JSON."
                    )
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
            
            # Add each resume page image to the message
            for base64_image in resume_images:
                messages[1]["content"].append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}",
                        "detail": "high"  # High detail for better text recognition
                    }
                })
            
            # Call OpenAI API with vision
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=2500,
                response_format={"type": "json_object"}
            )
            
            # Parse the response
            result = json.loads(response.choices[0].message.content)
            
            # Validate and structure the response
            return self._structure_response(result)
            
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def _build_analysis_prompt(
        self,
        quiz_data: Dict[str, str],
        work_history: List[Dict[str, Any]]
    ) -> str:
        """Build the analysis prompt for OpenAI (resume content comes from vision)."""
        work_history_summary = "\n".join([
            f"- {item.get('job_title', 'N/A')} at {item.get('company_name', 'N/A')} "
            f"({item.get('start_date', 'N/A')} to {item.get('end_date', 'Present')}): "
            f"{item.get('responsibilities', 'N/A')}"
            for item in work_history
        ])
        
        has_work_history = len(work_history) > 0
        
        prompt = f"""
Analyze the resume images provided along with the following user data and provide career recommendations:

**Quiz Responses:**
- Interests: {quiz_data.get('interests', 'N/A')}
- Preferred Work Environment: {quiz_data.get('work_environment', 'N/A')}
- Training Flexibility: {quiz_data.get('training_flexibility', 'N/A')}
- Key Strengths: {quiz_data.get('strengths', 'N/A')}
- Job Priorities: {quiz_data.get('job_priorities', 'N/A')}
- Location Preference: {quiz_data.get('location', 'N/A')}

**Work History (User-Provided - Already Verified):**
{work_history_summary if has_work_history else "No work history provided"}

IMPORTANT: The work history above is user-provided and verified. When assessing resume completeness:
- If work history is provided above, mark "work_experience" as "complete"
- The resume images may supplement this information but should not override it

**Resume Images Analysis:**
Please analyze the resume images to extract ADDITIONAL information including:
- Personal information (name, contact details) - mark "personal_info" as complete/incomplete based on what you see
- Education (degrees, institutions, dates) - mark "education" as complete/incomplete based on what you see
- Skills (technical, soft skills, certifications) - mark "skills" as complete/incomplete based on what you see
- Any additional work experience details not already covered above

**Instructions:**
Provide a JSON response with the following structure:

{{
  "resume_analysis": {{
    "completeness_score": <integer 0-100>,
    "section_status": {{
      "personal_info": "<complete|incomplete>",
      "education": "<complete|incomplete>",
      "work_experience": "<complete|incomplete>",
      "skills": "<complete|incomplete>"
    }},
    "suggestions": [
      "<actionable suggestion 1>",
      "<actionable suggestion 2>",
      "<actionable suggestion 3>"
    ]
  }},
  "career_recommendations": [
    {{
      "title": "<career path title>",
      "description": "<brief description>",
      "training_duration": "<e.g., '3-6 months', 'Less than 3 months'>",
      "match_type": "primary"
    }},
    {{
      "title": "<alternative career path>",
      "description": "<brief description>",
      "training_duration": "<duration>",
      "match_type": "alternative"
    }}
  ]
}}

**Guidelines:**
1. Completeness score should reflect how complete the resume is (personal info, education, work experience, skills)
2. Provide 3-5 actionable suggestions to improve the resume
3. Recommend 3-5 career paths based on quiz responses, work history, and resume
4. Mark the top match as "primary" and others as "alternative"
5. Training duration should align with their stated training flexibility
6. Consider their job priorities (salary, work-life balance, etc.) in recommendations
"""
        return prompt
    
    def _structure_response(self, ai_response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and structure the AI response to ensure it matches expected format.
        
        Args:
            ai_response: Raw response from OpenAI
            
        Returns:
            Validated and structured response
        """
        # Ensure required keys exist
        if 'resume_analysis' not in ai_response:
            ai_response['resume_analysis'] = {
                'completeness_score': 50,
                'section_status': {
                    'personal_info': 'incomplete',
                    'education': 'incomplete',
                    'work_experience': 'incomplete',
                    'skills': 'incomplete'
                },
                'suggestions': ['Complete all resume sections for better analysis']
            }
        
        if 'career_recommendations' not in ai_response:
            ai_response['career_recommendations'] = []
        
        # Ensure completeness_score is an integer
        resume_analysis = ai_response['resume_analysis']
        if 'completeness_score' in resume_analysis:
            resume_analysis['completeness_score'] = int(resume_analysis['completeness_score'])
        
        # Ensure at least one primary recommendation exists
        has_primary = any(
            rec.get('match_type') == 'primary'
            for rec in ai_response['career_recommendations']
        )
        
        if not has_primary and ai_response['career_recommendations']:
            ai_response['career_recommendations'][0]['match_type'] = 'primary'
        
        return ai_response


# Main service interface
def analyze_career_data(
    quiz_data: Dict[str, str],
    work_history: List[Dict[str, Any]],
    pdf_url: str
) -> Dict[str, Any]:
    """
    Main function to analyze career data and provide recommendations.
    
    Args:
        quiz_data: User's quiz responses
        work_history: User's work history
        pdf_url: Cloudinary URL of the PDF resume
        
    Returns:
        Structured analysis with resume score and career recommendations
        
    Raises:
        Exception: If any step of the analysis fails
    """
    # Step 1: Download and convert PDF to images
    pdf_parser = PDFParser()
    resume_images = pdf_parser.download_and_convert_to_images(pdf_url)
    
    # Step 2: Analyze with GPT-4o vision
    analyzer = CareerAnalyzer()
    analysis_result = analyzer.analyze_career_path(quiz_data, work_history, resume_images)
    
    return analysis_result

