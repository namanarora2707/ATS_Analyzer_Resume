import { createAnalysisResponse, createHistoryResponse } from '../shared/api.js';

// In-memory storage for analyses (replace with database in production)
const analyses = [];
let nextAnalysisId = 1;

// DeepSeek API integration function
const analyzeWithDeepSeek = async (resumeText, jobDescription, apiKey) => {
  // DeepSeek API endpoint and configuration
  const deepseekEndpoint = 'https://api.deepseek.com/v1/chat/completions';
  
  const prompt = `
    Analyze the following resume against the job description and provide an ATS compatibility score and recommendations.
    
    Job Description:
    ${jobDescription}
    
    Resume:
    ${resumeText}
    
    Please provide a JSON response with the following structure:
    {
      "atsScore": 85,
      "matchedSkills": ["JavaScript", "React", "Node.js"],
      "missingSkills": ["Python", "AWS", "Docker"],
      "suggestions": ["Add more specific examples of your JavaScript experience", "Include metrics and quantifiable achievements"],
      "improvements": ["Optimize keyword placement for ATS scanning", "Add relevant certifications"]
    }
    
    Focus on:
    1. Keyword matching between resume and job description
    2. ATS compatibility and formatting
    3. Skill alignment
    4. Specific, actionable recommendations
    5. Score should be 0-100 based on how well the resume matches the job requirements
  `;

  try {
    const response = await fetch(deepseekEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS (Applicant Tracking System) analyzer and career coach. Provide detailed, actionable feedback on resume optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis content received from DeepSeek API');
    }

    // Parse the JSON response from DeepSeek
    const analysisJson = JSON.parse(analysisText);
    
    return {
      score: analysisJson.atsScore || 50,
      matchedSkills: analysisJson.matchedSkills || [],
      missingSkills: analysisJson.missingSkills || [],
      suggestions: analysisJson.suggestions || [],
      improvements: analysisJson.improvements || []
    };
  } catch (error) {
    console.error('DeepSeek API integration error:', error);
    throw error;
  }
};

// ATS analysis function with DeepSeek API integration ready
const analyzeResumeWithAI = async (resumeText, jobDescription) => {
  // Check for DeepSeek API key
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  
  if (deepseekApiKey) {
    try {
      // DeepSeek API integration would go here
      return await analyzeWithDeepSeek(resumeText, jobDescription, deepseekApiKey);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      console.log('Falling back to mock analysis...');
    }
  }
  
  // Fallback to mock implementation when DeepSeek API is not available
  
  // Extract skills from job description (simple keyword extraction)
  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
    'TypeScript', 'MongoDB', 'Express', 'REST API', 'GraphQL', 'Redux', 'Vue.js',
    'Angular', 'Java', 'C++', 'Machine Learning', 'Data Analysis', 'Project Management',
    'Agile', 'Scrum', 'Leadership', 'Communication', 'Problem Solving', 'Teamwork'
  ];
  
  // Simple skill matching logic
  const jobSkills = extractSkillsFromText(jobDescription, commonSkills);
  const resumeSkills = extractSkillsFromText(resumeText, commonSkills);
  
  const matchedSkills = resumeSkills.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
  
  const missingSkills = jobSkills.filter(skill => 
    !matchedSkills.some(matched => 
      matched.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(matched.toLowerCase())
    )
  ).slice(0, 5); // Limit to top 5 missing skills
  
  // Calculate score based on skill matching
  const skillMatchRatio = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
  const baseScore = Math.round(skillMatchRatio * 100);
  
  // Add some randomness and adjustments for realistic scoring
  const adjustedScore = Math.min(100, Math.max(20, baseScore + Math.random() * 20 - 10));
  const finalScore = Math.round(adjustedScore);
  
  // Generate suggestions based on missing skills and score
  const suggestions = generateSuggestions(finalScore, missingSkills, resumeText);
  const improvements = generateImprovements(finalScore, resumeText);
  
  return {
    score: finalScore,
    matchedSkills: matchedSkills.slice(0, 8), // Limit display
    missingSkills,
    suggestions,
    improvements
  };
};

const extractSkillsFromText = (text, skillsList) => {
  const foundSkills = [];
  const textLower = text.toLowerCase();
  
  for (const skill of skillsList) {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }
  
  return [...new Set(foundSkills)]; // Remove duplicates
};

const generateSuggestions = (score, missingSkills, resumeText) => {
  const suggestions = [];
  
  if (score < 60) {
    suggestions.push("Add more relevant keywords from the job description to your resume");
    suggestions.push("Include specific technical skills mentioned in the job posting");
  }
  
  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding experience with: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  
  if (!resumeText.toLowerCase().includes('achieve')) {
    suggestions.push("Include quantifiable achievements and results in your experience");
  }
  
  if (resumeText.split(' ').length < 200) {
    suggestions.push("Expand your resume with more detailed descriptions of your experience");
  }
  
  suggestions.push("Use action verbs to start each bullet point in your experience section");
  suggestions.push("Ensure your resume format is ATS-friendly with clear section headers");
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
};

const generateImprovements = (score, resumeText) => {
  const improvements = [];
  
  if (score < 40) {
    improvements.push("Major revision needed - align skills and experience with job requirements");
    improvements.push("Add relevant certifications or training mentioned in the job posting");
  } else if (score < 70) {
    improvements.push("Good foundation - focus on adding missing keywords and skills");
    improvements.push("Enhance experience descriptions with more specific technical details");
  } else {
    improvements.push("Strong match - fine-tune formatting and keyword placement");
    improvements.push("Consider adding any remaining relevant skills or technologies");
  }
  
  improvements.push("Review and optimize your resume summary/objective section");
  improvements.push("Ensure consistent formatting and clear section organization");
  
  return improvements.slice(0, 4); // Limit to 4 improvements
};

export const handleAnalyze = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json(createAnalysisResponse(false, null, "Authentication required"));
    }

    // In a real implementation, you would handle file upload here
    // For now, we'll expect the resume text and job description in the request body
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json(
        createAnalysisResponse(false, null, "Resume text and job description are required")
      );
    }

    // Analyze resume with AI (mock implementation)
    const aiResult = await analyzeResumeWithAI(resumeText, jobDescription);
    
    // Create analysis record
    const analysis = {
      id: nextAnalysisId.toString(),
      userId: user.id,
      fileName: "uploaded_resume.pdf", // In production, get from uploaded file
      jobDescription,
      atsScore: aiResult.score,
      suggestions: aiResult.suggestions,
      improvements: aiResult.improvements,
      matchedSkills: aiResult.matchedSkills,
      missingSkills: aiResult.missingSkills,
      createdAt: new Date().toISOString()
    };
    
    nextAnalysisId++;
    analyses.push(analysis);
    
    const response = createAnalysisResponse(true, analysis);
    
    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    const response = createAnalysisResponse(false, null, "Analysis failed. Please try again.");
    res.status(500).json(response);
  }
};

export const handleGetHistory = (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userAnalyses = analyses
      .filter(analysis => analysis.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json(createHistoryResponse(true, userAnalyses));
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch history"
    });
  }
};
