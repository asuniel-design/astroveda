// ─── GA4 MEASUREMENT ID ───
// Replace with your actual GA4 ID (format: G-XXXXXXXXXX)
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

// Initialize gtag (called once in _app.js via Script tags)
export function pageview(url) {
  if (!isProd || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
}

// Generic custom event
export function event(action, params = {}) {
  if (!isProd || !window.gtag) return;
  window.gtag('event', action, params);
}

// ─── PREDEFINED EVENTS ───

export function trackChatInitiate(astrologerId, astrologerName, status) {
  event('chat_initiate_click', {
    astrologer_id: astrologerId,
    astrologer_name: astrologerName,
    astrologer_status: status,
    event_category: 'consultation',
  });
}

export function trackWalletTierSelected(amount) {
  event('wallet_tier_selected', {
    amount,
    currency: 'INR',
    event_category: 'monetization',
  });
}

export function trackWalletTopUp(amount, newBalance) {
  event('wallet_topup_complete', {
    amount,
    new_balance: newBalance,
    currency: 'INR',
    event_category: 'monetization',
  });
}

export function trackOnboardingComplete(userId, freeAvailable) {
  event('lead_onboarding_complete', {
    user_id: userId,
    free_available: freeAvailable,
    event_category: 'onboarding',
  });
}

export function trackOnboardingStep(stepNumber, stepKey) {
  event('onboarding_step', {
    step_number: stepNumber,
    step_key: stepKey,
    event_category: 'onboarding',
  });
}

export function trackSessionEnd(duration, cost, astrologerName) {
  event('session_end', {
    duration_minutes: duration,
    total_cost: cost,
    astrologer_name: astrologerName,
    currency: 'INR',
    event_category: 'consultation',
  });
}
