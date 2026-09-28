import { Activity, Club, ClubProposal, Member, PolicyRule } from '../types';

export const STORAGE_KEYS = {
  CLUBS: 'wu_club_clubs_v2',
  ACTIVITIES: 'wu_club_activities_v2',
  PROPOSALS: 'wu_club_proposals_v2',
  MEMBERS: 'wu_club_members_v2',
  CREDENTIALS: 'wu_club_credentials_v2',
  PERSONAL_EVENTS: 'wu_club_personal_events_v2',
  JOINED_ACTIVITIES: 'wu_club_joined_activities_v2',
  JOINED_CLUBS: 'wu_club_joined_clubs_v2',
  LIKED_ACTIVITIES: 'wu_club_liked_activities_v2',
  LIKED_CLUBS: 'wu_club_liked_clubs_v2',
  GOODNESS_HISTORY: 'wu_club_goodness_history_v2',
  GOODNESS_STATS: 'wu_club_goodness_stats_v2',
  POLICIES: 'wu_club_policies_v2',
  USER_PREFERENCES: 'wu_club_user_preferences_by_id_v2',
  CURRENT_STUDENT_ID: 'wu_club_current_student_id_v2',
  STUDENT_PROFILES: 'wu_club_student_profiles_v2',
  JOINED_ACTIVITIES_BY_STUDENT: 'wu_club_joined_activities_by_student_v2',
  JOINED_CLUBS_BY_STUDENT: 'wu_club_joined_clubs_by_student_v2',
  LIKED_ACTIVITIES_BY_STUDENT: 'wu_club_liked_activities_by_student_v2',
  LIKED_CLUBS_BY_STUDENT: 'wu_club_liked_clubs_by_student_v2',
  PERSONAL_EVENTS_BY_STUDENT: 'wu_club_personal_events_by_student_v2',
  GOODNESS_HISTORY_BY_STUDENT: 'wu_club_goodness_history_by_student_v2',
  GOODNESS_STATS_BY_STUDENT: 'wu_club_goodness_stats_by_student_v2',
  CANCELLATION_REPORTS: 'wu_club_cancellation_reports_v2',
} as const;

/**
 * Safely retrieves an item from Local Storage and parses JSON.
 * Falls back to defaultValue if not found or parsing fails.
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultValue;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? (parsed as T) : defaultValue;
  } catch (error) {
    console.warn(`[LocalStorage] Failed to parse key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely saves an item to Local Storage as a JSON string.
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[LocalStorage] Failed to set key "${key}":`, error);
    return false;
  }
}

/**
 * Removes an item from Local Storage.
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[LocalStorage] Failed to remove key "${key}":`, error);
  }
}

/**
 * Saves clubs to storage while stripping non-serializable React icon components.
 */
export function saveClubsToStorage(clubs: Club[]): void {
  try {
    const cleanClubs = clubs.map(club => {
      // Destructure out the icon React component to prevent serialization errors
      const { icon, ...rest } = club;
      return rest;
    });
    setStorageItem(STORAGE_KEYS.CLUBS, cleanClubs);
  } catch (error) {
    console.error('[LocalStorage] Failed to save clubs:', error);
  }
}

/**
 * Loads clubs from storage and re-attaches their React icon components.
 */
export function loadClubsFromStorage(
  initialClubs: Club[],
  getCategoryIconFn: (category: string, name?: string) => any
): Club[] {
  try {
    const storedClubs = getStorageItem<Club[] | null>(STORAGE_KEYS.CLUBS, null);
    if (storedClubs && Array.isArray(storedClubs) && storedClubs.length > 0) {
      return storedClubs.map(stored => {
        // Re-attach icon component: match by ID/name first, fallback to category icon
        const matched = initialClubs.find(c => c.id === stored.id || c.name === stored.name);
        const icon = matched?.icon || getCategoryIconFn(stored.category, stored.name);
        return {
          ...stored,
          icon,
        };
      });
    }
  } catch (error) {
    console.error('[LocalStorage] Failed to load clubs:', error);
  }
  return initialClubs;
}

/**
 * Loads activities from storage or returns initial activities.
 */
export function loadActivitiesFromStorage(initialActivities: Activity[]): Activity[] {
  try {
    const stored = getStorageItem<Activity[] | null>(STORAGE_KEYS.ACTIVITIES, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
  } catch (error) {
    console.error('[LocalStorage] Failed to load activities:', error);
  }
  return initialActivities;
}

/**
 * Clears all WU Club storage keys and resets to fresh defaults.
 */
export function clearAllWuStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(e);
    }
  });
}
