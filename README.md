# Samalyze - AI Support System

An intelligent support ticket system powered by AI that automatically analyzes, categorizes, and responds to customer inquiries using Google's Gemini API and n8n automation workflows.

## Features

- 🤖 **AI-Powered Analysis**: Automatic sentiment analysis and intent classification using Gemini API
- 📊 **Real-time Dashboard**: Live statistics and ticket management interface
- 📧 **Email Integration**: Automated email notifications for ticket submissions and responses
- 🔄 **n8n Automation**: Workflow automation with Telegram notifications and Google Sheets logging
- 🗄️ **MongoDB Integration**: Robust data storage and retrieval
- ⚡ **Edge Runtime**: Optimized for Vercel's free tier with rate limiting
- 📱 **Responsive Design**: Modern UI built with Next.js 14 and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Edge Runtime
- **Database**: MongoDB
- **AI**: Google Gemini 1.5 Flash
- **Automation**: n8n workflows
- **Email**: Gmail SMTP
- **Notifications**: Telegram Bot API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud)
- Google Gemini API key
- Gmail account for SMTP (optional)
- n8n instance (optional)
- Telegram bot (optional)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd samalyze
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/samalyze
MONGODB_DB=ai_support
MONGODB_TICKETS_COLLECTION=tickets

# AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Email (Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# n8n Integration (Optional)
N8N_WEBHOOK_URL=http://your-n8n-instance/webhook/support-ticket

# Telegram Bot (Optional - for n8n workflow)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
samalyze/
├── app/
│   ├── api/
│   │   ├── analyze/          # AI analysis endpoint
│   │   ├── tickets/          # Ticket CRUD operations
│   │   └── webhook/          # n8n webhook handler
│   ├── page.tsx              # Main dashboard page
│   └── layout.tsx            # Root layout
├── components/
│   ├── shared/               # Shared components
│   ├── ui/                   # shadcn/ui components
│   ├── TicketForm.tsx        # Ticket submission form
│   ├── TicketList.tsx        # Ticket display component
│   └── TicketStats.tsx       # Statistics dashboard
├── lib/
│   ├── mongodb.ts            # Database operations
│   ├── email.ts              # Email utilities
│   └── types.ts              # TypeScript definitions
└── n8n-workflow.json         # n8n automation workflow
```

## API Endpoints

### POST `/api/tickets`

Submit a new support ticket

```json
{
  "email": "user@example.com",
  "subject": "Issue description",
  "message": "Detailed message"
}
```

### POST `/api/analyze`

Analyze a ticket with AI (internal use)

```json
{
  "ticketId": "ticket_id",
  "message": "ticket message",
  "email": "user@example.com",
  "subject": "ticket subject"
}
```

### POST `/api/webhook/n8n`

Handle n8n workflow responses

```json
{
  "ticketId": "ticket_id",
  "analysis": {
    "sentiment": "positive|negative|neutral",
    "intent": "question|complaint|compliment|other",
    "response": "AI generated response"
  }
}
```

## n8n Workflow

The included n8n workflow (`n8n-workflow.json`) provides:

1. **Webhook Trigger**: Receives ticket data from the Next.js app
2. **Data Processing**: Validates and formats ticket information
3. **Telegram Notification**: Sends alerts to your Telegram chat
4. **Google Sheets Logging**: Records tickets in a spreadsheet
5. **Response Handling**: Returns processed data to the application

### Setting up n8n Workflow

1. Import `n8n-workflow.json` into your n8n instance
2. Configure credentials for:
   - Telegram Bot API
   - Google Sheets OAuth2
3. Update the webhook URL in your environment variables
4. Test the workflow with sample data

## Configuration

### Rate Limiting

The system includes built-in rate limiting (15 requests per minute per IP) optimized for Gemini's free tier.

### Email Templates

Customize email templates in `lib/email.ts` for:

- Ticket confirmation emails
- AI response notifications
- Status updates

### AI Analysis

Configure AI behavior in `app/api/analyze/route.ts`:

- Adjust temperature for response creativity
- Modify token limits for cost optimization
- Customize analysis prompts

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in the Vercel dashboard
3. **Deploy** - the app will automatically deploy on push to main

### Manual Deployment

1. **Build the application**

```bash
npm run build
```

2. **Start the production server**

```bash
npm start
```

## Monitoring & Analytics

The dashboard provides real-time insights into:

- Total tickets submitted
- Pending, processing, and resolved ticket counts
- Recent ticket activity with AI analysis results
- Sentiment and intent distribution

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**MongoDB Connection Errors**

- Verify your `MONGODB_URI` is correct
- Ensure MongoDB is running (if local)
- Check network connectivity for cloud databases

**Gemini API Errors**

- Verify your API key is valid and has sufficient quota
- Check rate limiting (15 requests/minute for free tier)
- Ensure proper JSON parsing in responses

**Email Delivery Issues**

- Use Gmail App Passwords instead of regular passwords
- Enable 2FA on your Gmail account
- Check spam folders for test emails

**n8n Webhook Failures**

- Verify webhook URL is accessible
- Check n8n workflow is active
- Review n8n execution logs for errors

---

Built with ❤️ using Next.js, MongoDB, and Google Gemini AI
