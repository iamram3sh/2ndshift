-- =====================================================
-- Create exec_sql RPC function for Supabase
-- This allows executing raw SQL via RPC calls
-- Run this FIRST in Supabase SQL Editor before using migration scripts
-- =====================================================

CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Execute the SQL and return result
  EXECUTE sql;
  RETURN json_build_object('success', true, 'message', 'SQL executed successfully');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'sqlstate', SQLSTATE
    );
END;
$$;

-- Grant execute permission to authenticated users (or service role)
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- =====================================================
-- Alternative: Use Supabase Management API
-- If RPC doesn't work, you can use the Management API
-- or run migrations directly in SQL Editor
-- =====================================================
