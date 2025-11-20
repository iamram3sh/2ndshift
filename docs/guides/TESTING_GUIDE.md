# 🧪 Complete Testing Guide for 2ndShift Platform

## 🎯 Quick Test Flow (15 Minutes)

### Test User Credentials
```
Worker Account:
Email: worker@test.com
Password: TestWorker123!

Client Account:
Email: client@test.com
Password: TestClient123!

Admin Account:
Email: ram3sh.akula@gmail.com
Password: [Your existing password]
```

---

## 📋 Testing Checklist

### ✅ Phase 1: Basic Functionality (5 min)

#### Test 1: Registration & Login
1. **Register New Worker**
   - Go to `/register`
   - Fill in details (use worker@test.com)
   - Select "Worker" as user type
   - Submit and verify redirect to dashboard
   
2. **Register New Client**
   - Logout
   - Register again (use client@test.com)
   - Select "Client" as user type
   - Verify redirect to client dashboard

3. **Login Test**
   - Logout
   - Login as worker
   - Verify dashboard loads correctly
   - Logout
   - Login as client
   - Verify client dashboard loads

**Expected Results:**
- ✅ Registration successful
- ✅ Email validation works
- ✅ Correct dashboard based on user type
- ✅ Login/logout works smoothly

---

### ✅ Phase 2: Dashboard Features (5 min)

#### Test 2: Worker Dashboard
Login as: `worker@test.com`

**Check These:**
- [ ] 8 statistics cards display
- [ ] Active Contracts shows count
- [ ] Total Earnings displays (should be 0 initially)
- [ ] Profile completion percentage shows
- [ ] Available projects list loads
- [ ] Search projects works
- [ ] Filter by skills works
- [ ] Project cards show skill match %
- [ ] Dark mode toggle works

**Try This:**
1. Search for "React" in projects
2. Filter by skill "Node.js"
3. Click on a project card
4. Toggle dark mode

**Expected Results:**
- ✅ All stats load correctly
- ✅ Search filters projects in real-time
- ✅ Skill filter works
- ✅ Project details open
- ✅ Dark mode switches properly

#### Test 3: Client Dashboard
Login as: `client@test.com`

**Check These:**
- [ ] 8 statistics cards display
- [ ] Total Projects shows count
- [ ] Post New Project button visible
- [ ] Projects list displays
- [ ] Search projects works
- [ ] Filter by status works
- [ ] Application counters show

**Try This:**
1. Click "Post New Project"
2. Fill in project details
3. Submit project
4. Verify it appears in list
5. Search for your project

**Expected Results:**
- ✅ Can create new project
- ✅ Project appears immediately
- ✅ All fields save correctly
- ✅ Search and filter work

---

### ✅ Phase 3: Review System (5 min)

#### Test 4: Leave a Review

**Setup (One-time):**
1. Run `create_sample_data.sql` in Supabase
2. This creates a completed contract

**Test Flow:**
1. Login as `worker@test.com`
2. Navigate to `/contracts/[contract-id]/review`
   - Get contract ID from Supabase: `SELECT id FROM contracts WHERE status='completed' LIMIT 1`
3. Click stars to rate (try clicking different ratings)
4. Write review text
5. Submit review
6. Verify success message

**Expected Results:**
- ✅ Star rating interactive
- ✅ Can select 1-5 stars
- ✅ Text input works
- ✅ Character counter shows
- ✅ Submit successful
- ✅ Redirect after submission

#### Test 5: View Reviews
1. Navigate to worker profile page
2. Verify review displays
3. Check rating badge shows
4. Verify rating distribution chart

**Expected Results:**
- ✅ Review visible on profile
- ✅ Stars display correctly
- ✅ Rating badge shows average
- ✅ Distribution chart renders

#### Test 6: Respond to Review
1. Login as `client@test.com` (the reviewee)
2. View worker profile with review
3. Click "Respond to this review"
4. Write response
5. Submit

**Expected Results:**
- ✅ Response form appears
- ✅ Can write response
- ✅ Response saves
- ✅ Response displays under review

---

### ✅ Phase 4: Messaging System (5 min)

#### Test 7: Start Conversation
1. Login as `worker@test.com`
2. Go to a project page
3. Click "Message Client" button
4. Should open messages page with conversation

**Alternative:**
1. Go directly to `/messages?with=[client-user-id]`

**Expected Results:**
- ✅ Messages page opens
- ✅ New conversation created
- ✅ Chat interface loads

#### Test 8: Send Messages
1. In chat interface, type a message
2. Press Enter or click Send
3. Message should appear immediately

**Test Real-time:**
1. Open two browsers side by side
2. Login as worker in Browser 1
3. Login as client in Browser 2
4. Send message from Browser 1
5. **Should appear instantly in Browser 2**

**Expected Results:**
- ✅ Message sends immediately
- ✅ Appears in conversation
- ✅ Real-time updates work
- ✅ Timestamp shows correctly

#### Test 9: Conversation Features
**Check These:**
- [ ] Conversation list shows all chats
- [ ] Unread badge displays count
- [ ] Search conversations works
- [ ] Messages marked as read
- [ ] "Read" status shows
- [ ] Date separators display

**Try This:**
1. Send multiple messages
2. Search for conversation
3. Check unread badge updates
4. Verify read receipts

**Expected Results:**
- ✅ All features functional
- ✅ Real-time updates working
- ✅ Mobile responsive

---

### ✅ Phase 5: Verification System (5 min)

#### Test 10: Submit Verification (Worker)
1. Login as `worker@test.com`
2. Go to `/verification`
3. Click "Submit New Verification"
4. Select "PAN Card"
5. Enter PAN number: `ABCDE1234F`
6. Upload a test document (any PDF/image)
7. Submit

**Expected Results:**
- ✅ Form validation works
- ✅ File upload works
- ✅ Submission successful
- ✅ Shows pending status

#### Test 11: Admin Approval
1. Login as admin (`ram3sh.akula@gmail.com`)
2. Go to `/admin/verifications`
3. See pending verifications
4. Click "View Details"
5. Click "Approve"
6. Verify status changes to "verified"

**Expected Results:**
- ✅ Admin can see all verifications
- ✅ Can view documents
- ✅ Can approve/reject
- ✅ Notifications sent

#### Test 12: Verified Badge
1. Login as `worker@test.com`
2. Check if verified badge appears on profile
3. Go to `/verification` page
4. Verify status shows "Verified"

**Expected Results:**
- ✅ Badge displays correctly
- ✅ Status updated
- ✅ Progress bar at 100%

---

### ✅ Phase 6: Mobile Testing (5 min)

#### Test 13: Mobile Responsive
**Test on phone or resize browser to mobile width (<768px)**

1. **Navigation**
   - [ ] Menu accessible
   - [ ] All links work
   
2. **Dashboards**
   - [ ] Stats stack vertically
   - [ ] Cards full width
   - [ ] Touch-friendly buttons

3. **Messages**
   - [ ] Conversation list full screen
   - [ ] Back button appears
   - [ ] Chat interface switches properly
   - [ ] Keyboard doesn't overlap input

4. **Forms**
   - [ ] All forms usable on mobile
   - [ ] Inputs properly sized
   - [ ] Submit buttons accessible

**Expected Results:**
- ✅ Everything works on mobile
- ✅ No horizontal scroll
- ✅ Touch targets large enough
- ✅ Keyboard behavior correct

---

### ✅ Phase 7: Admin Features (5 min)

#### Test 14: Admin Dashboard
1. Login as admin
2. Go to `/admin`
3. Check statistics
4. Navigate to different sections

**Check These:**
- [ ] User management link works
- [ ] Analytics link works
- [ ] Verification management works
- [ ] All stats display correctly

#### Test 15: User Management
1. Go to `/admin/users`
2. View user list
3. Search for users
4. Filter by user type

**Expected Results:**
- ✅ All users listed
- ✅ Search works
- ✅ Filters work
- ✅ User details visible

---

## 🐛 Bug Reporting Template

If you find issues, note them like this:

```
Bug: [Short description]
Severity: High/Medium/Low
Steps to Reproduce:
1. Go to [page]
2. Click [button]
3. See error

Expected: [What should happen]
Actual: [What actually happens]
Screenshot: [If possible]
Browser: [Chrome/Safari/etc.]
```

---

## 🎯 Quick Smoke Test (2 Minutes)

If short on time, test these core flows:

1. ✅ **Login** - Both worker and client
2. ✅ **Dashboard** - Stats load correctly
3. ✅ **Messages** - Send a message
4. ✅ **Reviews** - View a review
5. ✅ **Verification** - Check submission page

If all 5 work, core functionality is operational! ✅

---

## 📊 Performance Testing

### Check These:
- [ ] Pages load in <3 seconds
- [ ] Messages send instantly
- [ ] No console errors
- [ ] Smooth animations
- [ ] No memory leaks (long session)

### Tools:
- Chrome DevTools (Performance tab)
- Lighthouse (Accessibility & Performance scores)
- Network tab (Check API calls)

---

## 🎨 UI/UX Testing

### Visual Checks:
- [ ] Consistent spacing
- [ ] Proper alignment
- [ ] Readable fonts
- [ ] Good color contrast
- [ ] Icons display correctly
- [ ] Images load properly
- [ ] No broken layouts

### Dark Mode:
- [ ] All text readable
- [ ] Colors appropriate
- [ ] No white flashes
- [ ] Icons visible
- [ ] Forms styled correctly

---

## 🔒 Security Testing

### Basic Checks:
- [ ] Can't access other users' data
- [ ] Admin pages blocked for non-admins
- [ ] RLS policies working
- [ ] Auth required for protected pages
- [ ] Logout clears session

### Try These (Should FAIL):
- Access `/admin` as worker → Should redirect
- View other user's messages → Should not display
- Edit other user's profile → Should be blocked

---

## ✅ Final Verification

Before declaring "ready for users":

1. [ ] All core features tested
2. [ ] No critical bugs found
3. [ ] Mobile works perfectly
4. [ ] Dark mode functional
5. [ ] Admin tools accessible
6. [ ] Security working
7. [ ] Performance acceptable
8. [ ] Real-time features working

---

## 🎉 Success Criteria

**Platform is ready when:**
- ✅ 95%+ of tests pass
- ✅ No critical bugs
- ✅ Core flows work smoothly
- ✅ Mobile experience good
- ✅ Real-time features functional

---

## 📞 Getting Help

**If stuck:**
1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Check RLS policies active
5. Ask for assistance!

---

**Ready to test? Start with Phase 1 and work through each phase! 🚀**
