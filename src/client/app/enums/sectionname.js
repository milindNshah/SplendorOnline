export const SectionName = {
  CONTENT: 'content',
  OBJECTIVE: 'objective',
  TERMINOLOGY: 'terminology',
  GAMESETUP: 'gamesetup',
  HOWTOPLAY: 'howtoplay',
  TIEBREAKER: 'tiebreaker',
}

export function getDisplayNameFromSection(sectionName) {
  switch(sectionName) {
    case SectionName.CONTENT:
      return 'Content'
    case SectionName.OBJECTIVE:
      return 'Objective'
    case SectionName.TERMINOLOGY:
      return 'Terminology'
    case SectionName.GAMESETUP:
      return 'Board Setup'
    case SectionName.HOWTOPLAY:
      return 'How To Play'
    case SectionName.TIEBREAKER:
      return 'Tie Breaker Conditions'
  }
}
