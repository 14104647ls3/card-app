import { NextResponse } from 'next/server';
import { formsCollection, responsesCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { Form, Question } from '@/models/form';
import { FormResponse, ResponseAnswer } from '@/models/response';

interface QuestionStatistics {
    questionId: string;
    questionLabel: string;
    questionType: string;
    totalAnswers: number;
    statistics?: {
        [option: string]: {
            count: number;
            percentage: number;
        };
    };
}

interface ResponsesData {
    formId: string;
    formTitle: string;
    totalResponses: number;
    questionStatistics: QuestionStatistics[];
    responses: FormResponse[];
}

interface FilterOptions {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
    statisticsOnly?: boolean;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const objectId = new ObjectId(id);

        // Parse query parameters
        const url = new URL(request.url);
        const statisticsOnly = url.searchParams.get('statisticsOnly') === 'true';
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const offset = url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : 0;

        const responseData = await getFormResponsesData(objectId, {
            statisticsOnly,
            limit,
            offset
        });

        return NextResponse.json(responseData);
    } catch (err) {
        console.error('Error fetching form responses:', err);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const objectId = new ObjectId(id);
        const filterOptions: FilterOptions = await request.json();

        const responseData = await getFormResponsesData(objectId, filterOptions);

        return NextResponse.json(responseData);
    } catch (err) {
        console.error('Error fetching filtered form responses:', err);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

async function getFormResponsesData(
    formObjectId: ObjectId,
    options: FilterOptions = {}
): Promise<ResponsesData> {
    // Fetch the form to get question details
    const form = await formsCollection.findOne({ _id: formObjectId }) as Form | null;

    if (!form) {
        throw new Error('Form not found');
    }

    // Build query for responses
    const responseQuery: { formId: ObjectId; submittedAt?: { $gte?: Date; $lte?: Date } } = {
        formId: formObjectId
    };

    if (options.dateFrom || options.dateTo) {
        responseQuery.submittedAt = {};
        if (options.dateFrom) {
            responseQuery.submittedAt.$gte = new Date(options.dateFrom);
        }
        if (options.dateTo) {
            responseQuery.submittedAt.$lte = new Date(options.dateTo);
        }
    }

    // Fetch responses with optional pagination
    let responsesQuery = responsesCollection
        .find(responseQuery)
        .sort({ submittedAt: -1 });

    if (options.offset) {
        responsesQuery = responsesQuery.skip(options.offset);
    }

    if (options.limit) {
        responsesQuery = responsesQuery.limit(options.limit);
    }

    const responses = await responsesQuery.toArray() as unknown as FormResponse[];

    // Get total count for pagination
    const totalResponses = await responsesCollection.countDocuments(responseQuery);

    // Calculate statistics for each question
    const questionStatistics: QuestionStatistics[] = form.questions.map((question: Question) => {
        return calculateQuestionStatistics(question, responses);
    });

    // Clean up response data for frontend (only if not statistics only)
    const cleanResponses = options.statisticsOnly ? [] : responses.map(response => ({
        ...response,
        _id: response._id?.toString(),
        formId: response.formId.toString(),
    }));

    return {
        formId: form._id.toString(),
        formTitle: form.title,
        totalResponses,
        questionStatistics,
        responses: cleanResponses,
    };
}

function calculateQuestionStatistics(question: Question, responses: FormResponse[]): QuestionStatistics {
    const questionAnswers = responses
        .map(response => response.answers.find(answer => answer.questionId === question.id))
        .filter(answer => answer !== undefined) as ResponseAnswer[];

    const totalAnswers = questionAnswers.length;

    const baseStats: QuestionStatistics = {
        questionId: question.id,
        questionLabel: question.label,
        questionType: question.type,
        totalAnswers,
    };

    // For multiple choice (radio) and checkbox questions, calculate detailed statistics
    if ((question.type === 'radio' || question.type === 'checkbox') && question.options) {
        const statistics: { [option: string]: { count: number; percentage: number } } = {};

        // Initialize all options with 0 count
        question.options.forEach(option => {
            statistics[option] = { count: 0, percentage: 0 };
        });

        // Count answers for each option
        questionAnswers.forEach(answer => {
            if (question.type === 'radio' && typeof answer.value === 'string') {
                // Single choice - radio button
                if (statistics[answer.value]) {
                    statistics[answer.value].count++;
                }
            } else if (question.type === 'checkbox' && Array.isArray(answer.value)) {
                // Multiple choice - checkbox
                answer.value.forEach(selectedOption => {
                    if (typeof selectedOption === 'string' && statistics[selectedOption]) {
                        statistics[selectedOption].count++;
                    }
                });
            }
        });

        // Calculate percentages
        Object.keys(statistics).forEach(option => {
            if (totalAnswers > 0) {
                statistics[option].percentage = Math.round(
                    (statistics[option].count / totalAnswers) * 100 * 100
                ) / 100; // Round to 2 decimal places
            }
        });

        baseStats.statistics = statistics;
    }

    return baseStats;
}
