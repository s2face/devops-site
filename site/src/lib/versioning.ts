import { createHash } from 'crypto';

export function getContentVersion(content: string): string {
  const checklistMatch = content.match(/## (?:Чек-лист готовности урока|Checklist)\n\n([\s\S]+)/);
  const checklistContent = checklistMatch ? checklistMatch[1] : content;
  return createHash('sha256').update(checklistContent).digest('hex').slice(0, 8);
}

export function validateProgressVersion(storedVersion: string, currentContent: string): boolean {
  return storedVersion === getContentVersion(currentContent);
}
