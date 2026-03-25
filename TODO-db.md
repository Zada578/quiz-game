# MySQL Database Integration TODO

## Approved Plan Steps:

### Setup Prerequisites
- [ ] Step 1: Install Node.js LTS from https://nodejs.org (restart VSCode/terminal after) ← **Next!**
- [x] Step 2: Verify MySQL running (localhost:3306), run create_db.sql for `quiz` DB/tables ✓ (questions:5 rows, scores ready)

### Backend Creation
- [x] Step 3: Create package.json, npm install
- [x] Step 4: Create .env with DB creds, server.js (no separate db.js needed)
- [ ] Step 5: Test server: `node server.js` → API endpoints work

### Frontend Update
- [ ] Step 6: Edit quiz.js - replace hardcoded data with API fetch/post
- [ ] Step 7: Test full app: http://localhost:3000 → questions from MySQL, scores saved

### Production/Deployment (Optional)
- [ ] Step 8: Git commit/push changes
- [ ] Step 9: Deploy (Railway/Vercel + PlanetScale MySQL)

Progress: Update after each step complete.
