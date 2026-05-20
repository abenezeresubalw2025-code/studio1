'use server';
/**
 * @fileOverview An AI assistant that recommends dishes from a menu based on customer preferences.
 *
 * - aiDishRecommender - A function that handles the dish recommendation process.
 * - AiDishRecommenderInput - The input type for the aiDishRecommender function.
 * - AiDishRecommenderOutput - The return type for the aiDishRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDishRecommenderInputSchema = z.object({
  userPreferences: z
    .string()
    .describe("A description of the customer's cravings, dietary needs, or preferences (e.g., 'I'm looking for something light and healthy with chicken' or 'I want a spicy, vegetarian option')."),
  menu: z
    .string()
    .describe('A string representation of the restaurant menu, including dish names and descriptions.'),
});
export type AiDishRecommenderInput = z.infer<typeof AiDishRecommenderInputSchema>;

const RecommendedDishSchema = z.object({
  dishName: z.string().describe('The name of the recommended dish from the menu.'),
  reason: z
    .string()
    .describe("A brief explanation of why this dish is a good match for the customer's preferences."),
});

const AiDishRecommenderOutputSchema = z.object({
  recommendations: z
    .array(RecommendedDishSchema)
    .describe("An array of recommended dishes that match the customer's preferences."),
});
export type AiDishRecommenderOutput = z.infer<typeof AiDishRecommenderOutputSchema>;

export async function aiDishRecommender(input: AiDishRecommenderInput): Promise<AiDishRecommenderOutput> {
  return aiDishRecommenderFlow(input);
}

const aiDishRecommenderPrompt = ai.definePrompt({
  name: 'aiDishRecommenderPrompt',
  input: {schema: AiDishRecommenderInputSchema},
  output: {schema: AiDishRecommenderOutputSchema},
  prompt: `You are the T-Shawarma AI Flavor Navigator. Your task is to recommend specific dishes from the provided menu that best match the customer's preferences. 

If no dishes from the menu seem to match the customer's preferences, provide an empty array for recommendations.

Customer Preferences: {{{userPreferences}}}

Restaurant Menu:
{{{menu}}}

Based on the customer's preferences and the menu, provide a list of recommended dishes. For each recommendation, include the dish name and a brief reason why it's a good match.`,
});

const aiDishRecommenderFlow = ai.defineFlow(
  {
    name: 'aiDishRecommenderFlow',
    inputSchema: AiDishRecommenderInputSchema,
    outputSchema: AiDishRecommenderOutputSchema,
  },
  async input => {
    const {output} = await aiDishRecommenderPrompt(input);
    return output!;
  }
);
