# Quick Fix for Worker Page Error

## Issue
The worker page shows an error instead of tasks.

## Most Common Causes

### 1. No Tasks in Database (Most Likely)
**Solution:** Run the seed data script

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/seed/v1-high-value-it-tasks.sql`
4. Click "Run" to execute the script
5. Refresh the worker page

### 2. Authentication Token Expired
**Solution:** Re-login

1. Click the "Re-login" button on the error page, OR
2. Go to `/login` and log in again

### 3. API Endpoint Not Working
**Solution:** Check API logs

1. Check Vercel deployment logs
2. Check Supabase logs
3. Verify the `/api/v1/jobs` endpoint is accessible

## Debugging Steps

1. **Open Browser Console (F12)**
   - Look for error messages
   - Check for network errors

2. **Check Network Tab (F12 → Network)**
   - Find the request to `/api/v1/jobs`
   - Check the response status and body
   - If 401: Authentication issue
   - If 500: Server error
   - If 200 but empty: No tasks in database

3. **Verify Authentication**
   - Check if `localStorage.getItem('access_token')` exists
   - Verify token is not expired

## Quick Test

Run this in the browser console to test the API:

```javascript
fetch('/api/v1/jobs?role=worker&status=open', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

This will show you the exact error from the API.
