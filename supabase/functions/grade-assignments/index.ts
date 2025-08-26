import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Grade assignments function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { assignmentId, rubric, submissionText, studentName } = await req.json();

    console.log('Grading submission for assignment:', assignmentId);

    // Get assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('title, description, total_points')
      .eq('id', assignmentId)
      .maybeSingle();

    if (assignmentError) {
      throw new Error(`Error fetching assignment: ${assignmentError.message}`);
    }

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Create the grading prompt
    const gradingPrompt = `
You are an expert teacher grading a student assignment. Please provide a detailed, constructive assessment.

ASSIGNMENT DETAILS:
Title: ${assignment.title}
Description: ${assignment.description}
Total Points: ${assignment.total_points}

STUDENT NAME: ${studentName}

RUBRIC/CRITERIA:
${rubric || 'Grade based on accuracy, completeness, effort, and understanding of the material.'}

STUDENT SUBMISSION:
${submissionText}

Please provide your response in the following JSON format:
{
  "score": <number between 0 and ${assignment.total_points}>,
  "percentage": <percentage score>,
  "letterGrade": "<A, B, C, D, or F>",
  "feedback": "<detailed constructive feedback explaining the grade>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "rubricBreakdown": {
    "understanding": <score out of 25>,
    "accuracy": <score out of 25>,
    "completeness": <score out of 25>,
    "effort": <score out of 25>
  }
}

Be fair, constructive, and encouraging in your feedback while maintaining academic standards.`;

    console.log('Sending request to OpenAI...');

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert teacher and grader. Provide fair, detailed, and constructive feedback on student work. Always respond with valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: gradingPrompt
          }
        ],
        max_completion_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${error}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response received');

    let gradingResult;
    try {
      gradingResult = JSON.parse(openaiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse grading response');
    }

    // Validate the grading result structure
    if (!gradingResult.score || !gradingResult.feedback) {
      throw new Error('Invalid grading response format');
    }

    console.log('Grading completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        grading: gradingResult,
        assignment: assignment
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in grade-assignments function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});