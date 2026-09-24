import { TaskItem, ToolItem, FileItem, ApprovalRequest, ActivityItem, MessageItem, AgentNotification } from '../types';

export const INITIAL_NOTIFICATIONS: AgentNotification[] = [
  {
    id: 'notif_001',
    type: 'task_completed',
    title: 'Task Completed: Website Audit Report',
    message: 'Agent-sigma08 completed deep SEO and speed performance analysis with 92/100 score.',
    timestamp: '2m ago',
    isoTime: new Date(Date.now() - 120000).toISOString(),
    taskId: 'task_001',
    taskTitle: 'Audit website performance & SEO',
    read: false,
    priority: 'normal',
    resultSummary: 'Scored 92/100. Recommendations saved to workspace-audit.md.',
  },
  {
    id: 'notif_002',
    type: 'web_gathering',
    title: 'Web Information Gathered: 2026 AI Agent Standards',
    message: 'Collected and verified 3 authoritative sources for autonomous workflow planning.',
    timestamp: '15m ago',
    isoTime: new Date(Date.now() - 900000).toISOString(),
    read: false,
    priority: 'normal',
    webSources: [
      { title: 'Google Gemini 2026 Developer Guide', url: 'https://ai.google.dev', domain: 'ai.google.dev' },
      { title: 'MDN Web Specifications', url: 'https://developer.mozilla.org', domain: 'developer.mozilla.org' },
      { title: 'Modern Agentic Architecture Benchmarks', url: 'https://github.com', domain: 'github.com' },
    ],
  },
  {
    id: 'notif_003',
    type: 'task_started',
    title: 'Real Working: Autonomous Task Execution',
    message: 'Agent-sigma08 actively executing customer reply synthesis and validation pipeline.',
    timestamp: '34m ago',
    isoTime: new Date(Date.now() - 2040000).toISOString(),
    taskId: 'task_002',
    taskTitle: 'Draft reply to customer message',
    read: false,
    priority: 'normal',
  },
  {
    id: 'notif_004',
    type: 'system',
    title: 'Agent-sigma08 Operational',
    message: 'System online with unconstrained Gemini reasoning core & real-time search grounding.',
    timestamp: '1h ago',
    isoTime: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    priority: 'low',
  },
];

export const INITIAL_TOOLS: ToolItem[] = [
  // FILE_TOOLS
  {
    id: 'tool_read_file',
    name: 'Read File',
    category: 'FILE_TOOLS',
    description: 'Read and extract content from documents (PDF, DOCX, TXT, CSV, JSON, MD, Code)',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_search_files',
    name: 'Search Files',
    category: 'FILE_TOOLS',
    description: 'Semantic and keyword search across local workspace files',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_create_file',
    name: 'Create File',
    category: 'FILE_TOOLS',
    description: 'Generate and write new documents, reports, and code files to workspace',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_analyze_file',
    name: 'Analyze File',
    category: 'FILE_TOOLS',
    description: 'Deep structural analysis, complexity metrics, and content verification',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },

  // WEB_TOOLS
  {
    id: 'tool_web_search',
    name: 'Web Search',
    category: 'WEB_TOOLS',
    description: 'Query live search indexes to gather real-time data and industry benchmarks',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_open_webpage',
    name: 'Open Webpage',
    category: 'WEB_TOOLS',
    description: 'Inspect URL endpoints, fetch HTML content, and examine DOM structures',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_extract_info',
    name: 'Extract Information',
    category: 'WEB_TOOLS',
    description: 'Isolate key statistics, quotes, and factual citations from web articles',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },

  // CODE_TOOLS
  {
    id: 'tool_analyze_code',
    name: 'Analyze Code',
    category: 'CODE_TOOLS',
    description: 'Perform static AST audits, vulnerability checks, and performance profiling',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_generate_code',
    name: 'Generate Code',
    category: 'CODE_TOOLS',
    description: 'Synthesize clean, typed, modular components and backend controllers',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_debug_code',
    name: 'Debug Code',
    category: 'CODE_TOOLS',
    description: 'Isolate syntax and runtime exceptions, race conditions, and memory leaks',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },

  // DOCUMENT_TOOLS
  {
    id: 'tool_create_doc',
    name: 'Create Document',
    category: 'DOCUMENT_TOOLS',
    description: 'Compose executive briefs, client proposals, project roadmaps, and PRDs',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_summarize_doc',
    name: 'Summarize Document',
    category: 'DOCUMENT_TOOLS',
    description: 'Condense multi-page whitepapers into high-signal bulleted takeaways',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_format_doc',
    name: 'Format Document',
    category: 'DOCUMENT_TOOLS',
    description: 'Standardize headers, markdown hierarchy, callouts, and clean tables',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },

  // DATA_TOOLS
  {
    id: 'tool_analyze_csv',
    name: 'Analyze CSV',
    category: 'DATA_TOOLS',
    description: 'Parse tabular rows, calculate aggregations, distributions, and null ratios',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_analyze_json',
    name: 'Analyze JSON',
    category: 'DATA_TOOLS',
    description: 'Validate schemas, flatten nested hierarchies, and query data paths',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_gen_tables',
    name: 'Generate Tables',
    category: 'DATA_TOOLS',
    description: 'Render responsive, formatted data tables with column alignment',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_gen_charts',
    name: 'Generate Charts',
    category: 'DATA_TOOLS',
    description: 'Compute statistical distribution charts, bar metrics, and trendlines',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },

  // CREATIVE_TOOLS
  {
    id: 'tool_design_concepts',
    name: 'Generate Design Concepts',
    category: 'CREATIVE_TOOLS',
    description: 'Produce high-converting UI wireframes, design systems, and component specs',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_gen_prompts',
    name: 'Generate Prompts',
    category: 'CREATIVE_TOOLS',
    description: 'Craft high-precision instructions and few-shot reasoning prompts',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_product_desc',
    name: 'Create Product Description',
    category: 'CREATIVE_TOOLS',
    description: 'Generate feature-benefit matrices and conversion-focused product copy',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_marketing_copy',
    name: 'Create Marketing Copy',
    category: 'CREATIVE_TOOLS',
    description: 'Draft high-impact email campaigns, ad taglines, and social announcements',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_seo_audit',
    name: 'SEO & Performance Auditor',
    category: 'WEB_TOOLS',
    description: 'Audit any URL for search engine optimization indexing, response latency, metadata depth, and mobile friendliness',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_sql_designer',
    name: 'SQL Sandbox & DB Designer',
    category: 'DATA_TOOLS',
    description: 'Design relational tables, test complex SQL queries, generate mocked seeds, and analyze query execution plans',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
  {
    id: 'tool_prompt_optimizer',
    name: 'Prompt Optimizer Engine',
    category: 'CREATIVE_TOOLS',
    description: 'Refine raw natural language concepts into high-signal system instructions, incorporating few-shot templates and formatting constraints',
    status: 'connected',
    riskLevel: 'LOW_RISK',
  },
];

export const FUTURE_INTEGRATIONS = [
  { name: 'Google Drive', category: 'Cloud Storage', status: 'Not connected', icon: 'HardDrive' },
  { name: 'Gmail', category: 'Communication', status: 'Not connected', icon: 'Mail' },
  { name: 'Google Calendar', category: 'Scheduling', status: 'Not connected', icon: 'Calendar' },
  { name: 'GitHub', category: 'Version Control', status: 'Not connected', icon: 'GitBranch' },
  { name: 'Discord', category: 'Team Chat', status: 'Not connected', icon: 'MessageSquare' },
  { name: 'Slack', category: 'Team Chat', status: 'Not connected', icon: 'Slack' },
  { name: 'Notion', category: 'Knowledge Base', status: 'Not connected', icon: 'BookOpen' },
  { name: 'HubSpot / CRM', category: 'Customer Relations', status: 'Not connected', icon: 'Users' },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file_web_audit',
    name: 'website-audit.md',
    size: '14.2 KB',
    type: 'text/markdown',
    extension: 'md',
    updatedAt: '10:45 AM Today',
    category: 'document',
    content: `# Website Performance & SEO Audit Report

## Executive Summary
Audit of Abdullah's Portfolio and Client Gateway indicates a strong 92/100 Core Web Vitals score.

### Key Metrics
- First Contentful Paint (FCP): 0.8s
- Largest Contentful Paint (LCP): 1.4s
- Cumulative Layout Shift (CLS): 0.02
- Accessibility Score: 98/100

### Priority Action Items
1. Enable AVIF/WebP image compression for project gallery.
2. Minify third-party analytics script payload.
3. Add OpenGraph tags for interactive previews.`,
    isGenerated: true,
  },
  {
    id: 'file_customer_feedback',
    name: 'customer-feedback.csv',
    size: '32.8 KB',
    type: 'text/csv',
    extension: 'csv',
    updatedAt: '09:20 AM Today',
    category: 'data',
    content: `Customer_ID,Name,Satisfaction_Score,Feedback_Category,Comments
CUST-101,Rahim Ahmed,4.8,Support,"Very fast response on our order dispatch issue."
CUST-102,Farhana Karim,5.0,Product,"The updated UI workflow saved our team 4 hours weekly."
CUST-103,Tanvir Hasan,3.2,Delivery,"Tracking information was delayed by 3 hours."
CUST-104,Nadia Sultana,4.9,Pricing,"Exceptional value for agency work automation."`,
  },
  {
    id: 'file_order_script',
    name: 'order-processing.js',
    size: '8.4 KB',
    type: 'application/javascript',
    extension: 'js',
    updatedAt: '08:50 AM Today',
    category: 'code',
    content: `// Client order verification service
async function processClientOrder(orderId, customerPayload) {
  // Potential unhandled exception: no try/catch wrapper
  const inventoryCheck = await queryInventory(orderId);
  
  if (inventoryCheck.available) {
    // Missing validation on customer email format
    const invoice = generateInvoice(orderId, customerPayload.price);
    await dispatchNotification(customerPayload.email, invoice);
    return { status: "processed", invoiceId: invoice.id };
  } else {
    // Missing rollback on partial inventory reservations
    return { status: "out_of_stock" };
  }
}`,
  },
  {
    id: 'file_product_spec',
    name: 'product-spec.json',
    size: '6.1 KB',
    type: 'application/json',
    extension: 'json',
    updatedAt: 'Yesterday',
    category: 'data',
    content: `{
  "productId": "AGENT-PRO-2026",
  "name": "Agent-sigma08 Autonomous Operating System",
  "version": "3.8.0-flash",
  "features": [
    "Full-stack agentic execution",
    "Multi-step safe task planning",
    "Permission gatekeeper for sensitive actions",
    "Dual language support (Bangla & English)"
  ],
  "securityTier": "Enterprise Strict"
}`,
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task_001',
    title: 'Analyze my website project',
    description: 'Perform complete Core Web Vitals, accessibility, and SEO audit on current web app assets.',
    status: 'Completed',
    priority: 'High',
    category: 'SEO & Performance',
    tags: ['#SEO', '#Performance', '#CoreWebVitals', '#Audit', '#Accessibility'],
    collaborators: [
      {
        id: 'collab_user',
        name: 'PC Hamza (You)',
        email: 'pchamza2025@gmail.com',
        role: 'Owner',
        status: 'online',
        isCurrentUser: true,
        invitedAt: '10:00 AM Today',
        lastActive: 'Just now',
      },
      {
        id: 'collab_sarah',
        name: 'Sarah Rahman',
        email: 'sarah.seo@agency.dev',
        role: 'Editor',
        status: 'active',
        invitedAt: '10:15 AM Today',
        lastActive: '2m ago',
      },
      {
        id: 'collab_tariq',
        name: 'Tariq Al-Amin',
        email: 'tariq.qa@devteam.io',
        role: 'Viewer',
        status: 'offline',
        invitedAt: '10:20 AM Today',
        lastActive: '1h ago',
      },
    ],
    aiAnalysis: {
      category: 'SEO & Performance',
      tags: ['#SEO', '#Performance', '#CoreWebVitals', '#Audit', '#Accessibility'],
      suggestedPriority: 'High',
      estimatedHours: 3.5,
      analysisSummary: 'Full-stack audit detecting DOM performance bottlenecks and Web Vitals metrics.',
      keySkills: ['Lighthouse', 'Web Performance', 'Accessibility WCAG', 'SEO'],
      confidence: 0.96,
    },
    dueDate: '11:00 AM Today',
    dueDateTimeStamp: Date.now() + 3600000,
    reminderTime: '10:30 AM Today',
    reminderTimeStamp: Date.now() + 1800000,
    actualDurationMinutes: 195,
    completedAt: '10:45 AM Today',
    completedTimeStamp: Date.now() - 300000,
    createdTime: '10:42 AM Today',
    createdTimeStamp: Date.now() - 11700000,
    updatedTime: '10:45 AM Today',
    progress: 100,
    requiredTools: ['Read File', 'Analyze File', 'Web Search'],
    approvalStatus: 'None',
    result: 'Audit completed. Score 92/100. Generated "website-audit.md" with prioritized recommendations.',
    subTasks: [
      {
        id: 'subtask_101',
        title: 'Audit desktop & mobile Lighthouse scores',
        description: 'Verify FCP, LCP, CLS and FID metrics',
        status: 'Completed',
        priority: 'High',
        completed: true,
        createdTime: '10:42 AM',
      },
      {
        id: 'subtask_102',
        title: 'Extract uncompressed image and font assets',
        description: 'Target large PNGs and suggest WebP conversion',
        status: 'Completed',
        priority: 'Medium',
        completed: true,
        createdTime: '10:43 AM',
      },
      {
        id: 'subtask_103',
        title: 'Generate markdown deliverable website-audit.md',
        description: 'Document prioritized recommendations',
        status: 'Completed',
        priority: 'Low',
        completed: true,
        createdTime: '10:44 AM',
      },
    ],
    planSteps: [
      { title: '🌐 লাইভ ওয়েব বেঞ্চমার্ক ও অডিট ফ্রেমওয়ার্ক সংগ্রহ', status: 'completed' },
      { title: 'Understanding request & goals', status: 'completed' },
      { title: 'Checking available project assets', status: 'completed' },
      { title: 'Analyzing web vitals against live standards', status: 'completed' },
      { title: 'Preparing report & deliverables', status: 'completed' },
    ],
    groundingMetadata: {
      searchQueries: ['Core Web Vitals 2026 performance benchmarks', 'Web accessibility WCAG 2.1 guidelines'],
      sources: [
        { title: 'Web.dev Performance Metrics', url: 'https://web.dev/vitals/', domain: 'web.dev' },
        { title: 'W3C Accessibility Standards', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', domain: 'w3.org' }
      ]
    },
    webInformationGathered: {
      searchQueries: ['Core Web Vitals 2026 performance benchmarks', 'Web accessibility WCAG 2.1 guidelines'],
      sources: [
        { title: 'Web.dev Performance Metrics', url: 'https://web.dev/vitals/', domain: 'web.dev' },
        { title: 'W3C Accessibility Standards', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', domain: 'w3.org' }
      ],
      summaryPoints: [
        'Collected LCP and INP benchmark requirements from web.dev',
        'Verified WCAG 2.1 color contrast compliance rules'
      ]
    }
  },
  {
    id: 'task_002',
    title: 'Draft a reply to this customer',
    description: 'Synthesize empathetic reply for Customer Tanvir Hasan regarding delivery tracking delay.',
    status: 'Waiting for Approval',
    priority: 'Urgent',
    category: 'Customer Support & CRM',
    tags: ['#CustomerSupport', '#CRM', '#EmailDraft', '#Urgent', '#Communication'],
    collaborators: [
      {
        id: 'collab_user',
        name: 'PC Hamza (You)',
        email: 'pchamza2025@gmail.com',
        role: 'Owner',
        status: 'online',
        isCurrentUser: true,
        invitedAt: '10:40 AM Today',
        lastActive: 'Just now',
      },
      {
        id: 'collab_tanvir_cx',
        name: 'Tanvir Support Lead',
        email: 'tanvir.cx@support.com',
        role: 'Assignee',
        status: 'active',
        invitedAt: '10:45 AM Today',
        lastActive: '1m ago',
      },
    ],
    aiAnalysis: {
      category: 'Customer Support & CRM',
      tags: ['#CustomerSupport', '#CRM', '#EmailDraft', '#Urgent', '#Communication'],
      suggestedPriority: 'Urgent',
      estimatedHours: 1.5,
      analysisSummary: 'Empathetic client communication requiring human validation before SMTP dispatch.',
      keySkills: ['Customer Experience', 'Copywriting', 'CRM Resolution'],
      confidence: 0.94,
    },
    dueDate: '11:45 AM Today',
    dueDateTimeStamp: Date.now() + 2700000,
    reminderTime: '11:30 AM Today',
    reminderTimeStamp: Date.now() + 1800000,
    smartReminderConfig: {
      enabled: true,
      predictedDurationMinutes: 60,
      suggestedDueDate: new Date(Date.now() + 2700000).toISOString(),
      suggestedReminderDate: new Date(Date.now() + 1800000).toISOString(),
      reminderOffsetMinutes: 15,
      autoScheduled: true,
      reminderStatus: 'pending',
      historicalBasis: {
        similarTasksCount: 4,
        averageCompletionMinutes: 55,
        categoryBaselineHours: 1.0,
        matchingFactors: ['Domain: Customer Support & CRM', 'Urgent speed factor (0.65x)', 'Empathetic reply template'],
        confidenceScore: 0.95
      }
    },
    createdTime: '10:46 AM Today',
    createdTimeStamp: Date.now() - 3600000,
    updatedTime: '10:46 AM Today',
    progress: 85,
    requiredTools: ['Read File', 'Create Marketing Copy'],
    approvalStatus: 'Pending',
    result: 'Drafted professional response. Stoppped execution for human review prior to sending.',
    subTasks: [
      {
        id: 'subtask_201',
        title: 'Retrieve CRM customer purchase record',
        description: 'Verify tracking number and estimated dispatch time',
        status: 'Completed',
        priority: 'Urgent',
        completed: true,
        createdTime: '10:46 AM',
      },
      {
        id: 'subtask_202',
        title: 'Draft empathetic delay response with 15% discount',
        description: 'Include courtesy credit in next billing cycle',
        status: 'Completed',
        priority: 'High',
        completed: true,
        createdTime: '10:46 AM',
      },
      {
        id: 'subtask_203',
        title: 'Await human approval before external SMTP dispatch',
        description: 'Pending user confirmation in Approvals panel',
        status: 'Pending',
        priority: 'Urgent',
        completed: false,
        createdTime: '10:46 AM',
      },
    ],
    planSteps: [
      { title: 'Analyzing customer message', status: 'completed' },
      { title: 'Identifying intent & urgency', status: 'completed' },
      { title: 'Drafting response', status: 'completed' },
      { title: 'Waiting for approval', status: 'running' },
    ],
  },
  {
    id: 'task_003',
    title: 'Find problems in this JavaScript code',
    description: 'Scan order-processing.js for race conditions, unhandled rejections, and missing validations.',
    status: 'Running',
    priority: 'Medium',
    category: 'Backend & Infrastructure',
    tags: ['#JavaScript', '#Debugging', '#Backend', '#CodeQuality', '#Refactoring'],
    collaborators: [
      {
        id: 'collab_user',
        name: 'PC Hamza (You)',
        email: 'pchamza2025@gmail.com',
        role: 'Owner',
        status: 'online',
        isCurrentUser: true,
        invitedAt: '10:48 AM Today',
        lastActive: 'Just now',
      },
      {
        id: 'collab_dev_alex',
        name: 'Alex Chen',
        email: 'alex.chen@cloudstack.dev',
        role: 'Editor',
        status: 'busy',
        invitedAt: '10:50 AM Today',
        lastActive: '5m ago',
      },
      {
        id: 'collab_maria',
        name: 'Maria S.',
        email: 'maria.backend@node.org',
        role: 'Assignee',
        status: 'active',
        invitedAt: '10:52 AM Today',
        lastActive: 'Just now',
      },
    ],
    aiAnalysis: {
      category: 'Backend & Infrastructure',
      tags: ['#JavaScript', '#Debugging', '#Backend', '#CodeQuality', '#Refactoring'],
      suggestedPriority: 'Medium',
      estimatedHours: 2.0,
      analysisSummary: 'Static AST scan finding async race conditions and missing validation traps.',
      keySkills: ['JavaScript', 'Node.js', 'Async/Await', 'Jest'],
      confidence: 0.98,
    },
    dueDate: '01:30 PM Today',
    dueDateTimeStamp: Date.now() + 7200000,
    reminderTime: '01:00 PM Today',
    reminderTimeStamp: Date.now() + 5400000,
    smartReminderConfig: {
      enabled: true,
      predictedDurationMinutes: 120,
      suggestedDueDate: new Date(Date.now() + 7200000).toISOString(),
      suggestedReminderDate: new Date(Date.now() + 5400000).toISOString(),
      reminderOffsetMinutes: 30,
      autoScheduled: true,
      reminderStatus: 'pending',
      historicalBasis: {
        similarTasksCount: 3,
        averageCompletionMinutes: 125,
        categoryBaselineHours: 2.0,
        matchingFactors: ['Category: Backend & Code Quality', '3 nested sub-tasks (+54m buffer)'],
        confidenceScore: 0.94
      }
    },
    createdTime: '10:48 AM Today',
    createdTimeStamp: Date.now() - 1800000,
    updatedTime: '10:48 AM Today',
    progress: 60,
    requiredTools: ['Analyze Code', 'Debug Code'],
    approvalStatus: 'None',
    subTasks: [
      {
        id: 'subtask_301',
        title: 'Scan order-processing.js for race conditions',
        description: 'Identified unhandled rejection in async checkout loop',
        status: 'Completed',
        priority: 'High',
        completed: true,
        createdTime: '10:48 AM',
      },
      {
        id: 'subtask_302',
        title: 'Add try-catch wrapped async transaction handler',
        description: 'Ensure DB rollbacks on payment gateway timeouts',
        status: 'In Progress',
        priority: 'High',
        completed: false,
        createdTime: '10:49 AM',
      },
      {
        id: 'subtask_303',
        title: 'Write Jest integration test suites',
        description: 'Cover timeout edge cases and network retries',
        status: 'Pending',
        priority: 'Medium',
        completed: false,
        createdTime: '10:50 AM',
      },
    ],
    planSteps: [
      { title: '🌐 সার্চিং Node.js async/await best practices', status: 'completed' },
      { title: 'Scanning AST tree', status: 'completed' },
      { title: 'Checking error handling', status: 'completed' },
      { title: 'Drafting refactored code', status: 'running' },
      { title: 'Generating test suite', status: 'pending' },
    ],
  },
  {
    id: 'task_004',
    title: 'Research modern portfolio website trends',
    description: 'Gather verified design trends, typography pairings, and interaction benchmarks for 2026.',
    status: 'Completed',
    priority: 'Medium',
    category: 'Research & Strategy',
    tags: ['#Research', '#WebTrends', '#DesignSystems', '#Portfolio'],
    aiAnalysis: {
      category: 'Research & Strategy',
      tags: ['#Research', '#WebTrends', '#DesignSystems', '#Portfolio'],
      suggestedPriority: 'Medium',
      estimatedHours: 2.0,
      analysisSummary: 'Strategic design research and modern interaction benchmarks synthesis.',
      keySkills: ['Design Systems', 'Market Research', 'Interaction Design'],
      confidence: 0.95,
    },
    dueDate: '09:30 AM Today',
    dueDateTimeStamp: Date.now() - 7200000,
    actualDurationMinutes: 115,
    completedAt: '09:22 AM Today',
    completedTimeStamp: Date.now() - 7600000,
    createdTime: '09:15 AM Today',
    createdTimeStamp: Date.now() - 14500000,
    updatedTime: '09:22 AM Today',
    progress: 100,
    requiredTools: ['Web Search', 'Extract Information'],
    approvalStatus: 'None',
    result: 'Researched 12 leading design systems. Highlighted dark neo-minimalism, high-contrast serif/sans pairings, and AI copilot integrations.',
    subTasks: [
      {
        id: 'subtask_401',
        title: 'Harvest Awwwards & Godly 2026 inspiration sites',
        description: 'Scrape design patterns and typography hierarchies',
        status: 'Completed',
        priority: 'Medium',
        completed: true,
        createdTime: '09:16 AM',
      },
      {
        id: 'subtask_402',
        title: 'Synthesize dark-mode neo-brutalist interaction standards',
        description: 'Highlight micro-interactions, glassmorphism, and accent glows',
        status: 'Completed',
        priority: 'Low',
        completed: true,
        createdTime: '09:20 AM',
      },
    ],
    planSteps: [
      { title: '🌐 লাইভ ওয়েব সার্চ ও ট্রেন্ড ইন্টেলিজেন্স সংগ্রহ', status: 'completed' },
      { title: 'Querying design sources', status: 'completed' },
      { title: 'Extracting key takeaways', status: 'completed' },
      { title: 'Formatting research summary', status: 'completed' },
    ],
    groundingMetadata: {
      searchQueries: ['Modern portfolio design trends 2026', 'Awwwards site of the day typography'],
      sources: [
        { title: 'Awwwards Design Trends', url: 'https://www.awwwards.com', domain: 'awwwards.com' },
        { title: 'Godly - Curated Web Design', url: 'https://godly.website', domain: 'godly.website' }
      ]
    },
    webInformationGathered: {
      searchQueries: ['Modern portfolio design trends 2026', 'Awwwards site of the day typography'],
      sources: [
        { title: 'Awwwards Design Trends', url: 'https://www.awwwards.com', domain: 'awwwards.com' },
        { title: 'Godly - Curated Web Design', url: 'https://godly.website', domain: 'godly.website' }
      ],
      summaryPoints: [
        'Collected trends from 12+ award-winning design portfolios',
        'Gathered interactive micro-interaction and spring physics standards'
      ]
    }
  },
  {
    id: 'task_005',
    title: 'Create a professional product description',
    description: 'Write conversion-focused copy highlighting automated work workflows for the AI Agent.',
    status: 'Planning',
    priority: 'Low',
    category: 'Operations & Workflow',
    tags: ['#ProductCopy', '#Marketing', '#Branding', '#Automation'],
    aiAnalysis: {
      category: 'Operations & Workflow',
      tags: ['#ProductCopy', '#Marketing', '#Branding', '#Automation'],
      suggestedPriority: 'Low',
      estimatedHours: 1.5,
      analysisSummary: 'Product conversion copy crafting with multi-tier value matrices.',
      keySkills: ['Copywriting', 'Product Positioning', 'Marketing'],
      confidence: 0.92,
    },
    dueDate: '03:15 PM Today',
    dueDateTimeStamp: Date.now() + 14400000,
    reminderTime: '02:30 PM Today',
    reminderTimeStamp: Date.now() + 11700000,
    smartReminderConfig: {
      enabled: true,
      predictedDurationMinutes: 105,
      suggestedDueDate: new Date(Date.now() + 14400000).toISOString(),
      suggestedReminderDate: new Date(Date.now() + 11700000).toISOString(),
      reminderOffsetMinutes: 45,
      autoScheduled: true,
      reminderStatus: 'pending',
      historicalBasis: {
        similarTasksCount: 2,
        averageCompletionMinutes: 90,
        categoryBaselineHours: 1.3,
        matchingFactors: ['Category: Operations & Workflow', 'Low priority buffer (1.35x)'],
        confidenceScore: 0.89
      }
    },
    createdTime: '10:50 AM Today',
    createdTimeStamp: Date.now() - 900000,
    updatedTime: '10:50 AM Today',
    progress: 20,
    requiredTools: ['Create Product Description', 'Format Document'],
    approvalStatus: 'None',
    subTasks: [
      {
        id: 'subtask_501',
        title: 'Define value matrix for autonomous agent system',
        description: 'Highlight time-savings and safety checkpoints',
        status: 'Pending',
        priority: 'Medium',
        completed: false,
        createdTime: '10:50 AM',
      },
      {
        id: 'subtask_502',
        title: 'Craft 3 variations of call-to-action hooks',
        description: 'Test high-converting B2B punchlines',
        status: 'Pending',
        priority: 'Low',
        completed: false,
        createdTime: '10:51 AM',
      },
    ],
    planSteps: [
      { title: '🌐 মার্কেট কপিরাইটিং বেঞ্চমার্ক সংগ্রহ', status: 'completed' },
      { title: 'Analyzing target audience', status: 'completed' },
      { title: 'Structuring value propositions', status: 'running' },
      { title: 'Refining tone & call-to-actions', status: 'pending' },
    ],
    groundingMetadata: {
      searchQueries: ['High converting B2B SaaS product descriptions examples', 'AI agent landing page copy'],
      sources: [
        { title: 'SaaS Copywriting Playbook', url: 'https://copyhackers.com', domain: 'copyhackers.com' }
      ]
    }
  },
  {
    id: 'task_006',
    title: 'Develop responsive dark dashboard layout',
    description: 'Build modern Tailwind-based dashboard panels with responsive breakpoints and chart widgets.',
    status: 'Completed',
    priority: 'High',
    category: 'Frontend & UI/UX',
    tags: ['#Frontend', '#React', '#TailwindCSS', '#UIUX', '#Dashboard'],
    aiAnalysis: {
      category: 'Frontend & UI/UX',
      tags: ['#Frontend', '#React', '#TailwindCSS', '#UIUX', '#Dashboard'],
      suggestedPriority: 'High',
      estimatedHours: 2.5,
      analysisSummary: 'Responsive frontend component design with dark aesthetic and micro-interactions.',
      keySkills: ['React', 'Tailwind CSS', 'UI Design', 'Recharts'],
      confidence: 0.97,
    },
    dueDate: 'Yesterday, 5:00 PM',
    dueDateTimeStamp: Date.now() - 86400000,
    actualDurationMinutes: 140,
    completedAt: 'Yesterday, 4:45 PM',
    completedTimeStamp: Date.now() - 87300000,
    createdTime: 'Yesterday, 2:25 PM',
    createdTimeStamp: Date.now() - 95700000,
    updatedTime: 'Yesterday, 4:45 PM',
    progress: 100,
    requiredTools: ['Generate Code', 'Design Concepts'],
    approvalStatus: 'None',
    result: 'Completed responsive dashboard with 100% test coverage and smooth transitions.',
  },
  {
    id: 'task_007',
    title: 'Build automated Gemini agent multi-step planner',
    description: 'Implement multi-stage planning engine with safety permission gates and grounding metadata.',
    status: 'Completed',
    priority: 'High',
    category: 'AI & Automation',
    tags: ['#AI', '#Gemini', '#Automation', '#LLM', '#SmartAgents'],
    aiAnalysis: {
      category: 'AI & Automation',
      tags: ['#AI', '#Gemini', '#Automation', '#LLM', '#SmartAgents'],
      suggestedPriority: 'High',
      estimatedHours: 3.0,
      analysisSummary: 'Agentic reasoning loop and autonomous planning with tool execution.',
      keySkills: ['Gemini API', 'TypeScript', 'Prompt Engineering'],
      confidence: 0.98,
    },
    dueDate: 'Yesterday, 1:00 PM',
    dueDateTimeStamp: Date.now() - 100800000,
    actualDurationMinutes: 175,
    completedAt: 'Yesterday, 12:55 PM',
    completedTimeStamp: Date.now() - 101100000,
    createdTime: 'Yesterday, 10:00 AM',
    createdTimeStamp: Date.now() - 111600000,
    updatedTime: 'Yesterday, 12:55 PM',
    progress: 100,
    requiredTools: ['Analyze Code', 'Web Search'],
    approvalStatus: 'None',
    result: 'Successfully architected multi-step planner with explainable reasoning traces.',
  }
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr_001',
    taskId: 'task_002',
    action: 'Send Customer Reply',
    recipient: 'Tanvir Hasan (tanvir.h@example.com)',
    details: 'Send drafted message regarding delivery tracking resolution to customer.',
    preview: `Dear Tanvir Hasan,

Thank you for contacting Agent-sigma08 AI Services. We sincerely apologize for the delay in providing your tracking code. 

Our logistics team has verified that your package is currently in transit and scheduled for delivery before 4:00 PM today. We have also credited 15% towards your next monthly billing cycle as a courtesy.

Warm regards,
Agent-sigma08 AI Work Operations`,
    riskLevel: 'REQUIRES_APPROVAL',
    riskReason: 'External communication with real client',
    status: 'pending',
    timestamp: '10:46 AM Today',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_005',
    timestamp: '10:46 AM',
    action: 'Approval Requested',
    tool: 'Permission Gatekeeper',
    result: 'Halted dispatch of customer message to Tanvir Hasan. Awaiting user consent.',
    status: 'pending',
    details: 'External client communication',
  },
  {
    id: 'act_004',
    timestamp: '10:45 AM',
    action: 'Generated Report',
    tool: 'Create File (DOCUMENT_TOOLS)',
    result: 'Persisted "website-audit.md" with 92/100 performance score and recommendations.',
    status: 'success',
  },
  {
    id: 'act_003',
    timestamp: '10:44 AM',
    action: 'Analyzed Project',
    tool: 'Analyze File (FILE_TOOLS)',
    result: 'Parsed core web assets, evaluated Core Web Vitals, and identified asset minification targets.',
    status: 'success',
  },
  {
    id: 'act_002',
    timestamp: '10:43 AM',
    action: 'Read Workspace Files',
    tool: 'Read File (FILE_TOOLS)',
    result: 'Successfully indexed 4 local files for project contextualization.',
    status: 'success',
  },
  {
    id: 'act_001',
    timestamp: '10:42 AM',
    action: 'Agent Started Task',
    tool: 'AI Work Orchestrator',
    result: 'Task "Analyze my website project" initiated by user instruction.',
    status: 'success',
  },
];

export const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'msg_welcome',
    sender: 'agent',
    text: `## Objective
Welcome! I am **Agent-sigma08**, your personal AI work operating system powered by Gemini.

## Plan
- Understand natural language instructions and construct autonomous execution pipelines.
- Deploy authorized workspace tools across files, web intelligence, document drafting, and code auditing.
- Run verification checks and synthesize verified operational reports.
- Guard sensitive actions (external client messaging, database writes, asset deletions) behind strict approval checkpoints.

## Verification
Workspace online. All tools armed and ready. Select any quick action or enter your instructions below.`,
    timestamp: '10:40 AM',
    planSteps: [
      { title: 'System initialized & ready', status: 'completed' },
      { title: 'Workspace tools connected', status: 'completed' },
      { title: 'Permission gatekeeper active', status: 'completed' },
    ],
  },
];
