import { config } from 'dotenv';
config();

import '@/ai/flows/auto-assign-classrooms.ts';
import '@/ai/flows/summarize-assignment-failures.ts';