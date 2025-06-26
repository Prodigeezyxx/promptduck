
-- First, clean up existing duplicates (keep the most recent one)
WITH duplicate_groups AS (
  SELECT 
    user_id, 
    title, 
    content,
    array_agg(id ORDER BY created_at DESC) as ids
  FROM public.user_prompts 
  GROUP BY user_id, title, content 
  HAVING COUNT(*) > 1
),
ids_to_delete AS (
  SELECT unnest(ids[2:]) as id_to_delete
  FROM duplicate_groups
)
DELETE FROM public.user_prompts 
WHERE id IN (SELECT id_to_delete FROM ids_to_delete);

-- Now add the unique constraint to prevent future duplicates
ALTER TABLE public.user_prompts 
ADD CONSTRAINT unique_user_prompt_content 
UNIQUE (user_id, title, content);
