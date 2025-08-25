-- Add fields to profiles table for teacher questionnaire data
ALTER TABLE public.profiles 
ADD COLUMN grade_levels text[],
ADD COLUMN subjects text[],
ADD COLUMN years_teaching integer,
ADD COLUMN student_count integer,
ADD COLUMN preferred_grading_style text,
ADD COLUMN onboarding_completed boolean DEFAULT false;