"""
AI-powered career analysis service for resume evaluation and career recommendations.
"""
import json
import re
import requests
import fitz  # PyMuPDF
from typing import Dict, List, Any
from django.conf import settings
from openai import OpenAI


class PDFParser:
    """Production-grade PDF text extraction service using PyMuPDF."""
    
    @staticmethod
    def download_and_extract_text(url: str, max_pages: int = 5) -> str:
        """
        Download PDF from Cloudinary and extract text with advanced cleaning.
        
        Industry best practices:
        - Uses PyMuPDF (fitz) - fastest and most accurate Python PDF library
        - Preserves layout with proper spacing
        - Handles multi-column text
        - Cleans control characters and extra whitespace
        - Limits pages for performance
        
        Args:
            url: Cloudinary URL of the PDF resume
            max_pages: Maximum pages to process (default 5 for resumes)
            
        Returns:
            Clean, formatted text content from PDF
            
        Raises:
            Exception: If download or parsing fails
        """
        try:
            # Download PDF from Cloudinary with timeout
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Open PDF from bytes stream
            pdf_document = fitz.open(stream=response.content, filetype="pdf")
            
            # Extract text from pages
            text_content = []
            pages_to_process = min(pdf_document.page_count, max_pages)
            
            for page_num in range(pages_to_process):
                page = pdf_document[page_num]
                
                # Extract text with layout preservation
                # "text" mode preserves layout better than "blocks"
                page_text = page.get_text("text")
                
                if page_text.strip():
                    text_content.append(page_text)
            
            pdf_document.close()
            
            # Combine all pages
            full_text = "\n\n".join(text_content)
            
            # Advanced text cleaning
            cleaned_text = PDFParser._clean_text(full_text)
            
            return cleaned_text
            
        except requests.RequestException as e:
            raise Exception(f"Failed to download PDF from Cloudinary: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """
        Clean extracted PDF text with production-grade processing.
        
        Handles:
        - Control characters
        - Excessive whitespace
        - Broken lines
        - Special characters
        """
        # Remove control characters except newlines and tabs
        text = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]', '', text)
        
        # Normalize whitespace
        text = re.sub(r'[ \t]+', ' ', text)  # Multiple spaces to single
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)  # Max 2 newlines
        
        # Fix common PDF extraction issues
        text = text.replace('\u2022', '•')  # Bullet points
        text = text.replace('\u2013', '-')  # En dash
        text = text.replace('\u2014', '--')  # Em dash
        text = text.replace('\u2019', "'")  # Smart quote
        text = text.replace('\u201c', '"')  # Smart quote
        text = text.replace('\u201d', '"')  # Smart quote
        
        # Strip leading/trailing whitespace from each line
        lines = [line.strip() for line in text.split('\n')]
        text = '\n'.join(lines)
        
        return text.strip()


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
        
        # Fetch available categories from database (with full details)
        self.categories = self._get_categories()
    
    def _get_categories(self):
        """Fetch all active categories with ID, name, and description."""
        try:
            from users.models import Category
            categories = Category.objects.filter(is_active=True).values('id', 'name', 'slug', 'description')
            return list(categories) if categories else []
        except Exception:
            # Fallback to default categories if database query fails
            return [
                {'id': None, 'name': 'Healthcare', 'slug': 'healthcare', 'description': 'Healthcare and medical services'},
                {'id': None, 'name': 'Technology', 'slug': 'technology', 'description': 'IT, software, and technology services'},
                {'id': None, 'name': 'Construction', 'slug': 'construction', 'description': 'Construction and building trades'},
                {'id': None, 'name': 'Retail', 'slug': 'retail', 'description': 'Retail sales and customer service'},
                {'id': None, 'name': 'Hospitality', 'slug': 'hospitality', 'description': 'Hotels, restaurants, and tourism'},
                {'id': None, 'name': 'Manufacturing', 'slug': 'manufacturing', 'description': 'Manufacturing and production'},
                {'id': None, 'name': 'Education', 'slug': 'education', 'description': 'Education and training'},
                {'id': None, 'name': 'Finance', 'slug': 'finance', 'description': 'Finance, banking, and accounting'},
                {'id': None, 'name': 'Other', 'slug': 'other', 'description': 'Other categories'}
            ]
    
    def analyze_career_path(
        self,
        quiz_data: Dict[str, str],
        work_history: List[Dict[str, Any]],
        resume_text: str
    ) -> Dict[str, Any]:
        """
        Analyze user data and resume text to provide career recommendations.
        
        Args:
            quiz_data: User's quiz responses (interests, work environment, etc.)
            work_history: List of work history entries
            resume_text: Extracted and cleaned text from PDF resume
            
        Returns:
            Structured career analysis with resume score and recommendations
        """
        # Build the analysis prompt
        prompt = self._build_analysis_prompt(quiz_data, work_history, resume_text)
        
        try:
            # Call OpenAI API with text-only (faster and cheaper than vision)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert career counselor and resume analyst. "
                            "Analyze the provided resume text along with quiz data and work history. "
                            "Return ONLY a valid JSON response with resume analysis and career recommendations. "
                            "Do not include any explanatory text outside the JSON."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000,
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
        work_history: List[Dict[str, Any]],
        resume_text: str
    ) -> str:
        """Build the analysis prompt for OpenAI with resume text."""
        work_history_summary = "\n".join([
            f"- {item.get('job_title', 'N/A')} at {item.get('company_name', 'N/A')} "
            f"({item.get('start_date', 'N/A')} to {item.get('end_date', 'Present')}): "
            f"{item.get('responsibilities', 'N/A')}"
            for item in work_history
        ])
        
        has_work_history = len(work_history) > 0
        
        # Limit resume text to avoid token limits (keep first 3000 chars)
        resume_preview = resume_text[:3000] if len(resume_text) > 3000 else resume_text
        
        # Format categories for AI with full details
        categories_list = "\n".join([
            f"- ID: {cat.get('id')}, Name: {cat['name']}, Description: {cat.get('description', 'N/A')}"
            for cat in self.categories
        ])
        
        prompt = f"""
Analyze the resume text provided along with the following user data and provide career recommendations:

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
- The resume text may supplement this information but should not override it

**Resume Text:**
{resume_preview}

**AVAILABLE CAREER CATEGORIES (From Database):**
You MUST recommend from ONLY these categories. Use the EXACT category data provided:

{categories_list}

CRITICAL INSTRUCTIONS FOR CAREER RECOMMENDATIONS:
1. DO NOT create custom job titles like "Software Developer" or "IT Manager"
2. You MUST use the exact category names from the list above
3. For each recommendation, use:
   - category_id: The exact ID from the list
   - title: The exact category NAME from the list (e.g., "Technology", "Healthcare")
   - description: The exact category DESCRIPTION from the list, OR if empty, create a brief description of careers in that category
4. Choose 1 primary and 2 alternative categories based on user's profile

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
      "category_id": "<exact ID from category list>",
      "title": "<exact category NAME from list, e.g., 'Technology', 'Healthcare'>",
      "description": "<exact category DESCRIPTION from list, or brief description of careers in this category>",
      "training_duration": "<e.g., '3-6 months', 'Less than 3 months'>",
      "match_type": "primary"
    }},
    {{
      "category_id": "<exact ID from category list>",
      "title": "<exact category NAME>",
      "description": "<exact category DESCRIPTION or brief description>",
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
    quiz_data,
    work_history,
    pdf_url
):
    """
    Main function to analyze career data and provide recommendations.
    
    Uses production-grade text extraction for optimal speed and cost.
    
    Args:
        quiz_data: User's quiz responses
        work_history: User's work history
        pdf_url: Cloudinary URL of the PDF resume
        
    Returns:
        Structured analysis with resume score and career recommendations
        
    Raises:
        Exception: If any step of the analysis fails
    """
    # Step 1: Download and extract text from PDF (fast and accurate)
    pdf_parser = PDFParser()
    resume_text = pdf_parser.download_and_extract_text(pdf_url)
    
    # Step 2: Analyze with GPT-4o using text
    analyzer = CareerAnalyzer()
    analysis_result = analyzer.analyze_career_path(quiz_data, work_history, resume_text)
    
    return analysis_result
