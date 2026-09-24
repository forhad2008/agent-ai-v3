export type TaskStatus = 
  | 'Pending' 
  | 'Planning' 
  | 'Running' 
  | 'Waiting for Approval' 
  | 'Completed' 
  | 'Failed' 
  | 'Cancelled';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type RiskLevel = 'LOW_RISK' | 'REQUIRES_APPROVAL';

export type ToolCategory = 
  | 'FILE_TOOLS' 
  | 'WEB_TOOLS' 
  | 'CODE_TOOLS' 
  | 'DOCUMENT_TOOLS' 
  | 'DATA_TOOLS' 
  | 'CREATIVE_TOOLS';

export interface PlanStep {
  title: string;
  status: 'completed' | 'running' | 'pending';
  description?: string;
  subGoals?: string[];
  durationMs?: number;
}

export interface SubTaskItem {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: TaskPriority;
  createdTime?: string;
  completed?: boolean;
}

export interface ThoughtProcessRecord {
  id: string;
  timestamp: string;
  query: string;
  language: string;
  status: 'reasoning' | 'planning' | 'executing' | 'completed' | 'idle';
  phase: 'Goal Understanding' | 'Deep Reasoning' | 'Risk Evaluation' | 'Tool Orchestration' | 'Synthesis & Verification';
  reasoningNotes: string[];
  subGoals: { id: string; title: string; status: 'completed' | 'in_progress' | 'pending' }[];
  planSteps: PlanStep[];
  toolsUsed: string[];
  confidenceScore: number;
  thinkingRaw?: string;
  memoryRecalled?: {
    user: string;
    role: string;
    goals: string;
    techStack: string;
  };
  webInformationGathered?: {
    searchQueries: string[];
    sources: { title: string; url: string; domain?: string }[];
    summaryPoints?: string[];
  };
}

export interface ToolExecutionRecord {
  id?: string;
  toolName: string;
  category: ToolCategory | string;
  status: 'success' | 'running' | 'failed' | 'idle';
  description: string;
  timestamp?: string;
}

export type NotificationType = 
  | 'task_started' 
  | 'task_working'
  | 'task_completed' 
  | 'task_progress' 
  | 'smart_reminder'
  | 'task_reminder'
  | 'web_gathering' 
  | 'tool_executed' 
  | 'approval_required' 
  | 'alarm_alert' 
  | 'system';

export interface AgentNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isoTime: string;
  taskId?: string;
  taskTitle?: string;
  read: boolean;
  webSources?: { title: string; url: string; domain?: string }[];
  toolName?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  resultSummary?: string;
  dueDate?: string;
  reminderOffsetMinutes?: number;
}

export interface SimilarHistoricalTaskSample {
  id: string;
  title: string;
  category?: string;
  priority?: TaskPriority;
  actualDurationMinutes: number;
  completedAt?: string;
  onTime?: boolean;
}

export interface SmartReminderHistoricalBasis {
  similarTasksCount: number;
  averageCompletionMinutes: number;
  categoryBaselineHours: number;
  matchingFactors: string[];
  confidenceScore: number;
  similarTasksSample?: SimilarHistoricalTaskSample[];
}

export interface SmartReminderConfig {
  enabled: boolean;
  predictedDurationMinutes: number;
  suggestedDueDate: string;
  suggestedReminderDate: string;
  reminderOffsetMinutes: number;
  reminderNote?: string;
  autoScheduled: boolean;
  historicalBasis?: SmartReminderHistoricalBasis;
  reminderStatus?: 'pending' | 'sent' | 'dismissed' | 'snoozed';
  snoozeUntil?: string;
}

export interface TaskAiAnalysisResult {
  category: string;
  tags: string[];
  suggestedPriority?: TaskPriority;
  estimatedHours?: number;
  subTasksSuggestion?: { title: string; priority: TaskPriority; description?: string }[];
  analysisSummary?: string;
  keySkills?: string[];
  confidence?: number;
  smartReminder?: SmartReminderConfig;
}

export type CollaboratorRole = 'Owner' | 'Editor' | 'Viewer' | 'Assignee';

export type CollaboratorPresence = 'online' | 'active' | 'busy' | 'offline';

export interface TaskCollaborator {
  id: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  avatar?: string;
  status: CollaboratorPresence;
  invitedAt?: string;
  lastActive?: string;
  isCurrentUser?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  tags?: string[];
  aiAnalysis?: TaskAiAnalysisResult;
  dueDate?: string;
  dueDateTimeStamp?: number;
  reminderTime?: string;
  reminderTimeStamp?: number;
  reminderTriggered?: boolean;
  smartReminderConfig?: SmartReminderConfig;
  collaborators?: TaskCollaborator[];
  completedAt?: string;
  completedTimeStamp?: number;
  actualDurationMinutes?: number;
  createdTime: string;
  createdTimeStamp?: number;
  updatedTime: string;
  progress: number;
  requiredTools: string[];
  approvalStatus: 'None' | 'Pending' | 'Approved' | 'Rejected';
  result?: string;
  planSteps?: PlanStep[];
  subTasks?: SubTaskItem[];
  error?: string;
  groundingMetadata?: {
    searchQueries?: string[];
    sources?: { title: string; url: string; domain?: string; platform?: string; category?: string }[];
  };
  webInformationGathered?: {
    searchQueries: string[];
    sources?: { title: string; url: string; domain?: string; platform?: string; category?: string }[];
    summaryPoints?: string[];
  };
}

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  status: 'connected' | 'idle' | 'executing' | 'error' | 'not_connected';
  riskLevel: RiskLevel;
  isIntegration?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  extension: string;
  updatedAt: string;
  category: 'code' | 'document' | 'data' | 'image' | 'other';
  content?: string;
  isGenerated?: boolean;
}

export interface ApprovalRequest {
  id: string;
  taskId?: string;
  action: string;
  recipient: string;
  details: string;
  preview?: string;
  riskLevel: 'REQUIRES_APPROVAL';
  riskReason: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  action: string;
  tool: string;
  result: string;
  status: 'success' | 'warning' | 'pending' | 'failed';
  approvalStatus?: 'approved' | 'rejected' | 'not_required' | 'pending';
  details?: string;
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  planSteps?: PlanStep[];
  toolExecutions?: ToolExecutionRecord[];
  groundingMetadata?: {
    searchQueries?: string[];
    sources?: { title: string; url: string; domain?: string; platform?: string; category?: string }[];
  };
  requiresApproval?: boolean;
  approvalDetails?: ApprovalRequest;
  attachedFiles?: { name: string; size: string; type?: string }[];
  isThinking?: boolean;
  thinkingText?: string;
  error?: {
    failed: string;
    reason: string;
    completed: string;
    next: string;
  };
  isDeleted?: boolean;
  deletedType?: 'me' | 'everyone';
  reactions?: string[];
  isPinned?: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  company: string;
  email: string;
  bio: string;
  goals: string;
  preferences: string;
  techStack: string;
  customAgentInstructions: string;
  profileImage?: string;
}

export interface SettingsState {
  agentName: string;
  language: string;
  aiBehavior: 'autonomous' | 'semi-autonomous' | 'strict-approval';
  permissionSensitivity: 'High' | 'Medium' | 'Low';
  safeMode: boolean;
  theme: 'dark-pro';
  notifications: boolean;
  autoApproveLowRisk: boolean;
  autoApproveEmail: boolean;
  autoApproveCalendar: boolean;
  autoApproveFiles: boolean;
  autoApproveResearch: boolean;
  dataRetentionDays: number;
  aiStatus: 'active' | 'busy' | 'idle';
}

export interface AlarmItem {
  id: string;
  time: string; // e.g. "16:00" or "04:00 PM"
  label: string;
  enabled: boolean;
  timestamp: number; // Scheduled timestamp in millisecond
}

export interface PlanGoalInput {
  goal: string;
  category: 'wealth_money' | 'fitness_body' | 'career_skill' | 'business_startup' | 'study_exam' | 'custom';
  currentStatus?: string;
  targetMetric?: string;
  timeframe?: string;
  dailyCommitment?: string;
  additionalInfo?: string;
  dietPreference?: string;
  experienceLevel?: string;
  budgetOrCapital?: string;
  currentWeight?: string;
  targetWeight?: string;
  height?: string;
  age?: string;
  gymAccess?: string;
  language?: string;
  userProfile?: UserProfile;
}

export interface GeneratedMasterPlan {
  id: string;
  title: string;
  category: string;
  executiveSummary: string;
  thinking: string;
  userAssessment: {
    baseline: string;
    target: string;
    timeline: string;
    feasibilityScore: string;
    keyVariablesRequired?: string[];
  };
  groundingMetadata?: {
    searchQueries?: string[];
    sources?: { title: string; url: string; domain?: string; platform?: string; category?: string }[];
  };
  phases: {
    phaseNumber: number;
    phaseTitle: string;
    duration: string;
    focus: string;
    keyDeliverables: string[];
    actionItems: { task: string; priority: TaskPriority; description?: string }[];
  }[];
  dailyChecklist: string[];
  scientificOrMarketBenchmarks: string[];
  risksAndMitigations: { risk: string; mitigation: string }[];
  recommendedResources: { title: string; url: string; description?: string }[];
  planSteps: PlanStep[];
  formattedMarkdown?: string;
}

export type VoiceIntentType =
  | 'navigate'
  | 'create_task'
  | 'search'
  | 'ask_agent'
  | 'execute_tool'
  | 'manage_notifications'
  | 'manage_alarm'
  | 'system_control'
  | 'help'
  | 'unknown';

export type VoiceConfidenceLevel = 'high' | 'medium' | 'low';

export interface VoiceInterpretation {
  intent: VoiceIntentType;
  actionSummary: string;
  responseSpeech: string;
  parameters: Record<string, any>;
  confidence: number;
  confidenceLevel: VoiceConfidenceLevel;
  matchedEntity?: string;
  priority?: string;
}

export interface VoiceCommandRecord {
  id: string;
  transcript: string;
  intent: VoiceIntentType;
  actionSummary: string;
  responseSpeech?: string;
  timestamp: string;
  success: boolean;
  confidence?: number;
  confidenceLevel?: VoiceConfidenceLevel;
  parameters?: Record<string, any>;
  status?: 'pending_verification' | 'executed' | 'cancelled';
}

export interface VoiceCheatItem {
  phrase: string;
  intent: VoiceIntentType;
  description: string;
  category: 'Navigation' | 'Task Creation' | 'AI & Tools' | 'System & Audio';
}

export type GoalSentiment = 'Positive' | 'Neutral' | 'Needs Attention';

export interface UserGoalItem {
  text: string;
  sentiment: GoalSentiment;
}

export interface SessionContextMetadata {
  entities: string[];
  userGoals: (string | UserGoalItem)[];
  sentiment: 'positive' | 'neutral' | 'curious' | 'urgent' | 'frustrated' | 'motivated';
  activeTopic: string;
  lastUpdated: string;
}

