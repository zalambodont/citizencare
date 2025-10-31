import type { SituationDescriptions, FamilyFinancialInfo } from '../types';

interface AIRequest {
  fieldName: keyof SituationDescriptions;
  context: string;
  language: 'en' | 'ar';
  attempt?: number;
  demographicInfo?: FamilyFinancialInfo;
}

interface AIResponse {
  suggestion: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-3.5-turbo';
const REQUEST_TIMEOUT_MS = 20000;

const fieldPrompts: Record<keyof SituationDescriptions, string> = {
  financialSituation:
    'Summarise the applicant\'s current financial hardship, including lost income, major expenses, and who relies on their support.',
  employmentCircumstances:
    'Describe the applicant\'s recent employment history and present situation, including layoffs, reduced hours, health limits, or informal work.',
  reasonForApplying:
    'Explain why the applicant must request social support now, covering essential costs at risk and the impact on their household.',
};

const languageLabels: Record<'en' | 'ar', string> = {
  en: 'English',
  ar: 'Modern Standard Arabic',
};

const buildMessages = (request: AIRequest) => {
  const basePrompt = fieldPrompts[request.fieldName];
  const contextSnippet = request.context?.replace(/\s+/g, ' ').trim();
  const hasDraft = !!contextSnippet && contextSnippet.length > 5;
  const language = languageLabels[request.language];
  const attemptNotice = request.attempt && request.attempt > 1
    ? `This is attempt number ${request.attempt}. Provide a fresh perspective with new details or structure while staying truthful.`
    : 'Provide your best possible draft on the first attempt.';

  const demographicContext: string[] = [];
  if (request.demographicInfo) {
    const demo = request.demographicInfo;
    if (demo.maritalStatus) demographicContext.push(`Marital status: ${demo.maritalStatus}`);
    if (demo.dependents !== '' && demo.dependents !== undefined) demographicContext.push(`Number of dependents: ${demo.dependents}`);
    if (demo.employmentStatus) demographicContext.push(`Employment status: ${demo.employmentStatus}`);
    if (demo.monthlyIncome !== '' && demo.monthlyIncome !== undefined) demographicContext.push(`Monthly income: ${demo.monthlyIncome}`);
    if (demo.housingStatus) demographicContext.push(`Housing status: ${demo.housingStatus}`);
  }

  const userContent = [
    `Write the response in ${language}.`,
    'Respond as the applicant using first-person singular ("I" statements). Do not address the reader or mention providing help.',
    'Deliver two to three detailed paragraphs ready to paste into the form. Do not add headings, bullet lists, or closing remarks.',
    basePrompt,
    demographicContext.length > 0
      ? `Use the following demographic information as context when crafting the response:\n${demographicContext.join('\n')}`
      : '',
    hasDraft
      ? `Here is the applicant's existing draft. Rewrite it, keeping all concrete facts and numbers while improving clarity and tone: «${contextSnippet}».`
      : 'The applicant has not provided additional notes yet. Craft the content from scratch based on the instructions above.',
    attemptNotice,
    'Stay factual and empathetic. Provide enough detail to help reviewers understand the urgency, including timelines, dependents, and critical expenses. Avoid promises, advice, or phrases like "we understand" or "I appreciate your assistance".',
  ].filter(Boolean).join('\n\n');

  return [
    {
      role: 'system' as const,
      content:
        'You are an assistant helping citizens draft clear and empathetic responses for a social support application. Be concise, focus on facts, and avoid adding sensitive personal data that was not supplied.',
    },
    {
      role: 'user' as const,
      content: userContent,
    },
  ];
};

const handleError = async (response: Response): Promise<never> => {
  let detail = response.statusText;

  try {
    const body = await response.json();
    detail = body?.error?.message || JSON.stringify(body);
  } catch {
  }

  throw new Error(detail || 'Failed to fetch AI suggestion');
};

export const generateAISuggestion = async (request: AIRequest): Promise<AIResponse> => {
  const apiKey = import.meta.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY in your .env file.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: buildMessages(request),
        temperature: 0.7,
        max_tokens: 320,
      }),
    });

    if (!response.ok) {
      await handleError(response);
    }

    const payload = await response.json();
    const suggestion = payload?.choices?.[0]?.message?.content?.trim();

    if (!suggestion) {
      throw new Error('The AI service returned an empty response.');
    }

    return { suggestion };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The AI request timed out. Please try again.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unexpected error while generating the AI suggestion.');
  } finally {
    clearTimeout(timeout);
  }
};
