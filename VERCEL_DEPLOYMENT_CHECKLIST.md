# Vercel Deployment Checklist

## ✅ Code Pushed to GitHub

Branch: `feature/backend-schema-v1`  
Status: Ready for deployment

## 🔐 Environment Variables for Vercel

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Required Variables

```bash
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Authentication
JWT_SECRET=your-jwt-secret-key-change-in-production
REFRESH_SECRET=your-refresh-secret-key-change-in-production

# Payment Providers (Optional - currently stubbed)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Service (Optional - currently stubbed)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@2ndshift.com

# Application
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Important Notes

1. **JWT Secrets**: Generate strong random secrets for production:
   ```bash
   # Generate secrets
   openssl rand -base64 32  # For JWT_SECRET
   openssl rand -base64 32  # For REFRESH_SECRET
   ```

2. **Supabase Keys**: Get from Supabase Dashboard → Settings → API

3. **Service Role Key**: Keep this secret! Never expose in client-side code.

## 🚀 Deployment Steps

### 1. Connect Repository to Vercel

1. Go to Vercel Dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Select branch: `feature/backend-schema-v1` (or merge to main first)

### 2. Configure Build Settings

Vercel should auto-detect Next.js, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Add Environment Variables

Add all required environment variables (see above) in Vercel Dashboard.

### 4. Deploy

Click "Deploy" - Vercel will:
- Install dependencies
- Build the application
- Deploy to production

## 📋 Post-Deployment Verification

### 1. Test API Endpoints

```bash
# Test health/availability
curl https://your-app.vercel.app/api/v1/auth/me

# Test registration
curl -X POST https://your-app.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "role": "worker",
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Verify Database Connection

- Check Vercel logs for database connection errors
- Verify Supabase connection is working
- Test that migrations were applied

### 3. Check Environment Variables

- Verify all env vars are set in Vercel
- Check that secrets are not exposed in client-side code
- Verify `NEXT_PUBLIC_*` vars are accessible

## 🔍 Monitoring

### Vercel Logs

Monitor deployment logs in Vercel Dashboard:
- Build logs
- Runtime logs
- Function logs

### Supabase Logs

Check Supabase Dashboard for:
- Database query logs
- API request logs
- Error logs

## ⚠️ Important Security Notes

1. **Never commit secrets** to GitHub
2. **Use Vercel Environment Variables** for all secrets
3. **Rotate secrets** if accidentally exposed
4. **Enable Vercel Analytics** for monitoring
5. **Set up error tracking** (Sentry, etc.)

## 🐛 Troubleshooting

### Build Fails

- Check build logs in Vercel
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

### API Errors

- Check Vercel function logs
- Verify environment variables are set
- Check Supabase connection
- Review database migration status

### Database Connection Issues

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase project is active
- Verify network access (no IP restrictions)

## 📝 Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Run seed script (if needed for production)
3. ✅ Set up monitoring/error tracking
4. ✅ Configure custom domain (if needed)
5. ✅ Set up CI/CD for automatic deployments
6. ✅ Review and merge PR to main branch

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- API Documentation: `/docs/backend-schema-v1.md`
- Migration Guide: `/docs/MIGRATION_GUIDE.md`

---

**Status**: ✅ Code pushed to GitHub  
**Branch**: `feature/backend-schema-v1`  
**Ready for**: Vercel deployment
