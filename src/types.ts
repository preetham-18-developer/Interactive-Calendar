export type EventType = 'Birthday' | 'Anniversary' | 'Festival' | 'Holiday' | 'Meeting';

export interface CalendarEvent {
  id: string;
  userId: string;
  dateStr: string; // YYYY-MM-DD
  type: EventType;
  title: string;
  note?: string;
  emoji?: string;
  images?: string[]; // base64 images, max 4
  repeatRule?: 'none' | '10_days' | '1_month' | 'custom';
  customRepeatInterval?: number; // custom days
  repeatUntilDateStr?: string; 
}
