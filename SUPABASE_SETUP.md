# 🔧 Supabase Setup Guide

This guide will help you set up Supabase as the backend for K-Drive.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: k-drive (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
3. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste the following SQL:

```sql
-- Create folders table
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_starred BOOLEAN DEFAULT false,
  is_trashed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_starred BOOLEAN DEFAULT false,
  is_trashed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shared_items table
CREATE TABLE shared_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT CHECK (permission IN ('view', 'edit')) DEFAULT 'view',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_shared_items_shared_with ON shared_items(shared_with);

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_items ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can view their own folders"
  ON folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders"
  ON folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
  ON folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
  ON folders FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for files
CREATE POLICY "Users can view their own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
  ON files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
  ON files FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for shared items
CREATE POLICY "Users can view items shared with them"
  ON shared_items FOR SELECT
  USING (auth.uid() = shared_with OR auth.uid() = shared_by);

CREATE POLICY "Users can share their own items"
  ON shared_items FOR INSERT
  WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can delete shares they created"
  ON shared_items FOR DELETE
  USING (auth.uid() = shared_by);
```

4. Click **Run** to execute the SQL

## Step 4: Set Up Storage

1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Create a bucket named `files`
4. Set it to **Public** (or Private if you want more control)
5. Click **Create Bucket**

### Set Storage Policies

1. Click on the `files` bucket
2. Go to **Policies**
3. Add the following policies:

**Upload Policy:**
```sql
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Download Policy:**
```sql
CREATE POLICY "Users can download their own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Delete Policy:**
```sql
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 5: Enable Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. (Optional) Enable other providers like Google, GitHub, etc.
4. Configure email templates if needed

## Step 6: Test the Connection

1. Restart your Next.js development server
2. The app should now connect to Supabase
3. You'll need to implement authentication to test fully

## Next Steps

To fully integrate Supabase:

1. **Add Authentication**
   - Create login/signup pages
   - Use Supabase Auth helpers
   - Protect routes with middleware

2. **Replace Mock Data**
   - Update each page to fetch from Supabase
   - Implement real file upload to storage
   - Add real-time subscriptions (optional)

3. **Add Error Handling**
   - Handle network errors
   - Show loading states
   - Implement retry logic

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Troubleshooting

### Can't connect to Supabase?
- Check your `.env.local` file has correct values
- Restart the dev server after changing env variables
- Verify your project URL and API key

### Database errors?
- Check Row Level Security policies
- Ensure you're authenticated
- Verify table structure matches the schema

### File upload fails?
- Check storage bucket permissions
- Verify storage policies are set correctly
- Ensure file size is within limits

---

Need help? Check the [Supabase Discord](https://discord.supabase.com) or [GitHub Discussions](https://github.com/supabase/supabase/discussions).
