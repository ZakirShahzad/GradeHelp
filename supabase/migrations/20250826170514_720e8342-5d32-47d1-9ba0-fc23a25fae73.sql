-- Create storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false);

-- Create storage policies for assignment files
CREATE POLICY "Users can upload their own assignment files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own assignment files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own assignment files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own assignment files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);