import { TEMPLATES, CartTemplate, IntentCategory } from './templates';
import { ParsedIntent } from '@/types/index';

export function matchTemplate(intent: ParsedIntent): CartTemplate | null {
  const description = intent.rawDescription.toLowerCase();
  const occasionType = intent.occasionType.toLowerCase();

  // Score each template by keyword matches
  let bestMatch: CartTemplate | null = null;
  let bestScore = 0;

  for (const template of TEMPLATES) {
    let score = 0;
    for (const keyword of template.keywords) {
      if (description.includes(keyword.toLowerCase())) {
        score += keyword.split(' ').length; // Multi-word matches score higher
      }
      if (occasionType.includes(keyword.toLowerCase().replace(/\s+/g, '_'))) {
        score += 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

export function getTemplatesByCategory(category: IntentCategory): CartTemplate[] {
  return TEMPLATES.filter(t => t.intentCategory === category);
}
