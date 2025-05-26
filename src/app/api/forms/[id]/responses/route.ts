import { NextResponse } from 'next/server';
import { formsCollection, responsesCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { Form } from '@/models/form';
import { FormResponse } from '@/models/response';

// Types
interface QuickStats {
    totalSubmissions: number;
    numberOfQuestions: number;
}

interface QuestionAnswers {
    questionId: string;
    questionLabel: string;
    questionType: string;
    answers: Array<{
        responseId: string;
        questionType: string;
        value: any; // Can be string, string[], or FileUpload[]
        submittedAt: Date;
    }>;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid form ID' }, { status: 400 });
        }

        const formId = new ObjectId(id);
        const url = new URL(request.url);
        const action = url.searchParams.get('action');

        switch (action) {
            case 'stats':
                const stats = await getQuickStats(formId);
                return NextResponse.json(stats);
            
            case 'grouped':
                const grouped = await getGroupedQuestionAnswers(formId);
                return NextResponse.json(grouped);
            
            default:
                const responses = await getAllResponses(formId);
                return NextResponse.json(responses);
        }

    } catch (error) {
        console.error('Error in responses route:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// 1. Get all question responses using form ID
async function getAllResponses(formId: ObjectId): Promise<FormResponse[]> {
    // Get form to get question details
    const form = await formsCollection.findOne({ _id: formId }) as Form | null;
    if (!form) {
        throw new Error('Form not found');
    }

    const responses = await responsesCollection
        .find({ formId })
        .sort({ submittedAt: -1 })
        .toArray() as unknown as any[];

    return responses.map(response => {
        let processedAnswers: any[] = [];

        if (response.answers) {
            if (Array.isArray(response.answers)) {
                // Array format: add questionType to each answer
                processedAnswers = response.answers.map((answer: any) => {
                    const question = form.questions.find(q => q.id === answer.questionId);
                    return {
                        ...answer,
                        questionType: question?.type || 'unknown'
                    };
                });
            } else if (typeof response.answers === 'object') {
                // Object format: convert to array with questionType
                processedAnswers = Object.keys(response.answers).map(questionId => {
                    const question = form.questions.find(q => q.id === questionId);
                    return {
                        questionId,
                        questionType: question?.type || 'unknown',
                        value: response.answers[questionId]
                    };
                });
            }
        }

        return {
            ...response,
            _id: response._id?.toString(),
            formId: response.formId.toString(),
            answers: processedAnswers
        };
    });
}

// 2. Get quick stats for ResponsesContent.tsx
async function getQuickStats(formId: ObjectId): Promise<QuickStats> {
    // Get form to count questions
    const form = await formsCollection.findOne({ _id: formId }) as Form | null;
    if (!form) {
        throw new Error('Form not found');
    }

    // Get all responses
    const responses = await responsesCollection
        .find({ formId })
        .toArray();

    return {
        totalSubmissions: responses.length,
        numberOfQuestions: form.questions.length
    };
}

// 3. Get responses grouped by each question
async function getGroupedQuestionAnswers(formId: ObjectId): Promise<QuestionAnswers[]> {
    // Get form to get question details
    const form = await formsCollection.findOne({ _id: formId }) as Form | null;
    if (!form) {
        throw new Error('Form not found');
    }

    // Get all responses
    const responses = await responsesCollection
        .find({ formId })
        .sort({ submittedAt: -1 })
        .toArray() as unknown as any[];

    // Group answers by question
    const groupedAnswers: QuestionAnswers[] = form.questions.map(question => {
        const questionAnswers: Array<{
            responseId: string;
            questionType: string;
            value: any;
            submittedAt: Date;
        }> = [];

        responses.forEach(response => {
            // Handle both array format (ResponseAnswer[]) and object format (key-value pairs)
            let answerValue = null;
            
            if (response.answers) {
                if (Array.isArray(response.answers)) {
                    // Array format: find answer by questionId
                    const answer = response.answers.find((ans: any) => ans.questionId === question.id);
                    if (answer) {
                        answerValue = answer.value;
                    }
                } else if (typeof response.answers === 'object') {
                    // Object format: use question.id as key
                    answerValue = response.answers[question.id];
                }
            }

            // Only add if we found a valid answer (not null, undefined, or empty string)
            if (answerValue !== null && answerValue !== undefined && answerValue !== '') {
                questionAnswers.push({
                    responseId: response._id?.toString() || '',
                    questionType: question.type,
                    value: answerValue,
                    submittedAt: response.submittedAt
                });
            }
        });

        return {
            questionId: question.id,
            questionLabel: question.label,
            questionType: question.type,
            answers: questionAnswers
        };
    });

    return groupedAnswers;
}
