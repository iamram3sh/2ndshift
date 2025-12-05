# Login Issue Debugging Guide

## Problem
After entering credentials and clicking "Sign in", the page refreshes and stays on the login page instead of redirecting to the dashboard.

## Diagnostic Steps

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab for:
- Any errors in red
- Look for logs starting with `[LOGIN]` - these show the login flow step-by-step

### 2. Check Network Tab
In Developer Tools, go to the Network tab and:
- Clear the network log
- Click "Sign in"
- Look for a request to `/api/v1/auth/login`
- Check the response:
  - Status code (should be 200 for success)
  - Response body (check if it contains `access_token` and `user`)
  - Any error messages

### 3. Check Application Tab
In Developer Tools, go to Application/Storage tab:
- Check Local Storage
- After login attempt, see if `access_token` is stored
- Check the value if it exists

### 4. What to Report

Please provide the following information:

#### A. Browser Console Output
Copy all console logs that appear when you click "Sign in", especially:
- Any errors
- Logs starting with `[LOGIN]`

#### B. Network Request Details
1. Find the `/api/v1/auth/login` request
2. Click on it and share:
   - Request URL
   - Request Method
   - Status Code
   - Response Headers
   - Response Body (or at least first few lines)

#### C. Error Messages
If any error appears in:
- The red error box on the login page
- The browser console
- The debug info box (blue box in development mode)

#### D. Test Credentials Status
- Email: `ramesh@gmail.com`
- Does this user exist in the database?
- What is the `user_type` for this user in the database? (should be 'worker')
- Does the user have a `password_hash` set?

## Common Issues & Solutions

### Issue 1: API Returns 401
**Symptom:** Network tab shows status 401  
**Possible Causes:**
- Invalid email/password
- User doesn't exist in database
- Password hash doesn't match
- User exists but password_hash is null

**Solution:**
- Verify credentials in database
- Check if password_hash exists for the user
- Verify password hashing algorithm matches

### Issue 2: API Returns 500
**Symptom:** Network tab shows status 500  
**Possible Causes:**
- JWT_SECRET not configured
- Database connection issue
- Token generation failure

**Solution:**
- Check server logs
- Verify environment variables (JWT_SECRET, REFRESH_SECRET)
- Check database connection

### Issue 3: No Network Request
**Symptom:** No request appears in Network tab when clicking Sign in  
**Possible Causes:**
- JavaScript error preventing form submission
- Form validation failing
- Event handler not attached

**Solution:**
- Check browser console for JavaScript errors
- Verify form validation passes
- Check if button is disabled

### Issue 4: Request Succeeds but No Redirect
**Symptom:** Network tab shows 200, response has data, but page stays  
**Possible Causes:**
- Token not stored in localStorage
- Redirect code not executing
- Router issue

**Solution:**
- Check if `access_token` is in localStorage
- Verify redirect code executes (check console logs)
- Try manual redirect via browser console

## Quick Test Commands

### Test Login API Directly
Open browser console and run:
```javascript
fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'ramesh@gmail.com',
    password: 'Abcd@12345!'
  })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err))
```

### Check Token Storage
```javascript
console.log('Access Token:', localStorage.getItem('access_token'))
```

### Manual Redirect Test
```javascript
window.location.href = '/worker'
```

## Next Steps After Debugging

Once you provide the debug information, I will:
1. Identify the exact failure point
2. Fix the root cause
3. Ensure reliable redirect
4. Test with your credentials

Please share the console logs and network request details so I can diagnose precisely.
