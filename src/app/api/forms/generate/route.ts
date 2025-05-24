import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Create a detailed prompt for Claude to generate a form
    const systemPrompt = `You are a form generation assistant. Generate a form based on the user's description. You must respond with a valid JSON object that matches this exact structure:

{
  "title": "Form Title",
  "description": "Optional form description",
  "questions": [
    {
      "id": "unique-id",
      "type": "short" | "paragraph" | "radio" | "checkbox" | "file",
      "label": "Question text",
      "isRequired": true | false,
      "options": ["option1", "option2"] // only for radio/checkbox types
      "acceptedFileTypes": [".pdf", ".doc"] // only for file type (optional)
      "maxFileSize": 10485760 // only for file type in bytes (optional, default 10MB)
    }
  ]
}

Rules:
1. Generate between 3-10 questions unless specified otherwise
2. Use appropriate question types based on the context
3. Make logical questions required or optional
4. For radio/checkbox questions, provide 2-6 relevant options
5. For file upload questions, suggest appropriate file types and size limits
6. Use descriptive labels and clear question text
7. Ensure all IDs are unique
8. Return ONLY the JSON object, no additional text or markdown
9. Make sure the JSON is valid and properly formatted

Question Types:
- "short": Single line text input
- "paragraph": Multi-line text input  
- "radio": Single choice from options
- "checkbox": Multiple choice from options
- "file": File upload with optional restrictions`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    // Extract the text content from Claude's response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    if (!responseText) {
      throw new Error('No response received from Claude');
    }

    // Parse the JSON response
    let formData;
    try {
      // Clean the response text in case Claude adds markdown or extra formatting
      const cleanedResponse = responseText.replace(/```json\n?|```\n?/g, '').trim();
      formData = JSON.parse(cleanedResponse);
    } catch {
      console.error('Failed to parse Claude response:', responseText);
      throw new Error('Invalid JSON response from Claude');
    }

    // Validate the response structure
    if (!formData.title || !Array.isArray(formData.questions)) {
      throw new Error('Invalid form structure received from Claude');
    }

    // Generate unique IDs for questions if not provided or ensure uniqueness
    const usedIds = new Set<string>();
    formData.questions = formData.questions.map((question: {
      id?: string;
      type: string;
      label?: string;
      isRequired?: boolean;
      options?: string[];
      acceptedFileTypes?: string[];
      maxFileSize?: number;
    }, index: number) => {
      // Generate a unique ID if missing or duplicate
      let questionId = question.id || `question-${index + 1}`;
      if (usedIds.has(questionId)) {
        questionId = `question-${uuidv4()}`;
      }
      usedIds.add(questionId);

      // Validate question type
      const validTypes = ['short', 'paragraph', 'radio', 'checkbox', 'file'];
      if (!validTypes.includes(question.type)) {
        question.type = 'short'; // Default fallback
      }

      // Ensure required fields
      return {
        id: questionId,
        type: question.type,
        label: question.label || `Question ${index + 1}`,
        isRequired: typeof question.isRequired === 'boolean' ? question.isRequired : false,
        ...(question.options && Array.isArray(question.options) && { options: question.options }),
        ...(question.acceptedFileTypes && Array.isArray(question.acceptedFileTypes) && { acceptedFileTypes: question.acceptedFileTypes }),
        ...(question.maxFileSize && typeof question.maxFileSize === 'number' && { maxFileSize: question.maxFileSize }),
      };
    });

    // Return the generated form data
    return NextResponse.json({
      success: true,
      form: {
        title: formData.title,
        description: formData.description || '',
        questions: formData.questions,
      },
    });

  } catch (error) {
    console.error('Form generation error:', error);
    
    // Provide specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check Claude API configuration.' },
          { status: 401 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'Failed to parse AI response. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate form. Please try again.' },
      { status: 500 }
    );
  }
} 