export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED';

export interface UrgencyInfo {
  urgency: UrgencyLevel;
  minutesRemaining: number;
  formattedRemaining: string;
  recommendedAction: string;
}

export function calculateUrgency(expiresAt: string | Date): UrgencyInfo {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const diffMs = expiry - now;
  const minutesRemaining = Math.floor(diffMs / (1000 * 60));

  if (minutesRemaining <= 0) {
    return {
      urgency: 'EXPIRED',
      minutesRemaining: 0,
      formattedRemaining: 'Expired',
      recommendedAction: 'This donation has expired and can no longer be claimed.'
    };
  }

  const hours = Math.floor(minutesRemaining / 60);
  const mins = minutesRemaining % 60;
  let formattedRemaining = '';

  if (hours > 0) {
    formattedRemaining = `${hours}h ${mins}m`;
  } else {
    formattedRemaining = `${mins}m`;
  }

  if (minutesRemaining < 30) {
    return {
      urgency: 'CRITICAL',
      minutesRemaining,
      formattedRemaining: `Expires in ${formattedRemaining}`,
      recommendedAction: 'Immediate pickup recommended'
    };
  } else if (minutesRemaining <= 120) { // 30m - 2h
    return {
      urgency: 'HIGH',
      minutesRemaining,
      formattedRemaining: `Expires in ${formattedRemaining}`,
      recommendedAction: 'Pickup within the next 1-2 hours strongly advised'
    };
  } else if (minutesRemaining <= 360) { // 2h - 6h
    return {
      urgency: 'MEDIUM',
      minutesRemaining,
      formattedRemaining: `Expires in ${formattedRemaining}`,
      recommendedAction: 'Standard dispatch window'
    };
  } else {
    return {
      urgency: 'LOW',
      minutesRemaining,
      formattedRemaining: `Expires in ${formattedRemaining}`,
      recommendedAction: 'Flexible pickup schedule available'
    };
  }
}
