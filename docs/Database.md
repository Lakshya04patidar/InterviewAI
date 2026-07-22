# InterviewAI Database Design
## 1. Database Overview
InterviewAI uses MongoDB Atlas as its primary NoSQL database to store user information, interview sessions, AI-generated reports, resumes, recruiter data, and application metadata.

The database is designed using a modular approach where each major feature is represented by a dedicated collection. Relationships between collections are maintained using ObjectId references to ensure scalability, maintainability, and efficient querying.

## 2. Collections
- Users
- Profiles
- Resumes
- ResumeAnalysis
- Interviews
- InterviewSessions
- Questions
- Answers
- InterviewReports
- Notifications
- Companies
- RecruiterProfiles
- RefreshTokens
- UserSettings

## 3. Collection Relationships
### Users
- One User has one Profile.
- One User can upload multiple Resumes.
- One User can create multiple Interviews.
- One User can participate in multiple Interview Sessions.
- One User can submit multiple Answers.
- One User can receive multiple Notifications.
- One User has one User Settings document.
- One User can have multiple Refresh Tokens.

### Resumes
- One Resume has one Resume Analysis.

### Interviews
- One Interview can have multiple Interview Sessions.
- One Interview contains multiple Questions.

### Interview Sessions
- One Interview Session contains multiple Answers.
- One Interview Session has one Interview Report.

### Companies
- One Company can have multiple Recruiters.

### Recruiter Profiles
- One Recruiter Profile belongs to one User.
- One Recruiter Profile belongs to one Company.

## 4. Schema Design
### 4.1 Users Collection
Field           Type        Required    Unique  Description
_id             ObjectId    Yes         Yes     Primary identifier
fullName        String      Yes         No      User's full name
email           String      Yes         Yes     User email address
password        String      Yes*        No      Hashed password
role            Enum        Yes         No      student, recruiter, admin
provider        Enum        Yes         No      local, google
isEmailVerified Boolean     Yes         No      Email verification status
avatar          String      No          No      Profile image URL
lastLogin       Date        No          No      Last login timestamp
createdAt       Date        Yes         No      Creation timestamp
updatedAt       Date        Yes         No      Last update timestamp

#### Indexes
- email (unique)
- role

#### Validation Rules
- Email must be unique.
- Password must ne stored in hashed format.
- Provider must be one of: local, google.
- Role must be one of: student, recruiter, admin.
- Full name is required.

### 4.2 Profiles Collection
Field           Type            Required    Unique  Description
_id             ObjectId        Yes         Yes     Primary Identifier
userId          ObjectId        Yes         Yes     Reference to users collection
bio             String          No          No      Short user bio
phone           String          No          Yes     Contact Number
dateOfBirth     Date            No          No      User's date of birth
gender          Enum            No          No      Male, Female, Other
college         String          No          No      College or University
degree          String          No          No      Degree name
specialization  String          No          No      Branch or specialization
graduationYear  Number          No          No      Graduation Year
experience      Number          No          No      Years of Experience
skills          Array<String>   No          No      Technical Skills
githubUrl       String          No          No      GitHub profile
linkedinUrl     String          No          No      LinkedIn profile
portfolioUrl    String          No          No      Portfolio website
createdAt       Date            No          No      Creation timestamp
updatedAt       Date            No          No      Last update timestamp

#### Indexes
- userId (Unique)
- phone (Unique)

#### Validation Rules
- Every profile must belong to exactly one user.
- Graduation year cannot be in the future.
- Skills should be stored as an array.
- Phone number must be valid.

### 4.3 Resumes Collection
Field       Type        Required    Unique  Description
_id         ObjectId    Yes         Yes     Primary identifier
userId      ObjectId    Yes         No      Owner of resume
fileName    String      Yes         No      Original file name
fileUrl     String      Yes         No      AWS S3 file URL
fileType    Enum        Yes         No      PDF, DOCX
fileSize    Number      Yes         No      File size in bytes
version     Number      Yes         No      Resume version
isActive    Boolean     Yes         No      Active resume
uploadedAt  Date        Yes         No      Upload timestamp

#### Indexes
- userId
- uploadedAt

#### Validation Rules
- Only PDF and DOCX files are allowed.
- Maximum file size: 5 MB.
- Ever¥resume must belong to one user.

### 4.4 Interviews Collection
Field           Type        Required    Unique  Description
_id             ObjectId    Yes         Yes     Primary identifier
userId          ObjectId    Yes         No      Interview Owner
title           String      Yes         No      Interview Title
interviewType   Enum        Yes         Yes     HR, Technical, Coding, Resume, Voice
domain          String      Yes         No      MERN, Java, Python, DSA, DevOps, etc.
difficulty      Enum        Yes         No      Easy, Medium, Hard
status          Enum        Yes         No      Scheduled, Ongoing, Completed, Cancelled
totalQuestions  Number      Yes         Yes     Number of questions
duration        Number      Yes         No      Duration in minutes
createdAt       Date        Yes         No      Creation timestamp
updatedAt       Date        Yes         No      Last update timestamp

#### Indexes
- userId
- interviewType
- status
    
#### Validation Rules
- Duration must be greater than zero.
- Difficulty must be Easy, Medium, or Hard.
- Status must be Scheduled, Ongoing, Completed or Cancelled.

### 4.5 InterviewSessions Collection
Field               Type            Required    Unique  Description
_id                 ObjectId        Yes         Yes     Primary identifier
interviewId         ObjectID        Yes         No      Reference to Interviews
userId              ObjectID        Yes         No      Interview participant
status              Enum            Yes         No      NotStarted, InProgress, Completed, Abandoned
startedAt           Date            No          No      Interview start time
endedAt             Date            No          No      Interview end time
duration            Number          No          No      Total duration in seconds
overallScore        Number          No          No      Overall AI score
technicalScore      Number          No          No      Technical knowledge score
communicationScore  Number          No          No      Communication score
confidenceScore     Number          No          No      Confidence score
problemSolvingScore Number          No          No      Problem solving score
transcript          String          No          No      Voice interview transcript 
recordingUrl        String          No          No      AWS S3 recording URL 
aiSummary           String          No          No      AI generated interview summary 
strengths           Array<String>   No          No      Candidate strengths 
weaknesses          Array<String>   No          No      Areas for improvement
recommendations     Array<String>   No          No      Suggested learning topics
createdAt           Date            Yes         No      Creation timestamp
updatedAt           Date            Yes         No      Last update timestamp

#### Indexes
- userId
- interviewId
- status

#### Validation Rules
- A session must belong to one interview.
- Overall score must be between 0 and 100.
- Duration cannot be negative.
- Status must be one of: NotStarted, InProgress, Completed, Abandoned.

### 4.6 Questions Collection
Field           Type            Required    Description
_id             ObjectId        Yes         Primary identifier
interviewId     ObjectID        Yes         Parent interview
questionText    String          Yes         AI generated question
category        Enum            Yes         HR, Technical, Coding, Resume, Voice
topic           String          Yes         DSA, React, Node.js, etc.
difficulty      Enum            Yes         Easy, Medium, Hard
expectedAnswer  String          No          AI reference answer
hints           Array<String>   No          Optional hints
estimatedTime   Number          No          Expected answer time (seconds)
order           Number          Yes         Question sequence
followUpEnabled Boolean         Yes         Whether AI can ask follow-up questions
createdAt       Date            Yes         Creation timestamp

#### Indexes
- interviewId
- topic
- difficulty

#### Validation Rules
- Difficulty must be Easy, Medium or Hard.
- Order must be greater than 0.
- Estimated time mus₺be positive.

### 4.7 Answers Collection
Field           Type        Required    Description
_id             ObjectId    Yes         Primary identifier
sessionId       ObjectId    Yes         Reference to InterviewSession
questionId      ObjectId    Yes         Reference to Question
userId          ObjectId    Yes         Reference to User
answerText      String      No          Text answer provided by user
transcript      String      No          Speech-to-text transcript
recordingUrl    String      No          AWS S3 audio URL
timeTaken       Number      Yes         Time taken to answer (seconds)
aiScore         Number      No          AI evaluation score (0-100)
confidence      Number      No          Confidence score (0-100)
feedback        String      No          AI feedback
submittedAt     Date        Yes         Submission timestamp

#### Indexes
- sessionId
- questionId
- userId

#### Validation Rules
- AI score must be between 0 and 100.
- Confidence score must be between 0 and 100.
- Time taken cannot be negative.
- Every answer must belong to one question and one interview session.

### 4.8 InterviewReports Collection
Field               Type            Required    Description
_id                 ObjectId        Yes         Primary identifier
sessionId           ObjectId        Yes         Reference to InterviewSession
userId              ObjectId        Yes         Reference to user
overallScore        Number          Yes         Overall interview score
technicalScore      Number          No          Technical knowledge score
communicationScore  Number          No          Communication score
confidenceScore     Number          No          Confidence score
problemSolvingScore Number          No          Problem solving score
overallLevel        Enum            Yes         Beginner, Intermediate, Advanced, Interview Ready
strengths           Array<String>   No          Candidate strengths
weaknesses          Array<String>   No          Areas of improvement
recommendations     Array<String>   No          Personalized recommendations
aiSummary           String          No          AI generated report summary
completedAt         Date            Yes         Interview completion time

#### Indexes
- sessionId (Unique)
- userId

#### Validation Rules
- Overall score must be between 0 and 100.
- Overall level must be one of: Beginner, Intermediate, Advanced, Interview Ready.
- Each interview session can have only one report.

### 4.9 ResumeAnalysis Collection
Field                   Type            Required    Description
_id                     ObjectId        Yes         Primary identifier
resumeId                ObjectId        Yes         Reference to Resume
userId                  ObjectId        Yes         Reference to User0
atsScore                Number          Yes         ATS compatibility score (0-100)
extractedSkills         Array<String>   No          Skills extracted from resume
missingSkills           Array<String>   No          Skills missing for target role
strengths               Array<String>   No          Resume strengths
weaknesses              Array<String>   No          Resume weaknesses
suggestedImprovements   Array<String>   No          AI suggestions for improvement
targetRole              String          No          Desired job role
overallFeedback         String          No          AI generated feedback
analyzedAt              Date            Yea         Analysis timestamp 

#### Indexes
- resumeId (Unique)
- userId
- atsScore

#### Validation Rules
- ATS score must be between 0 and 100.
- Each resume can have only one latest analysis.
- Resume analysis must belong to an existing resume.

### 4.10 Notifications Collection
Field       Type        Required    Description 
_id         ObjectId    Yes         Primary identifier 
userId      ObjectId    Yes         Reference to User 
title       String      Yes         Notification title 
message     String      Yes         Notification message 
type        Enum        Yes         Info, Success, Warning, Error 
isRead      Boolean     Yes         Read status 
createdAt   Date        Yes         Creation timestamp 

#### Indexes
- userId
- isRead

#### Validation Rules
- Every notification must belong to one user.
- Type must be one of: Info, Success, Warning, Error.

### 4.11 UserSettings Collection
Field               Type        Required    Description 
_id                 ObjectId    Yes         Primary identifier 
userId              ObjectId    Yes         Reference to User 
theme               Enum        Yes         Light, Dark, System 
language            String      Yes         Preferred language 
emailNotifications  Boolean     Yes         Email notification preference 
interviewReminders  Boolean     Yes         Interview reminder preference 
createdAt           Date        Yes         Creation timestamp 
updatedAt           Date        Yes         Last update timestamp 

#### Indexes
- userId (Unique)

#### Validation Rules
- Each user can have only one settings document.

### 4.12 RefreshTokens Collection
Field       Type        Required    Description 
_id         ObjectId    Yes         Primary identifier 
userId      ObjectId    Yes         Reference to User 
token       String      Yes         Refresh token 
expiresAt   Date        Yes         Token expiration date 
isRevoked   Boolean     Yes         Token revocation status 
createdAt   Date        Yes         Creation timestamp 

#### Indexes
- userId
- token (Unique)
- expiresAt

#### Validation Rules
- Each token must be unique.
- Expired tokens should be automatically removed.
- A revoked token cannot be reused.

### 4.13 RecruiterProfiles Collection
Field       Type        Required    Description 
_id         ObjectId    Yes         Primary identifier 
userId      ObjectId    Yes         Reference to User 
companyId   ObjectId    Yes         Reference to Company 
designation String      Yes         Recruiter's designation 
department  String      No          Department 
experience  Number      No          Years of experience 
isVerified  Boolean     Yes         Verification status 
createdAt   Date        Yes         Creation timestamp 
updatedAt   Date        Yes         Last update timestamp 

#### Indexes
- userId (Unique)
- companyId

#### Validation Rules
- Every recruiter profile must belong to one user.
- Every recruiter must belong to one company.

### 4.14 Companies Collection
Field       Type        Required    Description 
_id         ObjectId    Yes         Primary identifier 
companyName String      Yes         Company name 
website     String      No          Official website 
industry    String      No          Industry type 
companySize Enum        No          Startup, Small, Medium, Enterprise 
logo        String      No          Company logo URL 
description String      No          Company description 
createdAt   Date        Yes         Creation timestamp 
updatedAt   Date        Yes         Last update timestamp 

#### Indexes
- companyName (Unique)

#### Validation Rules
- Company name must be unique.
- Website must be a valid URL.

## 5. Indexing Strategy
Proper indexing is implemented to improve query performance, reduce response time, and optimize database operations.

Collection          Indexed Fields                      Purpose
Users               email (Unique), role                Fast login and role-based queries
Profiles            userId (Unique), phone              Quick profile lookup
Resumes             userId, uploadedAt                  Fetch user resumes efficiently
ResumeAnalysis      resumeId (Unique), userId           Fast resume analysis retrieval
Interviews          userId, interviewType, status       Interview filtering
InterviewSessions   interviewId, userId, status         Session management
Questions           interviewId, topic, difficulty      Fast question retrieval
Answers             sessionId, questionId, userId       Answer evaluation
InterviewReports    sessionId (Unique), userId          Report retrieval
Notifications       userId, isRead                      Notification filtering
RefreshTokes        token (Unique), userId, expiresAt   Authentication
RecruiterProfiles   userId (Unique), companyId          Recruiter lookup
Companies           companyName (Unique)                Company search
UserSettings        userId (Unique)                     User preferences

## 6. Validation Rules
- Every document must have a valid ObjectId.
- All required fields must be present.
- Timestamps (createdAt, updatedAt) are maintained automatically.

### Users
- Email must be unique.
- Password must be stored in hashed format.
- Role must be one of: Student, Recruiter, Admin.
- Provider must be one of: Local, Google.

### Profiles
- Every profile belongs to exactly one user.
- Graduation year cannot be in the future.

### Resumes
- Only PDF and DOCX files are allowed.
- Maximum upload size: 5 MB.
- A user can upload multiple resumes.

### ResumeAnalysis
- ATS score must be between 0 and 100.
- Every analysis belongs to one resume.

### Interviews
- Difficulty must be Easy, Medium or Hard.
- Duration must be greater than zero.

### InterviewSessions
- Overall score must be between 0 and 100.
- Session status must be valid.

### Questions
- Question order must be positive.
- Difficulty must be Easy, Medium and Hard.

### Answers
- AI score must be between 0 and 100.
- Confidence score must be between 0 and 100.
- Time taken cannot be negative.

### InterviewReports
- One report per interview session.
- Overall level must be one of:
    - Beginner
    - Intermediate
    - Advanced
    - Interview Ready

### Notifications
- Notification type must be one of:
    - Info
    - Success
    - Warning
    - Error

### RefreshTokens
- Token must be unique.
- Expired tokens should be removed automatically.

### RecruiterProfiles
- Recruiter must belong to a valid company.

### Companies
- Company name must be unique.

### UserSettings
- One settings document per user.

## 7. Data Flow

### 1. User Authentication
User → Register/Login → Authentication Service → Users Collection → JWT & Refresh Token → Dashboard

### 2. Resume Upload & Analysis
User → Upload Resume → AWS S3 → Resumes Colletion → AI Resume Analyzer → ResumeAnalysis Collection

### 3. AI Interview
User → Create Interview → Interviews Collection → Generate AI Questions → Questions Collection

### 4. Interview Session
User → Start Interview → InterviewSessions Collection → Submit Answers → Answers Collection

### 5. AI Evaluation
Answers → OpenAI Evaluation → Generate Scores → InterviewReports Collection

### 6. Adaptive Interview Engine
Current Answer → AI Evaluation → Difficulty Adjustment → Next Question 

### 7. Dashboard
Dashboard → Users → InterviewReports → ResumeAnalysis → InterviewSessions → Analytics

### 8. Notifications
System Events → Notifications Collection → User Dashboard

### 9. Recruiter Module
Recruiter → Company → Candidate Reports → InterviewReports 

### 10. User Settings
User → UserSettings Collection → Personalized Experience

