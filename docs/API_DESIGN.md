# InterviewAI API Design

## 1. API Overview
InterviewAI expposes RESTful APIs built using Node.js and Express.js

The APIs follow REST principles, JWT-based authentication, role-based authorization HTTP status codes, and consistent JSON response formats.

Base URL

/api/v1

## 2. Authentication APIs
POST /auth/register
POST /auth/login
POST /auth/google
POST /auth/refresh-token
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
GET  /auth/me

## 3. User APIs
GET     /users/profile
PUT     /users/profile
DELETE  /users/profile

GET     /users/settings
PUT     /users/settings

POST    /users/avatar  

## 4. Resume APIs
POST   /resumes/upload
GET    /resumes
GET    /resumes/:id
PUT    /resumes/:id
DELETE /resumes/:id

POST   /resumes/:id/analye
GET    /resumes/:id/analysis

## 5. Interview APIs
POST   /interviews
GET    /interviews
GET    /interviews/:id
PUT    /interviews/:id
DELETE /interviews/:id

POST   /interviews/:id/start
POST   /interviews/:id/finish

GET    /interviews/:id.questions
POST   /interviews/:id/submit-answer

GET    /interviews/history

## 6. AI APIs
POST   /ai/generate-questions
POST   /ai/evaluate-answer
POST   /ai/generate-folloUp
POST   /ai/generate-report
POST   /ai/analyze-resume
POST   /ai/generate-roadmap
POST   /ai/adaptive-difficulty

## 7. Report APIs
GET  /reports
GET  /reports/:id
GET  /reports/latest
GET  /reports/dashboard

## 8. Notification APIs
GET    /notifications
PUT    /notifications/:id/read
PUT    /notifications/read-all
DELETE /notifications/:id

## 9. Recruiter APIs
GET    /recruiters/candidates
GET    /recruiters/candidates/:id
GET    /recruiters/reports/:id

POST   /recruiters/interviews
PUT    /recruiters/interviews/:id
DELETE /recruiters/interviews/:id

## 10. Admin APIs
GET    /admin/users
GET    /admin/recruiters
GET    /admin/analytics
GET    /admin/reports
GET    /admin/interviews

PUT    /admin/users/:id/status
DELETE /admin/users/:id

## 11. Response Format
### Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
}
```

### Error Response

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": []
}
```

## 12. Error Handling

Status Code     Description
200             OK
201             Created
400             Bad Request
401             Unauthorized
403             Forbidden
404             Not Found
409             Conflict
422             Validation Error
429             Too Many Requests
500             Internal Server Error

## 13. API Security
- JWT Authentication
- Refresh Token Rotation
- Google OAuth 2.0 Authentication
- Role-BAsed Access Control (Student, Recruiter, Admin)
- Request Validation
- Rate Limiting
- Helmet Security Headers
- CORS Configuration
- Input Sanitization
- Password Hashing (bcrypt)
- Secure HTTP Headers