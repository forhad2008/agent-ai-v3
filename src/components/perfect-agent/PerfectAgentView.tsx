import React, { useState } from 'react';
import {
  Brain,
  Target,
  Wrench,
  Database,
  Cpu,
  RefreshCw,
  Eye,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Layers,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  Terminal,
  Zap,
  Check,
  Bot,
  UserCheck,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { sound } from '../../services/sound';

type LanguageMode = 'bn' | 'en' | 'dual';

interface Pillar {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  exampleBn: string;
  exampleEn: string;
  tools: string[];
  equationPart: 'Brain' | 'Planning' | 'Reasoning' | 'Tools' | 'Memory' | 'Actions' | 'Observation' | 'Adaptation' | 'Pipeline' | 'Safety';
}

const PILLARS: Pillar[] = [
  {
    id: 1,
    icon: Target,
    titleBn: 'Goal Understanding 🎯',
    titleEn: 'Goal Understanding 🎯',
    subtitleBn: 'ব্যবহারকারীর মূল লক্ষ্য অনুধাবন',
    subtitleEn: 'Discerning True Intent & Outcome',
    descriptionBn: 'AI Agent কেবল পৃষ্ঠস্থ প্রশ্ন বা টেক্সট পড়ে না—বরং ব্যবহারকারী আসলে কী অর্জন করতে চান তা গভীরভাবে বিশ্লেষণ করে এবং প্রেক্ষাপট অনুযায়ী লক্ষ্য স্থির করে।',
    descriptionEn: 'The agent analyzes what the user truly wants to accomplish beyond literal words, extracting business requirements, design aesthetics, and critical constraints.',
    exampleBn: 'যেমন: “আমার জন্য একটা restaurant website বানাও।” — Agent শুধু উত্তর না দিয়ে কাজের মূল লক্ষ্য (মেনু কার্ড, টেবিল বুকিং, ব্র্যান্ডিং ও অনলাইন অর্ডার) নির্ধারণ করে।',
    exampleEn: 'Example: "Build a restaurant website for me." — The agent identifies the full objective: menu showcase, table reservations, location map, online ordering, and appetizing visuals.',
    tools: ['Intent Extractor', 'Context Analyzer', 'Constraint Parser'],
    equationPart: 'Brain',
  },
  {
    id: 2,
    icon: GitBranch,
    titleBn: 'Planning 🧠',
    titleEn: 'Planning 🧠',
    subtitleBn: 'বড় কাজকে সুনির্দিষ্ট ধাপে বিভক্তকরণ',
    subtitleEn: 'Milestone & Step Decomposition',
    descriptionBn: 'জটিল ও বিশাল কোনো উদ্দেশ্যকে ক্রমানুসারে ছোট ছোট অর্জনযোগ্য মাইলফলক এবং ধাপে ভেঙে ফেলে যাতে কোনো অস্পষ্টতা ছাড়াই কাজ সম্পন্ন হয়।',
    descriptionEn: 'Deconstructs complex goals into sequential, verifiable phases with dependencies mapped out before executing any code or calling any API.',
    exampleBn: 'ধাপসমূহ: ১. Design তৈরি ➔ ২. Database স্কিমা ➔ ৩. Login & Auth সিস্টেম ➔ ৪. Payment Integration ➔ ৫. Testing & Verification',
    exampleEn: 'Steps: 1. UI/UX Design Mockup ➔ 2. Database Schema ➔ 3. Auth & Login ➔ 4. Payment Gateway ➔ 5. Automated Testing',
    tools: ['Phase Scheduler', 'Dependency Graph', 'Milestone Tracker'],
    equationPart: 'Planning',
  },
  {
    id: 3,
    icon: Compass,
    titleBn: 'Reasoning 🔍',
    titleEn: 'Reasoning 🔍',
    subtitleBn: 'যুক্তি ও সঠিক সমাধান নির্বাচন',
    subtitleEn: 'Cognitive Prioritization & Trade-offs',
    descriptionBn: 'কোন কাজটি আগে করতে হবে, কোন টেকনোলজি স্ট্যাক বেশি উপযোগী হবে এবং বিকল্প সমাধানগুলোর মধ্যে কোনটি সেরা—তা নিয়ে যৌক্তিক বিচার করে।',
    descriptionEn: 'Determines what must be done first, evaluates alternative solutions, handles technical trade-offs, and picks optimal architectures.',
    exampleBn: 'যেমন: “ডাটাবেস ছাড়া কি পেমেন্ট কাজ করবে?” Agent যুক্তি দিয়ে ডাটাবেসকে পেমেন্ট ও অথেন্টিকেশনের আগেই সম্পন্ন করার অগ্রাধিকার দেয়।',
    exampleEn: 'Example: Reasoning that persistent database tables must exist before Stripe webhook verification or user session storage can be wired.',
    tools: ['Logic Solver', 'Priority Engine', 'Risk Evaluator'],
    equationPart: 'Reasoning',
  },
  {
    id: 4,
    icon: Wrench,
    titleBn: 'Tool ব্যবহার করা 🛠️',
    titleEn: 'Tool Execution 🛠️',
    subtitleBn: 'বাস্তব জগতে AI-এর হাত ও পা',
    subtitleEn: 'The Agent’s Digital Hands & Legs',
    descriptionBn: 'AI Agent প্রয়োজন অনুযায়ী বিভিন্ন বাহ্যিক টুল ব্যবহার করতে পারে। শুধু চ্যাট নয়, বাস্তব দুনিয়ায় ডাটা পরিবর্তন ও কাজ সম্পাদনের মাধ্যম হলো Tools।',
    descriptionEn: 'AI Agents use specialized tools as their hands and legs in the software universe: Web Search, Database, APIs, Terminal, Code Runner, and File Manager.',
    exampleBn: 'টুলস: Web Search, Cloud Database, REST APIs, Code Execution, File Management, Automated Email, Browser Automation।',
    exampleEn: 'Tools: Web search, PostgreSQL / Firestore, REST APIs, Sandboxed Code Execution, File Storage, Automated Email, Browser Automation.',
    tools: ['Web Search', 'Database Query', 'Terminal Execution', 'File System', 'API Caller'],
    equationPart: 'Tools',
  },
  {
    id: 5,
    icon: Database,
    titleBn: 'Memory 🧠💾',
    titleEn: 'Memory System 🧠💾',
    subtitleBn: 'স্মৃতি ও ব্যবহারকারীর পছন্দ সংরক্ষণ',
    subtitleEn: 'Contextual & Long-Term Recall',
    descriptionBn: 'আগের তথ্য, সিদ্ধান্ত ও ব্যবহারকারীর পার্সোনাল পছন্দ মনে রেখে ভবিষ্যতের সমস্ত কাজকে আরও প্রাসঙ্গিক ও নিখুঁত করে তোলে।',
    descriptionEn: 'Retains working memory during multi-turn workflows and episodic long-term preferences across sessions to deliver tailored executions.',
    exampleBn: 'যেমন তুমি বললে: “আমার website-এ সবসময় black, white আর orange theme ব্যবহার করো।” পরবর্তীতে Agent প্রতিটি নতুন ফিচারে এই preference স্বয়ংক্রিয়ভাবে ব্যবহার করবে।',
    exampleEn: 'Example: "Always use a black, white, and orange theme for my projects." The agent remembers and enforces this preference on all future builds.',
    tools: ['Short-term Cache', 'Vector Memory', 'User Preference Store'],
    equationPart: 'Memory',
  },
  {
    id: 6,
    icon: Zap,
    titleBn: 'Autonomous Action ⚙️',
    titleEn: 'Autonomous Action ⚙️',
    subtitleBn: 'স্বয়ংক্রিয় কর্মক্ষমতা ও সীমাবদ্ধতা',
    subtitleEn: 'Proactive Execution Within Bounds',
    descriptionBn: 'ব্যবহারকারীর প্রতিটি ছোট ক্লিকের নির্দেশনার অপেক্ষায় না থেকে অনুমোদিত সীমার মধ্যে স্বয়ংক্রিয়ভাবে কাজ সম্পন্ন করে।',
    descriptionEn: 'Operates independently within safety boundaries without requiring micro-management for every minor terminal command or file edit.',
    exampleBn: 'যেমন তুমি বললে: “প্রতি সপ্তাহে আমার sales report তৈরি করো।” Agent নিজে data সংগ্রহ ➔ analyze ➔ চার্ট তৈরি ➔ চূড়ান্ত report বানিয়ে দেয়।',
    exampleEn: 'Example: "Generate my sales report every week." The agent autonomously fetches Stripe data ➔ analyzes conversion ➔ renders PDF report.',
    tools: ['Cron Scheduler', 'Background Worker', 'Autonomy Governor'],
    equationPart: 'Actions',
  },
  {
    id: 7,
    icon: Eye,
    titleBn: 'Observation 👀',
    titleEn: 'Observation & Loop 👀',
    subtitleBn: 'ফলাফল নিরীক্ষা ও স্ব-সংশোধন',
    subtitleEn: 'Feedback Verification & Self-Healing',
    descriptionBn: 'কাজ করার পর ফলাফল নিজে পরীক্ষা করে। ত্রুটি পেলে কারণ বিশ্লেষণ করে, কোড ঠিক করে এবং পুনরায় চালিয়ে যাচাই করে।',
    descriptionEn: 'Continuously inspects execution outputs. When an error occurs, it analyzes the stack trace, corrects the flaw, and re-executes automatically.',
    exampleBn: 'যেমন: Code লিখল ➔ Run করল ➔ Error পেল ➔ Error analyze করল ➔ Code ঠিক করল ➔ আবার Run করল! (Self-Healing Loop)',
    exampleEn: 'Loop: Write code ➔ Run in sandbox ➔ Detect syntax error ➔ Diagnose root cause ➔ Patch code ➔ Re-run and verify success!',
    tools: ['Output Inspector', 'Stacktrace Diagnoser', 'Auto-Repair Engine'],
    equationPart: 'Observation',
  },
  {
    id: 8,
    icon: RefreshCw,
    titleBn: 'Adaptation 🔄',
    titleEn: 'Adaptation 🔄',
    subtitleBn: 'পরিস্থিতি অনুযায়ী বিকল্প পথ গ্রহণ',
    subtitleEn: 'Dynamic Contingency & Pivot',
    descriptionBn: 'প্রথম পরিকল্পনা কাজ না করলে বা কোনো API ডাউন থাকলে থেমে না থেকে তাৎক্ষণিক বিকল্প অ্যাপ্রোচ বা অল্টারনেটিভ সার্ভিস গ্রহণ করতে পারে।',
    descriptionEn: 'If Plan A encounters a barrier or an external API is rate-limited, the agent intelligently falls back to an alternative solution without halting.',
    exampleBn: 'যেমন: কোনো নির্দিষ্ট লাইব্রেরি ইনস্টল না হলে সমমানের অন্য প্যাকেজ ব্যবহার করে কিংবা লোকাল মক ফাংশন তৈরি করে লক্ষ্য বজায় রাখে।',
    exampleEn: 'Example: If a third-party weather API fails, pivots to an alternative satellite feed or fallback sensor cache to fulfill the user’s request.',
    tools: ['Fallback Router', 'Dynamic Strategy Engine', 'Heuristic Switcher'],
    equationPart: 'Adaptation',
  },
  {
    id: 9,
    icon: Layers,
    titleBn: 'Multi-step Task Handling 🔗',
    titleEn: 'Multi-step Task Handling 🔗',
    subtitleBn: 'একটি নির্দেশে একাধিক সংযুক্ত কাজ',
    subtitleEn: 'Cascading Workflow Pipelines',
    descriptionBn: 'একটিমাত্র সাধারণ কমান্ড থেকে শুরু করে স্বয়ংক্রিয়ভাবে বহু আন্তঃসংযুক্ত ধাপ সম্পূর্ণ করে চূড়ান্ত আউটপুট তৈরি করতে পারে।',
    descriptionEn: 'Chains multiple disparate operational steps together from a single high-level command into a coherent production-ready result.',
    exampleBn: 'যেমন: “অনলাইন স্টোরে নতুন product যোগ করো।” Agent: Product info ➔ Image তৈরি ➔ Database সংরক্ষণ ➔ Website পেজ ➔ Inventory আপডেট ➔ Confirmation।',
    exampleEn: 'Example: "Add new product to online store." Agent: Product copy ➔ Asset generation ➔ DB insert ➔ Storefront sync ➔ Inventory ➔ Confirmation.',
    tools: ['Pipeline Orchestrator', 'Asset Generator', 'Inventory Sync'],
    equationPart: 'Pipeline',
  },
  {
    id: 10,
    icon: ShieldCheck,
    titleBn: 'Human Interaction 👤',
    titleEn: 'Human Interaction & Safety 👤',
    subtitleBn: 'গুরুত্বপূর্ণ সিদ্ধান্তে অনুমতি গ্রহণ',
    subtitleEn: 'Human-In-The-Loop (HITL) Governance',
    descriptionBn: 'যেখানে স্পর্শকাতর ডাটা, আর্থিক লেনদেন, ইমেইল প্রেরণ বা বড় সিদ্ধান্ত জড়িত—সেখানে মানুষের কাছে সুস্পষ্ট confirmation ও অনুমোদন চায়।',
    descriptionEn: 'Maintains strict safety boundaries by pausing execution and requesting human approval before high-risk actions like payments or deletions.',
    exampleBn: 'যেমন: লাইভ প্রোডাকশনে ডেপ্লয় করা বা ব্যাংকিং পেমেন্ট গেটওয়েতে চার্জ করার আগে সুস্পষ্ট প্রিভিউ দিয়ে ইউজারকে “অনুমোদন” চাইবে।',
    exampleEn: 'Example: Before charging a card, modifying DNS records, or dropping production tables, presents a detailed review card for human sign-off.',
    tools: ['Approval Gate', 'Risk Level Classifier', 'Action Previewer'],
    equationPart: 'Safety',
  },
];

interface SimulationScenario {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: React.ComponentType<{ className?: string }>;
  promptBn: string;
  promptEn: string;
  normalAiOutputBn: string;
  normalAiOutputEn: string;
  agentSteps: {
    titleBn: string;
    titleEn: string;
    tool: string;
    outputBn: string;
    outputEn: string;
  }[];
  equationTag: string;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: 'restaurant',
    nameBn: 'রেস্তোরাঁ ওয়েবসাইট তৈরি',
    nameEn: 'Restaurant Website Build',
    icon: UtensilsCrossed,
    promptBn: 'আমার জন্য একটা restaurant website বানাও।',
    promptEn: 'Build a restaurant website for me.',
    normalAiOutputBn: '“নিশ্চয়ই! আপনি React ও Tailwind CSS দিয়ে শুরু করতে পারেন। এই নিন একটি ডেমো কোড স্নিপেট: `function App() { return <h1>My Restaurant</h1> }`। এবার আপনি একটি ডাটাবেস বানিয়ে সার্ভার হোস্ট করে নিন।” (শুধুমাত্র পরামর্শ দিয়ে শেষ)',
    normalAiOutputEn: '"Sure! You can build a restaurant site using React and Tailwind. Here is a basic code snippet: `function App() { return <h1>Restaurant</h1> }`. Now you should create a database, set up hosting, and install libraries yourself."',
    agentSteps: [
      {
        titleBn: '১. লক্ষ্য ও ব্র্যান্ড বিশ্লেষণ (Goal Understanding)',
        titleEn: '1. Goal & Brand Parsing (Goal Understanding)',
        tool: 'Context Analyzer',
        outputBn: 'মেনু ভিউয়ার, অনলাইন রিজার্ভেশন, ফুড গ্যালারি এবং ব্র্যান্ড কালার রিকোয়ারমেন্ট শনাক্ত করা হয়েছে।',
        outputEn: 'Identified core requirements: responsive digital menu, booking system, appetizing food gallery & contact map.',
      },
      {
        titleBn: '২. ৫-ধাপের আর্কিটেকচার পরিকল্পনা (Planning)',
        titleEn: '2. 5-Phase Plan Decomposition (Planning)',
        tool: 'Phase Scheduler',
        outputBn: 'ধাপসমূহ তৈরি: UI Design ➔ Database ➔ Booking Logic ➔ Stripe Payment ➔ Live Verification।',
        outputEn: 'Phases planned: UI Design ➔ Database schema ➔ Booking logic ➔ Payment integration ➔ Verification testing.',
      },
      {
        titleBn: '৩. কোড ও ডাটাবেস স্বয়ংক্রিয় তৈরি (Tool Execution)',
        titleEn: '3. Code & DB Generation (Tool Execution)',
        tool: 'Terminal & File System',
        outputBn: '`/src/components/restaurant/MenuCard.tsx` তৈরি এবং SQLite ডাটাবেস টেবিল `tables_booked` মাইগ্রেশন সম্পন্ন।',
        outputEn: 'Generated components, food menu items, and configured relational tables with booking constraints.',
      },
      {
        titleBn: '৪. টেস্ট রান ও এরর স্ব-সংশোধন (Observation & Adaptation)',
        titleEn: '4. Test Run & Error Self-Healing (Observation & Loop)',
        tool: 'Sandbox Runner',
        outputBn: 'লগ: পোর্টে কনফ্লিক্ট শনাক্ত ➔ স্বয়ংক্রিয়ভাবে পোর্ট ৩০০০-এ রিডাইরেক্ট করে টেস্ট সফলভাবে পাস!',
        outputEn: 'Port conflict observed on test suite ➔ automatically patched environment variable and re-ran tests cleanly.',
      },
      {
        titleBn: '৫. মানুষের অনুমোদন ও ডেপ্লয় (Human Interaction)',
        titleEn: '5. Human Sign-Off & Live Launch (Human Interaction)',
        tool: 'Approval Guard',
        outputBn: 'প্রোডাকশন ডেপ্লয়মেন্টের জন্য ব্যবহারকারীর অনুমোদন গ্রহণ ➔ রেস্তোরাঁ লাইভ ও কার্যকর!',
        outputEn: 'Presented clean preview card ➔ user approved ➔ app deployed and live in preview sandbox!',
      },
    ],
    equationTag: 'Request ➔ Plan ➔ UI ➔ Code ➔ DB ➔ API ➔ Test ➔ Fix ➔ Final App',
  },
  {
    id: 'store',
    nameBn: 'অনলাইন স্টোরে পণ্য সংযোজন',
    nameEn: 'E-commerce Product Pipeline',
    icon: ShoppingBag,
    promptBn: 'আমার online store-এর জন্য নতুন product যোগ করো।',
    promptEn: 'Add a new product to my online store.',
    normalAiOutputBn: '“নতুন পণ্য যোগ করতে হলে আপনার এডমিন প্যানেলে লগইন করুন এবং ফর্মটি পূরণ করুন।” (কোনো অ্যাকশন নিতে অক্ষম)',
    normalAiOutputEn: '"To add a new product, please open your e-commerce dashboard, click on Products, upload an image, and save."',
    agentSteps: [
      {
        titleBn: '১. প্রোডাক্ট ইনফরমেশন প্রসেসিং (Goal Understanding)',
        titleEn: '1. Product Information Parsing (Goal Understanding)',
        tool: 'Data Parser',
        outputBn: 'পণ্যের নাম, দাম, ক্যাটাগরি এবং এসকেইউ (SKU) তৈরি করা হয়েছে।',
        outputEn: 'Extracted product title, specifications, price tier, and generated unique inventory SKU.',
      },
      {
        titleBn: '২. এআই ছবি ও ডেসক্রিপশন জেনারেশন (Tools)',
        titleEn: '2. High-Res Image & Copy Generation (Tools)',
        tool: 'Creative Studio Tool',
        outputBn: 'পেশাদার ৪k প্রোডাক্ট ইমেজ এবং এসইও-বান্ধব ডেসক্রিপশন প্রস্তুত।',
        outputEn: 'Generated studio-lit product render and SEO-optimized compelling product description.',
      },
      {
        titleBn: '৩. ডাটাবেস ও ইনভেন্টরি আপডেট (Actions)',
        titleEn: '3. DB & Inventory Injection (Actions)',
        tool: 'Database Query Tool',
        outputBn: '`products` টেবিলে নতুন এন্ট্রি এবং প্রাথমিক স্টক ৫০ ইউনিট সেট করা হলো।',
        outputEn: 'Inserted record into PostgreSQL table and initialized stock count to 50 units.',
      },
      {
        titleBn: '৪. ওয়েবসাইট লাইভ সিঙ্ক (Multi-step Handling)',
        titleEn: '4. Live Storefront Sync (Multi-step Handling)',
        tool: 'Storefront API',
        outputBn: 'হোমপেজ ও ক্যাটাগরি পেজে পণ্য দৃশ্যমান করা হলো।',
        outputEn: 'Published product card to frontend store catalog and cached response.',
      },
    ],
    equationTag: 'Info ➔ Image ➔ Database ➔ Website ➔ Inventory ➔ Confirmation',
  },
  {
    id: 'self-healing',
    nameBn: 'কোড এক্সিকিউশন ও স্ব-মেরামত',
    nameEn: 'Code Execution & Self-Repair',
    icon: Terminal,
    promptBn: 'Code লিখে run করো এবং error analyze করে fix করো।',
    promptEn: 'Write code, execute it, detect any errors, and fix them.',
    normalAiOutputBn: '“কোডে কোনো এরর থাকলে স্ট্যাকট্রেসটি কপি করে আমাকে পাঠান, আমি ঠিক করে দেব।” (নিজে রান করতে পারে না)',
    normalAiOutputEn: '"If your code has an error, please copy and paste the console log here so I can suggest a fix."',
    agentSteps: [
      {
        titleBn: '১. কোড স্ক্রিপ্ট তৈরি (Brain & Tools)',
        titleEn: '1. Script Generation (Brain & Tools)',
        tool: 'Code Generator',
        outputBn: 'ডাটা প্রসেসিং পাইথনের জন্য `data_pipeline.py` তৈরি করা হলো।',
        outputEn: 'Generated asynchronous data parser with JSON streaming pipeline.',
      },
      {
        titleBn: '২. টার্মিনাল রান ও এরর ক্যাপচার (Observation)',
        titleEn: '2. Sandbox Execution (Observation)',
        tool: 'Terminal Runner',
        outputBn: 'এরর পর্যবেক্ষণ: `TypeError: Cannot read properties of undefined (reading "price")`।',
        outputEn: 'Observed runtime exception: `TypeError: Cannot read properties of undefined (reading "price")`.',
      },
      {
        titleBn: '৩. এরর বিশ্লেষণ ও স্ব-মেরামত (Adaptation)',
        titleEn: '3. Root Cause Analysis & Auto-Patch (Adaptation)',
        tool: 'Debug Engine',
        outputBn: 'নাল অবজেক্ট চেকার ও অপশনাল চেইনিং `item?.price ?? 0` যুক্ত করে কোড প্যাচ করা হলো।',
        outputEn: 'Diagnosed missing fallback for zero-value products. Applied optional chaining and fallback guard.',
      },
      {
        titleBn: '৪. পুনরায় রান ও সফল ফলাফল (Autonomous Action)',
        titleEn: '4. Re-Execution & Verification (Autonomous Action)',
        tool: 'Test Suite',
        outputBn: 'পুনরায় কোড রান সম্পন্ন: ১০০% ডাটা নির্ভুলভাবে প্রসেসড! ফলাফল ভ্যালিডেটেড।',
        outputEn: 'Re-ran pipeline automatically. 100% test pass rate with zero remaining errors.',
      },
    ],
    equationTag: 'Code ➔ Run ➔ Error ➔ Analyze ➔ Patch ➔ Re-run ➔ Verified Success',
  },
  {
    id: 'sales-automation',
    nameBn: 'স্বয়ংক্রিয় সাপ্তাহিক সেলস রিপোর্ট',
    nameEn: 'Weekly Autonomous Sales Report',
    icon: BarChart3,
    promptBn: 'প্রতি সপ্তাহে আমার sales report তৈরি করো।',
    promptEn: 'Generate my sales report every week automatically.',
    normalAiOutputBn: '“একটি সেলস রিপোর্টের নমুনা হলো: মোট বিক্রি: $০০০। আপনি প্রতি সপ্তাহে এসে এটি ম্যানুয়ালি জিজ্ঞাসা করতে পারেন।”',
    normalAiOutputEn: '"Here is a template for a sales report. You will have to come back and prompt me every Monday to get it."',
    agentSteps: [
      {
        titleBn: '১. ক্রন জব শিডিউল সেটআপ (Planning & Autonomy)',
        titleEn: '1. Cron Job Schedule Initialization (Planning & Autonomy)',
        tool: 'Cron Scheduler',
        outputBn: 'প্রতি সোমবার সকাল ৯:০০ ঘটিকার শিডিউল টাস্ক সক্রিয় করা হলো।',
        outputEn: 'Scheduled recurring automated task for every Monday at 09:00 UTC.',
      },
      {
        titleBn: '২. মাল্টি-সোর্স ডাটা সংগ্রহ (Tools)',
        titleEn: '2. Multi-Source Transaction Fetch (Tools)',
        tool: 'Stripe & DB API',
        outputBn: 'সাপ্তাহিক ৪৫০+ অর্ডারের ডাটা ও ট্রানজেকশন সংগৃহীত।',
        outputEn: 'Collected 450+ transaction records from billing gateway and warehouse system.',
      },
      {
        titleBn: '৩. এনালাইসিস ও ভিজুয়াল চার্ট (Brain & Tools)',
        titleEn: '3. KPI Analysis & Chart Generation (Brain & Tools)',
        tool: 'Data Analytics Tool',
        outputBn: 'গ্রোথ রেট +১৮.৪% নির্ণয় এবং রেভিনিউ ব্রেকডাউন চার্ট তৈরি।',
        outputEn: 'Calculated MoM growth, top-selling categories, churn rate, and produced visual infographics.',
      },
      {
        titleBn: '৪. স্বয়ংক্রিয় ডেলিভারি ও আর্কাইভ (Actions)',
        titleEn: '4. Autonomous Delivery & Archival (Actions)',
        tool: 'Document Publisher',
        outputBn: 'পিডিএফ রিপোর্ট তৈরি করে ইউজারের নোটিফিকেশন ও ফাইল স্টোরেজে জমা দেওয়া হলো।',
        outputEn: 'Compiled professional PDF summary, synced to Workspace Files, and alerted user.',
      },
    ],
    equationTag: 'Data Collect ➔ Deep Analysis ➔ Visual Charts ➔ Autonomous Delivery',
  },
];

export const PerfectAgentView: React.FC = () => {
  const { setActiveView, handleSendMessage, createTask } = useAgent();
  const [langMode, setLangMode] = useState<LanguageMode>('bn');
  const [activePillarId, setActivePillarId] = useState<number>(1);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('restaurant');
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(4);

  // Formula Sandbox State
  const [formulaState, setFormulaState] = useState({
    brain: true,
    tools: true,
    memory: true,
    planning: true,
    actions: true,
  });

  const selectedPillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0];
  const selectedScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Calculate Formula Power Level
  const activeComponentsCount = Object.values(formulaState).filter(Boolean).length;
  const powerPercentage = Math.round((activeComponentsCount / 5) * 100);

  const getFormulaTitle = () => {
    if (activeComponentsCount === 5) return '⚡ Perfect AI Agent (Autonomous OS)';
    if (activeComponentsCount === 4) return '🚀 Advanced AI Copilot';
    if (activeComponentsCount === 3) return '🛠️ Tool-Assisted AI';
    if (activeComponentsCount === 2) return '💬 Smart Interactive Chatbot';
    if (activeComponentsCount === 1) return '🧠 Raw Foundation Model (Static LLM)';
    return '⭕ Inactive / Dormant';
  };

  const runSimulation = () => {
    sound.playClick();
    setSimulationRunning(true);
    setSimulationStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < selectedScenario.agentSteps.length) {
        setSimulationStepIndex(current);
        sound.playPop();
      } else {
        clearInterval(interval);
        setSimulationRunning(false);
        sound.playSuccess();
      }
    }, 900);
  };

  const handleLaunchInChat = (prompt: string) => {
    sound.playClick();
    handleSendMessage(prompt);
    setActiveView('chat');
  };

  const handleCreateAgentTask = (title: string, desc: string) => {
    sound.playClick();
    createTask(title, desc, 'High');
    setActiveView('tasks');
  };

  return (
    <div
      id="perfect_agent_view"
      className="flex-1 overflow-y-auto space-y-7 max-w-7xl mx-auto w-full pb-14 px-2.5 sm:px-5 animate-fadeIn text-[#F8FAFC]"
    >
      {/* ======================================================== */}
      {/* 1. TOP HERO BANNER & FORMULA HERO                        */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl neumorph-card p-6 sm:p-9 border border-[#E50914]/25">
        {/* Glow Particles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#E50914]/20 blur-[130px]" />
        <div className="pointer-events-none absolute left-10 -bottom-24 h-[350px] w-[350px] rounded-full bg-[#FF204E]/15 blur-[120px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E50914]/20 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl neumorph-circle flex items-center justify-center text-[#FF204E]">
              <Sparkles className="h-6 w-6 text-[#FF204E] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E50914]/20 border border-[#FF204E]/30 px-3 py-0.5 text-[11px] font-mono font-bold text-[#FF4D4D] uppercase tracking-wider">
                  The Blueprint of Artificial Agency
                </span>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Agent-sigma08 Standard
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-1">
                What is a Perfect AI Agent?
              </h1>
              <p className="text-xs sm:text-sm text-[#FF4D4D] font-medium mt-0.5">
                একটি পারফেক্ট এআই এজেন্ট কী এবং কীভাবে এটি সাধারণ চ্যাটবট থেকে সম্পূর্ণ ভিন্ন
              </p>
            </div>
          </div>

          {/* Language Mode Toggle */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl neumorph-inset bg-[#0d0305] w-full sm:w-auto shrink-0 justify-start sm:justify-center overflow-x-auto">
            <button
              onClick={() => {
                setLangMode('bn');
                sound.playClick();
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                langMode === 'bn'
                  ? 'bg-gradient-to-r from-[#E50914] to-[#B80610] text-white shadow-[0_0_12px_rgba(229,9,20,0.6)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              বাংলা (Bengali)
            </button>
            <button
              onClick={() => {
                setLangMode('en');
                sound.playClick();
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                langMode === 'en'
                  ? 'bg-gradient-to-r from-[#E50914] to-[#B80610] text-white shadow-[0_0_12px_rgba(229,9,20,0.6)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLangMode('dual');
                sound.playClick();
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                langMode === 'dual'
                  ? 'bg-gradient-to-r from-[#E50914] to-[#B80610] text-white shadow-[0_0_12px_rgba(229,9,20,0.6)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              উভয় ভাষা (Dual)
            </button>
          </div>
        </div>

        {/* Master Definition Callout Box */}
        <div className="relative z-10 rounded-2xl bg-gradient-to-r from-[#1b0307] via-[#120205] to-[#1e050a] border border-[#FF204E]/30 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#FF204E]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF204E]">
                  Core Essence & Manifesto
                </h3>
              </div>

              {(langMode === 'bn' || langMode === 'dual') && (
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  “AI Agent হলো এমন একটি AI system যেটা শুধু প্রশ্নের উত্তর দেয় না—বরং নিজে <span className="text-[#FF204E] underline decoration-[#FF204E]/50 underline-offset-4">লক্ষ্য বুঝে</span>, <span className="text-[#FF204E] underline decoration-[#FF204E]/50 underline-offset-4">পরিকল্পনা করে</span>, <span className="text-[#FF204E] underline decoration-[#FF204E]/50 underline-offset-4">প্রয়োজনীয় কাজ করে</span> এবং <span className="text-[#FF204E] underline decoration-[#FF204E]/50 underline-offset-4">ফলাফল দেখে পরবর্তী সিদ্ধান্ত নেয়</span>।”
                </p>
              )}

              {(langMode === 'en' || langMode === 'dual') && (
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed italic">
                  “An AI Agent is an autonomous system that doesn’t merely answer questions—it understands the objective, formulates execution plans, operates real tools, observes outcomes, and iterates until the goal is achieved.”
                </p>
              )}

              <p className="text-xs font-semibold text-[#F8FAFC]/90 pt-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E] inline-block" />
                <span>Chatbot মূলত conversation করে, আর Agent conversation-এর পাশাপাশি বাস্তব দুনিয়ায় কাজ সম্পাদন করে।</span>
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => handleLaunchInChat('আমাকে একটি restaurant website বানিয়ে দাও')}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80610] hover:from-[#FF204E] hover:to-[#E50914] text-white px-5 py-3 font-bold text-xs shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all cursor-pointer transform hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Test Live in Agent Chat</span>
              </button>

              <button
                onClick={() => handleCreateAgentTask('Create Restaurant App', 'Autonomous build using 10 agent pillars')}
                className="flex items-center justify-center gap-2 rounded-xl neumorph-card border border-[#E50914]/30 hover:border-[#FF204E]/60 text-white/90 hover:text-white px-4 py-2.5 font-semibold text-xs transition-all cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-[#FF204E]" />
                <span>Queue in Task Flow</span>
              </button>
            </div>
          </div>
        </div>

        {/* The Golden Equation Banner */}
        <div className="relative z-10 mt-6 pt-6 border-t border-[#E50914]/20 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="p-4 rounded-2xl neumorph-inset bg-[#0c0204] border border-[#E50914]/20">
            <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-widest block mb-1">
              FOUNDATION MODEL
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-black text-white">AI</span>
              <span className="text-xl font-bold text-[#FF204E]">=</span>
              <span className="text-lg sm:text-xl font-bold text-amber-400 flex items-center gap-1.5">
                Brain 🧠
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              জ্ঞান ও ভাষা বোঝার ক্ষমতা সম্পন্ন সেন্ট্রাল ইন্টেলিজেন্স।
            </p>
          </div>

          <div className="p-4 rounded-2xl neumorph-card bg-gradient-to-r from-[#170307] to-[#120204] border border-[#FF204E]/40 shadow-[0_0_25px_rgba(229,9,20,0.25)]">
            <span className="text-[10px] font-mono uppercase text-[#FF4D4D] tracking-widest block mb-1">
              THE COMPLETE AUTONOMOUS AGENT
            </span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#FF204E]">Agent</span>
              <span className="text-xl font-bold text-white">=</span>
              <span className="text-xs sm:text-sm font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/30">Brain 🧠</span>
              <span className="text-xs text-white/70">+</span>
              <span className="text-xs sm:text-sm font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-lg border border-blue-500/30">Tools 🛠️</span>
              <span className="text-xs text-white/70">+</span>
              <span className="text-xs sm:text-sm font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-lg border border-purple-500/30">Memory 💾</span>
              <span className="text-xs text-white/70">+</span>
              <span className="text-xs sm:text-sm font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-500/30">Planning 📋</span>
              <span className="text-xs text-white/70">+</span>
              <span className="text-xs sm:text-sm font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-lg border border-rose-500/30">Actions ⚙️</span>
            </div>
            <p className="text-[11px] text-white/80 mt-1.5">
              মস্তিষ্ক + ডিজিটাল হাত-পা + স্মৃতি + পরিকল্পনা + স্বয়ংক্রিয় কাজ!
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THE 10 ARCHITECTURAL PILLARS (Interactive Explorer)    */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF204E] animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                🤖 AI Agent-এর প্রধান ১০টি Features & Pillars
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              Click any pillar to inspect its technical implementation, real-world case, and connected tools.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <span className="rounded-lg bg-[#E50914]/15 px-2.5 py-1 text-[#FF4D4D] border border-[#E50914]/30 font-bold">
              10 / 10 Pillars Fully Operational
            </span>
          </div>
        </div>

        {/* Pillars Navigation Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activePillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => {
                  setActivePillarId(pillar.id);
                  sound.playClick();
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#210408] to-[#160306] border-[#FF204E] shadow-[0_0_15px_rgba(229,9,20,0.4)] text-white'
                    : 'neumorph-card border-transparent text-[#94A3B8] hover:text-white hover:border-[#E50914]/30'
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'neumorph-badge-primary text-white' : 'neumorph-circle text-[#94A3B8]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">
                    {langMode === 'en' ? pillar.titleEn : pillar.titleBn}
                  </div>
                  <div className="text-[9px] font-mono text-[#FF4D4D] uppercase truncate">
                    {pillar.equationPart}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Showcase Detail Card */}
        <div className="rounded-3xl neumorph-card p-6 sm:p-8 border border-[#E50914]/30 relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 bg-[#E50914]/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Col: Main Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl neumorph-circle flex items-center justify-center text-[#FF204E] shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                  <selectedPillar.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#FF204E]/20 text-[#FF4D4D] border border-[#FF204E]/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                      PILLAR #{selectedPillar.id}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] uppercase font-mono tracking-wider">
                      Module: {selectedPillar.equationPart}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {selectedPillar.titleBn}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    {selectedPillar.subtitleBn} • {selectedPillar.subtitleEn}
                  </p>
                </div>
              </div>

              {/* Description in selected language mode */}
              <div className="space-y-2 rounded-2xl neumorph-inset bg-[#0c0204] p-4 border border-[#E50914]/15">
                {(langMode === 'bn' || langMode === 'dual') && (
                  <p className="text-sm text-white/90 leading-relaxed">
                    {selectedPillar.descriptionBn}
                  </p>
                )}
                {(langMode === 'en' || langMode === 'dual') && (
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {selectedPillar.descriptionEn}
                  </p>
                )}
              </div>

              {/* Concrete Example Box */}
              <div className="rounded-2xl bg-[#1a0408] border border-[#FF204E]/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    বাস্তব উদাহরণ (Concrete Walkthrough)
                  </h4>
                </div>
                {(langMode === 'bn' || langMode === 'dual') && (
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    {selectedPillar.exampleBn}
                  </p>
                )}
                {(langMode === 'en' || langMode === 'dual') && (
                  <p className="text-xs text-white/70 italic leading-relaxed">
                    {selectedPillar.exampleEn}
                  </p>
                )}
              </div>
            </div>

            {/* Right Col: Associated Tools & Live Trigger */}
            <div className="lg:col-span-4 space-y-4 lg:border-l lg:border-[#E50914]/20 lg:pl-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF204E] mb-2 flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>সংযুক্ত টুলস ও সাব-সিস্টেম</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPillar.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl neumorph-card border border-[#E50914]/20 px-3 py-1 text-xs font-mono text-white/90 flex items-center gap-1.5"
                    >
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>{tool}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pillar Interactive Trigger */}
              <div className="p-4 rounded-2xl neumorph-inset bg-[#0e0205] border border-[#E50914]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white">Status in Agent-sigma08</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-mono font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  এই পিলারটি আপনার বর্তমান Agent-sigma08 সেশনে সক্রিয় রয়েছে এবং প্রতিটি রিকোয়েস্টে ব্যাকগ্রাউন্ডে রান হয়।
                </p>
                <button
                  onClick={() => {
                    handleLaunchInChat(`আমাকে "${selectedPillar.titleBn}" এর একটি সরাসরি প্র্যাকটিক্যাল ডেমো দেখাও।`);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80610] text-white py-2 text-xs font-bold shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>সরাসরি চ্যাটে ডেমো দেখুন</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE ARENA: NORMAL AI VS PERFECT AI AGENT       */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🆚</span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Normal AI vs AI Agent — Interactive Battle Arena
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              একটি সাধারণ AI চ্যাটবট এবং পূর্ণাঙ্গ AI এজেন্টের কর্মপদ্ধতির সরাসরি পার্থক্য পরীক্ষা করুন।
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={simulationRunning}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#B80610] hover:from-[#FF204E] hover:to-[#E50914] text-white px-5 py-2.5 font-bold text-xs shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            {simulationRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Simulating Autonomous Agent...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Run Agent Pipeline Simulator</span>
              </>
            )}
          </button>
        </div>

        {/* Scenario Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  setSimulationStepIndex(sc.agentSteps.length - 1);
                  sound.playClick();
                }}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#250409] to-[#150205] border-[#FF204E] shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                    : 'neumorph-card border-transparent hover:border-[#E50914]/30'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'neumorph-badge-primary text-white' : 'neumorph-circle text-[#94A3B8]'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {langMode === 'en' ? sc.nameEn : sc.nameBn}
                  </h4>
                </div>
                <p className="text-[11px] text-[#94A3B8] line-clamp-1 italic">
                  "{sc.promptBn}"
                </p>
              </button>
            );
          })}
        </div>

        {/* Side-By-Side Battle Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT: Normal AI (Chatbot) */}
          <div className="lg:col-span-5 rounded-3xl neumorph-card p-5 sm:p-6 border border-zinc-800 bg-[#0b0406]/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-300">Normal AI (Chatbot)</h3>
                    <span className="text-[10px] text-zinc-500 font-mono">Reactive · Single-Turn · Text Only</span>
                  </div>
                </div>
                <span className="rounded-full bg-zinc-800/80 text-zinc-400 px-2 py-0.5 text-[10px] font-mono">
                  Standard LLM
                </span>
              </div>

              {/* User Prompt */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">User Prompt</span>
                <p className="text-white font-medium">"{selectedScenario.promptBn}"</p>
              </div>

              {/* Output */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">What Normal AI Does:</span>
                <p className="italic leading-relaxed text-zinc-300">
                  {langMode === 'en' ? selectedScenario.normalAiOutputEn : selectedScenario.normalAiOutputBn}
                </p>
              </div>

              {/* Limitations List */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">সীমাবদ্ধতা (Limitations):</div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>ডাটাবেস তৈরি বা কানেক্ট করতে পারে না</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>কোড রান বা এরর নিজে পরীক্ষা করতে পারে না</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>ব্যবহারকারীকেই সব ম্যানুয়ালি করতে বলে থেমে যায়</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
              <span className="text-[11px] font-mono text-zinc-500">
                Formula: Output = Text Only 💬
              </span>
            </div>
          </div>

          {/* RIGHT: The Perfect AI Agent (Agent-sigma08) */}
          <div className="lg:col-span-7 rounded-3xl neumorph-card p-5 sm:p-6 border border-[#FF204E]/50 bg-gradient-to-b from-[#1c0307] via-[#120205] to-[#0c0204] shadow-[0_0_30px_rgba(229,9,20,0.25)] flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E50914]/30">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-[#FF204E]">
                    <Zap className="h-4 w-4 text-[#FF204E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>Perfect AI Agent</span>
                      <span className="text-[#FF204E] font-mono text-xs">(Agent-sigma08)</span>
                    </h3>
                    <span className="text-[10px] text-[#FF4D4D] font-mono font-bold">
                      Proactive · Multi-Step · Tools & Actions Connected
                    </span>
                  </div>
                </div>
                <span className="rounded-full neumorph-badge-primary text-white px-2.5 py-0.5 text-[10px] font-mono font-bold shadow-[0_0_10px_#FF204E]">
                  Autonomous
                </span>
              </div>

              {/* Tagline */}
              <div className="p-2.5 rounded-xl neumorph-inset bg-[#0c0204] border border-[#E50914]/20 flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-300 font-bold truncate">
                  ⚡ {selectedScenario.equationTag}
                </span>
                <span className="text-[10px] text-white/70 font-mono shrink-0 ml-2">
                  {selectedScenario.agentSteps.length} Live Phases
                </span>
              </div>

              {/* Step by step animated execution logs */}
              <div className="space-y-2">
                {selectedScenario.agentSteps.map((step, idx) => {
                  const isCompleted = idx <= simulationStepIndex;
                  const isCurrent = idx === simulationStepIndex && simulationRunning;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl transition-all border ${
                        isCurrent
                          ? 'bg-[#2a060d] border-[#FF204E] shadow-[0_0_15px_rgba(229,9,20,0.5)] animate-pulse'
                          : isCompleted
                          ? 'bg-[#150306] border-[#E50914]/30 text-white'
                          : 'bg-[#0a0204]/60 border-zinc-900/60 opacity-40 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white">
                            {langMode === 'en' ? step.titleEn : step.titleBn}
                          </h4>
                        </div>
                        <span className="rounded-md bg-[#FF204E]/15 border border-[#FF204E]/30 text-[#FF4D4D] px-2 py-0.5 text-[9px] font-mono">
                          {step.tool}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] pl-7">
                        {langMode === 'en' ? step.outputEn : step.outputBn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch CTA for this scenario */}
            <div className="mt-4 pt-3 border-t border-[#E50914]/25 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Result: End-to-end Executed & Ready to Use!</span>
              </span>
              <button
                onClick={() => handleLaunchInChat(selectedScenario.promptBn)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80610] text-white px-3.5 py-1.5 text-xs font-bold shadow-[0_0_12px_rgba(229,9,20,0.5)] hover:brightness-110 transition-all cursor-pointer shrink-0"
              >
                <span>Run for Real</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. COMPARISON MATRIX TABLE                               */}
      {/* ======================================================== */}
      <div className="rounded-3xl neumorph-card p-6 sm:p-8 border border-[#E50914]/25 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-[#FF204E]" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              তুলনামূলক ছক: Normal AI বনাম Perfect AI Agent
            </h3>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            Side-By-Side Feature Matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E50914]/30 text-[#94A3B8] font-mono uppercase text-[10px]">
                <th className="py-3 px-3">বৈশিষ্ট্য (Capability)</th>
                <th className="py-3 px-3 text-zinc-400">Normal AI (চ্যাটবট)</th>
                <th className="py-3 px-3 text-[#FF204E] font-bold">Perfect AI Agent (Agent-sigma08)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E50914]/15">
              <tr className="hover:bg-[#1a0408]/40 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">কাজের ধরণ (Primary Role)</td>
                <td className="py-3.5 px-3 text-zinc-400">প্রশ্নের উত্তর দেয় (Answers questions)</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>লক্ষ্য পূরণে কাজ করে (Goal-directed completion)</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a0408]/40 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">প্রতিক্রিয়া স্বভাব (Behavior)</td>
                <td className="py-3.5 px-3 text-zinc-400">সাধারণত Reactive (অপেক্ষায় থাকে)</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>Proactive হতে পারে (উদ্যোগী হয়ে কাজ এগিয়ে নেয়)</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a0408]/40 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">টুল ব্যবহার (Tool Usage)</td>
                <td className="py-3.5 px-3 text-zinc-400">নিজে Tool ব্যবহার সীমিত / শূন্য</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>বিভিন্ন Tool ব্যবহার করে (Web, DB, API, Terminal, Files)</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a0408]/40 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">কাজের ব্যাপ্তি (Workflow)</td>
                <td className="py-3.5 px-3 text-zinc-400">একবারের Response (Single text reply)</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>Multi-step Workflow (ধারাবাহিক বহু-ধাপ সম্পাদন)</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a0408]/40 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">পরিকল্পনা ক্ষমতা (Planning)</td>
                <td className="py-3.5 px-3 text-zinc-400">Planning সীমিত / শুধুমাত্র পরামর্শ</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>Planning + Execution (পরিকল্পনা অনুযায়ী কাজ বাস্তবায়ন)</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a0408]/40 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">চূড়ান্ত আউটপুট (Final Output)</td>
                <td className="py-3.5 px-3 text-zinc-400">সাধারণত Output টেক্সট দেয়</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>Action + Verified Output (বাস্তব কাজ ও চূড়ান্ত ফলাফল)</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a0408]/40 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">ভুল হলে করণীয় (Error Recovery)</td>
                <td className="py-3.5 px-3 text-zinc-400">ইউজারকেই ঠিক করতে বলে</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>স্বয়ংক্রিয়ভাবে এরর পর্যবেক্ষণ ও কোড সংশোধন লুপ</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE FORMULA SANDBOX ("Build-An-Agent")        */}
      {/* ======================================================== */}
      <div className="rounded-3xl neumorph-card p-6 sm:p-8 border border-[#E50914]/25 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Interactive Formula Sandbox: Build-an-Agent</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              উপাদানগুলো অন/অফ করে দেখুন কীভাবে সাধারণ AI একটি পূর্ণাঙ্গ Perfect Agent-এ রূপান্তরিত হয়।
            </p>
          </div>

          {/* Power Level Meter */}
          <div className="flex items-center gap-3 p-2 rounded-2xl neumorph-inset bg-[#0c0204] border border-[#E50914]/20 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#94A3B8] block">SYSTEM POWER</span>
              <span className="text-sm font-black text-[#FF204E]">{powerPercentage}%</span>
            </div>
            <div className="w-24 sm:w-32 h-2.5 rounded-full bg-zinc-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#E50914] via-[#FF204E] to-emerald-400 transition-all duration-500"
                style={{ width: `${powerPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Formula Component Switches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Brain */}
          <button
            onClick={() => {
              setFormulaState((prev) => ({ ...prev, brain: !prev.brain }));
              sound.playClick();
            }}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              formulaState.brain
                ? 'bg-[#200408] border-[#FF204E] shadow-[0_0_12px_rgba(229,9,20,0.4)] text-white'
                : 'neumorph-card border-transparent text-zinc-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🧠</span>
              <span className={`h-2 w-2 rounded-full ${formulaState.brain ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-zinc-700'}`} />
            </div>
            <h4 className="text-xs font-bold">Brain (মস্তিষ্ক)</h4>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">LLM Core & ভাষা জ্ঞান</p>
          </button>

          {/* 2. Tools */}
          <button
            onClick={() => {
              setFormulaState((prev) => ({ ...prev, tools: !prev.tools }));
              sound.playClick();
            }}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              formulaState.tools
                ? 'bg-[#200408] border-[#FF204E] shadow-[0_0_12px_rgba(229,9,20,0.4)] text-white'
                : 'neumorph-card border-transparent text-zinc-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🛠️</span>
              <span className={`h-2 w-2 rounded-full ${formulaState.tools ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-zinc-700'}`} />
            </div>
            <h4 className="text-xs font-bold">Tools (হাত-পা)</h4>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">APIs, DB, Terminal, Files</p>
          </button>

          {/* 3. Memory */}
          <button
            onClick={() => {
              setFormulaState((prev) => ({ ...prev, memory: !prev.memory }));
              sound.playClick();
            }}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              formulaState.memory
                ? 'bg-[#200408] border-[#FF204E] shadow-[0_0_12px_rgba(229,9,20,0.4)] text-white'
                : 'neumorph-card border-transparent text-zinc-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">💾</span>
              <span className={`h-2 w-2 rounded-full ${formulaState.memory ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-zinc-700'}`} />
            </div>
            <h4 className="text-xs font-bold">Memory (স্মৃতি)</h4>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">পছন্দ ও কনটেক্সট স্টোরেজ</p>
          </button>

          {/* 4. Planning */}
          <button
            onClick={() => {
              setFormulaState((prev) => ({ ...prev, planning: !prev.planning }));
              sound.playClick();
            }}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              formulaState.planning
                ? 'bg-[#200408] border-[#FF204E] shadow-[0_0_12px_rgba(229,9,20,0.4)] text-white'
                : 'neumorph-card border-transparent text-zinc-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">📋</span>
              <span className={`h-2 w-2 rounded-full ${formulaState.planning ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-zinc-700'}`} />
            </div>
            <h4 className="text-xs font-bold">Planning (পরিকল্পনা)</h4>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">মাইলফলক ও ডিপেন্ডেন্সি</p>
          </button>

          {/* 5. Actions */}
          <button
            onClick={() => {
              setFormulaState((prev) => ({ ...prev, actions: !prev.actions }));
              sound.playClick();
            }}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              formulaState.actions
                ? 'bg-[#200408] border-[#FF204E] shadow-[0_0_12px_rgba(229,9,20,0.4)] text-white'
                : 'neumorph-card border-transparent text-zinc-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">⚙️</span>
              <span className={`h-2 w-2 rounded-full ${formulaState.actions ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-zinc-700'}`} />
            </div>
            <h4 className="text-xs font-bold">Actions (কর্মক্ষমতা)</h4>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">স্বয়ংক্রিয় এক্সিকিউশন ও লুপ</p>
          </button>
        </div>

        {/* Dynamic Sandbox Output Verdict */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#170307] to-[#0e0204] border border-[#FF204E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-[#FF4D4D] uppercase tracking-wider">
              বর্তমান আর্কিটেকচার শ্রেণী (Current Architecture Tier)
            </div>
            <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
              {getFormulaTitle()}
            </h4>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-xl">
              {activeComponentsCount === 5
                ? 'অনবদ্য! আপনার কাছে রয়েছে পূর্ণাঙ্গ AI Agent—যা লক্ষ্য বুঝে স্বয়ংক্রিয়ভাবে পরিকল্পনা, টুলস প্রয়োগ, মেমোরি সংরক্ষণ ও সেলফ-হিলিং করতে পারে।'
                : activeComponentsCount >= 3
                ? 'আংশিক এজেন্ট সক্রিয়। সম্পূর্ণ স্বায়ত্তশাসনের জন্য অনুপস্থিত উপাদানগুলো চালু করুন।'
                : 'এটি বর্তমানে শুধুমাত্র একটি প্যাসিভ চ্যাটবট হিসেবে কাজ করতে সক্ষম, বাস্তব দুনিয়ায় অ্যাকশন নেওয়ার ক্ষমতা নেই।'}
            </p>
          </div>

          <button
            onClick={() => {
              setFormulaState({ brain: true, tools: true, memory: true, planning: true, actions: true });
              sound.playSuccess();
            }}
            className="px-4 py-2.5 rounded-xl neumorph-card border border-[#E50914]/30 text-xs font-bold text-white hover:text-[#FF204E] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            সবগুলো উপাদান চালু করুন (100%)
          </button>
        </div>
      </div>
    </div>
  );
};
