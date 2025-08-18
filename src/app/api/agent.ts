import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { tool } from 'ai';
 
export const maxDuration = 30;
 
export const POST = async (request: Request) => {
  const { prompt }: { prompt?: string } = await request.json();
 
  if (!prompt) {
    return new Response('Prompt is required', { status: 400 });
  }
 
  const result = await generateText({
    model: openai('gpt-4.1'),
    prompt,
    maxSteps: 2,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      } as any),
      activities: tool({
        description: 'Get the activities in a location',
        parameters: z.object({
          location: z
            .string()
            .describe('The location to get the activities for'),
        }),
        execute: async ({ location }: { location: string }) => ({
          location,
          activities: ['hiking', 'swimming', 'sightseeing'],
        }),
      } as any),
    },
  } as any);
 
  return Response.json({
    steps: result.steps,
    finalAnswer: result.text,
  });
};