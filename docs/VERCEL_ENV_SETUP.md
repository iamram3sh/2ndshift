# Vercel Environment Variables Setup Guide

## Quick Fix for Login Issues

The error `JWT_SECRET environment variable is not set in production` means you need to add environment variables in Vercel.

## Step-by-Step Instructions

### 1. Generate JWT Secrets

**Where to run:** Open your terminal/command prompt on your computer.

**On Windows:**
- Press `Win + R`, type `powershell` or `cmd`, press Enter
- Or open PowerShell/Command Prompt from Start Menu
- Or in VS Code: Press `` Ctrl + ` `` (backtick) to open integrated terminal

**On Mac/Linux:**
- Open Terminal app
- Or in VS Code: Press `` Ctrl + ` `` (backtick) to open integrated terminal

**Run these commands:**

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate REFRESH_SECRET (run again to get a different value)
openssl rand -base64 32
```

**If openssl is not installed on Windows:**
- Option 1: Install Git for Windows (includes openssl)
- Option 2: Use PowerShell alternative:
  ```powershell
  # Generate JWT_SECRET
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  
  # Generate REFRESH_SECRET (run again)
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  ```
- Option 3: Use online generator (less secure): https://generate-secret.vercel.app/32

**Example output:**
```
aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1p=
xY9zA7bC5dE3fG1hI9jK7lM5nO3pQ1rS9tU7vW5xY3zA1bC9dE7fG5hI3jK1l=
```

**Copy the output** - you'll paste it into Vercel in the next step.

### 2. Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`2ndshift`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable:

   **Variable 1:**
   - **Key:** `JWT_SECRET`
   - **Value:** (paste the first generated secret)
   - **Environment:** Select **Production**, **Preview**, and **Development** (or just **Production** if you only want it there)

   **Variable 2:**
   - **Key:** `REFRESH_SECRET`
   - **Value:** (paste the second generated secret)
   - **Environment:** Select **Production**, **Preview**, and **Development** (or just **Production**)

6. Click **Save** for each variable

### 3. Verify Required Variables

Make sure these are also set:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `JWT_SECRET` ← **ADD THIS**
- ✅ `REFRESH_SECRET` ← **ADD THIS**
- ✅ `NEXT_PUBLIC_APP_URL` (optional but recommended)

### 4. Redeploy

After adding the variables:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

### 5. Verify

After redeploy, try logging in again. The error should be gone.

## Using Vercel CLI (Alternative)

If you prefer CLI:

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add JWT_SECRET production
# Paste the secret when prompted

vercel env add REFRESH_SECRET production
# Paste the secret when prompted

# Redeploy
vercel --prod
```

## Troubleshooting

### Variables not showing up?
- Make sure you selected the correct environment (Production/Preview/Development)
- Wait a few minutes and try again
- Check if you're looking at the right project

### Still getting errors after setting?
- Make sure you **redeployed** after adding variables
- Check that variable names are exactly: `JWT_SECRET` and `REFRESH_SECRET` (case-sensitive)
- Verify no extra spaces in the values

### Need to update existing variables?
1. Go to Settings → Environment Variables
2. Find the variable
3. Click **Edit**
4. Update the value
5. Redeploy

## Security Notes

⚠️ **Important:**
- Never commit JWT secrets to git
- Never share secrets publicly
- Use different secrets for production and development
- Rotate secrets periodically (every 90 days recommended)

## Quick Checklist

- [ ] Generated JWT_SECRET with `openssl rand -base64 32`
- [ ] Generated REFRESH_SECRET with `openssl rand -base64 32`
- [ ] Added JWT_SECRET to Vercel Environment Variables
- [ ] Added REFRESH_SECRET to Vercel Environment Variables
- [ ] Selected correct environment (Production)
- [ ] Redeployed the application
- [ ] Tested login - it works!
