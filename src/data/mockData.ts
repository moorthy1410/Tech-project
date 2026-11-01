import { Survey, SurveyResponse, TeamMember } from '../types';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@nexuscorp.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Head of Customer Experience',
    department: 'Product & CX',
    lastActive: 'Just now'
  },
  {
    id: 'usr-2',
    name: 'Marcus Vance',
    email: 'marcus.v@nexuscorp.io',
    role: 'contributor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Product Manager',
    department: 'Core Platform',
    lastActive: '12 mins ago'
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.r@nexuscorp.io',
    role: 'analyst',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Quantitative UX Researcher',
    department: 'User Research',
    lastActive: '1 hour ago'
  },
  {
    id: 'usr-4',
    name: 'David Kim',
    email: 'david.k@nexuscorp.io',
    role: 'contributor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Customer Success Director',
    department: 'Client Operations',
    lastActive: '3 hours ago'
  }
];

export const INITIAL_SURVEYS: Survey[] = [
  {
    id: 'srv-1',
    title: 'Q4 Enterprise Product Satisfaction & NPS',
    description: 'Quarterly pulse on workflow efficiency, overall platform reliability, and likelihood to recommend Nexus.',
    category: 'Product Experience',
    status: 'published',
    createdAt: '2026-10-12T09:00:00Z',
    updatedAt: '2026-10-28T14:32:00Z',
    createdBy: 'Sarah Chen',
    tags: ['NPS', 'Q4', 'Enterprise', 'CSAT'],
    responseTarget: 250,
    allowAnonymous: false,
    questions: [
      {
        id: 'q1-1',
        type: 'nps',
        title: 'How likely are you to recommend Nexus to a colleague or industry peer?',
        description: 'Rate on a scale from 0 (Not at all likely) to 10 (Extremely likely)',
        required: true,
        scale: 10,
        minLabel: 'Not likely',
        maxLabel: 'Extremely likely'
      },
      {
        id: 'q1-2',
        type: 'rating_stars',
        title: 'How satisfied are you with the platform stability and speed over the past month?',
        description: '1 star = Very Unsatisfied, 5 stars = Exceeded Expectations',
        required: true,
        scale: 5
      },
      {
        id: 'q1-3',
        type: 'multiple_choice',
        title: 'Which product area do you and your team use most heavily?',
        required: true,
        options: [
          { id: 'opt-1', label: 'Survey Studio & Multi-step Composer' },
          { id: 'opt-2', label: 'Real-time Response Stream & Inbox' },
          { id: 'opt-3', label: 'NPS & Granular Analytics Dashboard' },
          { id: 'opt-4', label: 'API & Webhook Integrations' }
        ]
      },
      {
        id: 'q1-4',
        type: 'checkboxes',
        title: 'What key capabilities would increase your operational velocity?',
        required: false,
        options: [
          { id: 'feat-1', label: 'Custom Brand Domain & White-labeling' },
          { id: 'feat-2', label: 'Automated Slack & Teams alerts on negative sentiment' },
          { id: 'feat-3', label: 'Advanced Conditional Branching Logic' },
          { id: 'feat-4', label: 'One-click Salesforce & HubSpot Two-way Sync' }
        ]
      },
      {
        id: 'q1-5',
        type: 'text',
        title: 'What single feature or improvement would make Nexus irreplaceable for you?',
        description: 'Feel free to share concrete workflow scenarios or suggestions.',
        required: false
      }
    ]
  },
  {
    id: 'srv-2',
    title: 'Customer Onboarding & First-Run Experience',
    description: 'Evaluating friction points during workspace creation, team invitations, and initial survey deployment.',
    category: 'User Onboarding',
    status: 'published',
    createdAt: '2026-10-18T11:20:00Z',
    updatedAt: '2026-10-30T10:15:00Z',
    createdBy: 'Marcus Vance',
    tags: ['Onboarding', 'UX', 'Activation'],
    responseTarget: 150,
    allowAnonymous: true,
    questions: [
      {
        id: 'q2-1',
        type: 'likert',
        title: 'Setting up my first survey was intuitive and required zero training.',
        description: 'Rate your agreement level from Strongly Disagree to Strongly Agree',
        required: true,
        scale: 5
      },
      {
        id: 'q2-2',
        type: 'rating_stars',
        title: 'Overall rating of our onboarding documentation and guided checklist:',
        required: true,
        scale: 5
      },
      {
        id: 'q2-3',
        type: 'thumbs',
        title: 'Did you find all the pre-built survey templates you needed for your use case?',
        required: true
      },
      {
        id: 'q2-4',
        type: 'text',
        title: 'Where did you get stuck or need clarification during your first 48 hours?',
        required: false
      }
    ]
  },
  {
    id: 'srv-3',
    title: 'Customer Support Interaction & Resolution CSAT',
    description: 'Post-resolution assessment of support agent responsiveness, technical clarity, and turnaround time.',
    category: 'Support & Success',
    status: 'published',
    createdAt: '2026-10-22T08:30:00Z',
    updatedAt: '2026-10-31T15:00:00Z',
    createdBy: 'David Kim',
    tags: ['Support', 'CSAT', 'Live Support'],
    responseTarget: 300,
    allowAnonymous: false,
    questions: [
      {
        id: 'q3-1',
        type: 'rating_stars',
        title: 'How would you rate the speed of resolution for your recent support ticket?',
        required: true,
        scale: 5
      },
      {
        id: 'q3-2',
        type: 'thumbs',
        title: 'Was the support specialist knowledgeable and attentive to your needs?',
        required: true
      },
      {
        id: 'q3-3',
        type: 'text',
        title: 'Any additional feedback or praise for the support team member?',
        required: false
      }
    ]
  },
  {
    id: 'srv-4',
    title: '2027 Strategic Roadmap & Feature Priorities',
    description: 'Collaborative survey gathering customer input on upcoming enterprise AI, security, and governance initiatives.',
    category: 'Product Strategy',
    status: 'draft',
    createdAt: '2026-10-29T16:00:00Z',
    updatedAt: '2026-10-31T09:45:00Z',
    createdBy: 'Elena Rostova',
    tags: ['Roadmap', 'Strategy', 'Draft'],
    responseTarget: 100,
    allowAnonymous: false,
    questions: [
      {
        id: 'q4-1',
        type: 'multiple_choice',
        title: 'Which compliance standard is most critical for your organization this fiscal year?',
        required: true,
        options: [
          { id: 'opt-c1', label: 'SOC2 Type II + HIPAA BAA' },
          { id: 'opt-c2', label: 'ISO 27001 Certification' },
          { id: 'opt-c3', label: 'EU Data Residency (GDPR strict)' },
          { id: 'opt-c4', label: 'FedRAMP Moderate Readiness' }
        ]
      },
      {
        id: 'q4-2',
        type: 'text',
        title: 'What integrations do you plan to connect with your feedback stream?',
        required: false
      }
    ]
  }
];

export const INITIAL_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp-101',
    surveyId: 'srv-1',
    surveyTitle: 'Q4 Enterprise Product Satisfaction & NPS',
    respondentName: 'Jonathan Hayes',
    respondentEmail: 'j.hayes@vertexglobal.com',
    respondentCompany: 'Vertex Global Corp',
    submittedAt: '2026-10-31T20:14:00Z',
    sentiment: 'positive',
    npsScore: 10,
    csatRating: 5,
    reviewed: true,
    notes: 'Key enterprise champion. Wants beta access to Slack webhook notifications.',
    answers: [
      { questionId: 'q1-1', value: 10 },
      { questionId: 'q1-2', value: 5 },
      { questionId: 'q1-3', value: 'NPS & Granular Analytics Dashboard' },
      { questionId: 'q1-4', value: ['Automated Slack & Teams alerts on negative sentiment', 'Advanced Conditional Branching Logic'] },
      { questionId: 'q1-5', value: 'The real-time NPS tracking has transformed our executive weekly reviews. Absolutely loving the clean layout and speed.' }
    ]
  },
  {
    id: 'resp-102',
    surveyId: 'srv-1',
    surveyTitle: 'Q4 Enterprise Product Satisfaction & NPS',
    respondentName: 'Dr. Maria Morales',
    respondentEmail: 'mmorales@biotechresearch.org',
    respondentCompany: 'BioTech Research',
    submittedAt: '2026-10-31T18:42:00Z',
    sentiment: 'positive',
    npsScore: 9,
    csatRating: 4,
    reviewed: false,
    answers: [
      { questionId: 'q1-1', value: 9 },
      { questionId: 'q1-2', value: 4 },
      { questionId: 'q1-3', value: 'Survey Studio & Multi-step Composer' },
      { questionId: 'q1-4', value: ['Advanced Conditional Branching Logic', 'Custom Brand Domain & White-labeling'] },
      { questionId: 'q1-5', value: 'The survey composer is very snappy. Would love more granular likert scale customization options in the future.' }
    ]
  },
  {
    id: 'resp-103',
    surveyId: 'srv-1',
    surveyTitle: 'Q4 Enterprise Product Satisfaction & NPS',
    respondentName: 'Alex Mercer',
    respondentEmail: 'amercer@cloudscale.net',
    respondentCompany: 'CloudScale Networks',
    submittedAt: '2026-10-31T15:20:00Z',
    sentiment: 'neutral',
    npsScore: 7,
    csatRating: 3,
    reviewed: false,
    answers: [
      { questionId: 'q1-1', value: 7 },
      { questionId: 'q1-2', value: 3 },
      { questionId: 'q1-3', value: 'API & Webhook Integrations' },
      { questionId: 'q1-4', value: ['One-click Salesforce & HubSpot Two-way Sync'] },
      { questionId: 'q1-5', value: 'Good core features, but we need deeper webhook retry mechanics when our destination endpoint experiences rate limits.' }
    ]
  },
  {
    id: 'resp-104',
    surveyId: 'srv-1',
    surveyTitle: 'Q4 Enterprise Product Satisfaction & NPS',
    respondentName: 'Rebecca Sterling',
    respondentEmail: 'r.sterling@fintechpulse.io',
    respondentCompany: 'Fintech Pulse Inc',
    submittedAt: '2026-10-31T11:05:00Z',
    sentiment: 'negative',
    npsScore: 4,
    csatRating: 2,
    reviewed: true,
    notes: 'Escalated to customer success team David Kim for follow-up scheduled Nov 3.',
    answers: [
      { questionId: 'q1-1', value: 4 },
      { questionId: 'q1-2', value: 2 },
      { questionId: 'q1-3', value: 'Real-time Response Stream & Inbox' },
      { questionId: 'q1-4', value: ['Custom Brand Domain & White-labeling'] },
      { questionId: 'q1-5', value: 'Exporting 10k+ customer response records timed out on our team twice this week. We require high-concurrency exports.' }
    ]
  },
  {
    id: 'resp-105',
    surveyId: 'srv-2',
    surveyTitle: 'Customer Onboarding & First-Run Experience',
    respondentName: 'Liam O’Connor',
    respondentEmail: 'loconnor@dublintech.ie',
    respondentCompany: 'Dublin Tech Lab',
    submittedAt: '2026-10-30T16:11:00Z',
    sentiment: 'positive',
    npsScore: 10,
    csatRating: 5,
    reviewed: true,
    answers: [
      { questionId: 'q2-1', value: 'Strongly Agree' },
      { questionId: 'q2-2', value: 5 },
      { questionId: 'q2-3', value: 'up' },
      { questionId: 'q2-4', value: 'Zero hitches. We launched our customer pulse survey in under 15 minutes!' }
    ]
  },
  {
    id: 'resp-106',
    surveyId: 'srv-2',
    surveyTitle: 'Customer Onboarding & First-Run Experience',
    respondentName: 'Chloe Bennett',
    respondentEmail: 'cbennett@apac-retail.com',
    respondentCompany: 'APAC Retail Group',
    submittedAt: '2026-10-30T09:25:00Z',
    sentiment: 'neutral',
    npsScore: 8,
    csatRating: 4,
    reviewed: false,
    answers: [
      { questionId: 'q2-1', value: 'Agree' },
      { questionId: 'q2-2', value: 4 },
      { questionId: 'q2-3', value: 'up' },
      { questionId: 'q2-4', value: 'Adding colleagues was easy, but we needed to assign custom viewing permissions per folder.' }
    ]
  },
  {
    id: 'resp-107',
    surveyId: 'srv-3',
    surveyTitle: 'Customer Support Interaction & Resolution CSAT',
    respondentName: 'Tariq Al-Mansoor',
    respondentEmail: 'tariq@gulflogistics.ae',
    respondentCompany: 'Gulf Logistics Hub',
    submittedAt: '2026-10-29T14:18:00Z',
    sentiment: 'positive',
    npsScore: 10,
    csatRating: 5,
    reviewed: true,
    answers: [
      { questionId: 'q3-1', value: 5 },
      { questionId: 'q3-2', value: 'up' },
      { questionId: 'q3-3', value: 'Sarah Chen resolved our custom CSS injection query within 8 minutes. World-class support!' }
    ]
  },
  {
    id: 'resp-108',
    surveyId: 'srv-1',
    surveyTitle: 'Q4 Enterprise Product Satisfaction & NPS',
    respondentName: 'Siddharth Patel',
    respondentEmail: 'spatel@mumbaidata.in',
    respondentCompany: 'Mumbai Dataworks',
    submittedAt: '2026-10-29T10:02:00Z',
    sentiment: 'positive',
    npsScore: 9,
    csatRating: 5,
    reviewed: false,
    answers: [
      { questionId: 'q1-1', value: 9 },
      { questionId: 'q1-2', value: 5 },
      { questionId: 'q1-3', value: 'NPS & Granular Analytics Dashboard' },
      { questionId: 'q1-4', value: ['Advanced Conditional Branching Logic'] },
      { questionId: 'q1-5', value: 'The tabular analytics reports are unmatched. Great work on the dark/light contrast.' }
    ]
  }
];
