export type LessonStatus = 'ready' | 'draft' | 'todo';
export type LessonLevel = 1 | 2 | 3;

export interface LessonFrontmatter {
  lesson: {
    number: number;
    title: string;
    slug: string;
    level: LessonLevel;
    status: LessonStatus;
  };
  navigation: {
    previous: string | null;
    next: string | null;
    prerequisites?: string[];
  };
  meta: {
    description: string;
    keywords: string[];
    updated: string;
  };
}

export interface Term {
  term: string;
  expansion: string;
  explanation: string;
}

export interface Lesson {
  frontmatter: LessonFrontmatter;
  content: string;
  takeaways: string[];
  glossary: Term[];
  checklist: string[];
}

export interface LessonProgress {
  lessonSlug: string;
  checklistState: boolean[];
  completedAt?: string;
  version: string;
}
