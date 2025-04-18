# AI-powered notes app - requirementes document

# 1. Project Overview
Objective: Build a mobile notes app with AI capabilities using:
* Expo React Native (frontend)
* Supabase (backend & auth)
* Deepseek AI (note processing)

Key differentiators:
* AI-powered note summarization
* automati content categorization
* cloud sync with offline access

# 2. Functional requirements
## 2.1 Authentication (Supabase)
* User Signup: email/password validation with Supabase Auth
* User Loing: Session management with JWT tokens
* Logout: Clear session and anvigation to auth screen
* Error handling: Display auth error (invalid email, weak password, etc.)
## 2.2 Note management
* create note:
    * Title (120 char limit)
    * Content (unlimited text)
    * auto-save on submit
* Read notes:
    * list view with cards (titel + 50 char preview)
    * descending chronological order
* Update note:
    * edit existing notes
    * update Supabase database
* Delete note:
    * swipe-to-ldelete with confirmation
    * hard deleted from database

## 2.3 AI features (Deepseek)
* Summarization:
    * Trigger via button in editor
    * Process full note test through Deepseek API
    * Return bullet-point summary
* Categorization:
    * Auto-tag notes on save
    * 5 predefined categories (Work, Personal, Ideas, Tasks, Learning)
    * Display tags as colored pills
* Loading states: show spinner during AI processing
* error handling: retrsy mechanismu for failed API calls

# 3. Technical specifications
## 3.1 Supabase Setup
* Use Supabase Auth for user authenticatio
* Store notes in a Supabase table with fields:
    * id (unique identifier)
    * user_id (linked to authenticated user)
    * title (note title)
    * content (note content)
    * tags (AI-geerated categories)
    created_at and updated_at timestamps

## 3.2 API integration
* Deepseek summarization
    * Endpoint: POST https://api.deepseek.ai/v1/summarize
    * Input: Note text
    * Output: Predefined category tags

## 3.3 Component architecture
* AuthStack: Login and Signup screens
* MainStack:
    * NotesListScreen: Displays all notes
    * NoteEditorScreen: Create/edit notes with AI actions
    * AIProcessingModal: Shows loading/result of AI tasks

# 4. Non-functional requirements
* Performance: Notes load in <1s (cached locally)
* Security:
    * API keys stored securely
    * row-level security enabled in Supabase
* Accessibility: Follow basic accessibility guidelines
* Error Handling: Global error boundary for crashes
* Testing: Basic unit tests for core functionality

# 5. Development Milestones
1. Phase 1: Supbasea setup & auth flow (2 days)
2. Phase 2: Core note CRUD operaitons (3 days)
3. Phase 3: AI integration (2 days)
4. Phase 4: Polish & testing (1 day)

# 6. Risk Management
* Risk: Deepseek API rate limits  
Mitigation: Implement request throttling
* Risk: Supabase misconfiguration  
Mitigation: Test with different user roles
* Risk: Long AI response times  
Mitigation: Add loading states & timeout handling

# 7. Appendix
* Supabase Docs: https://supabase.com/docs
* Deepseek API Reference: http://deepseek.ai/docs
* Expo Router Documentation: https://docs.expo.dev/router/introduction/
