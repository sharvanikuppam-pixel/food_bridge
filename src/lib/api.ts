const API_BASE = '/api';

export async function fetchDonations(params?: {
  status?: string;
  food_type?: string;
  urgency?: string;
  donor_id?: string;
  search?: string;
}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/donations?${query}`);
  if (!res.ok) throw new Error('Failed to fetch donations');
  return res.json();
}

export async function fetchDonationById(id: string) {
  const res = await fetch(`${API_BASE}/donations/${id}`);
  if (!res.ok) throw new Error('Failed to fetch donation details');
  return res.json();
}

export async function createDonation(data: any) {
  const res = await fetch(`${API_BASE}/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create donation');
  return res.json();
}

export async function fetchMatches(donationId: string) {
  const res = await fetch(`${API_BASE}/donations/${donationId}/matches`);
  if (!res.ok) throw new Error('Failed to fetch matches');
  return res.json();
}

export async function claimDonation(donationId: string, ngoId: string) {
  const res = await fetch(`${API_BASE}/donations/${donationId}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ngo_id: ngoId }),
  });
  if (!res.ok) throw new Error('Failed to claim donation');
  return res.json();
}

export async function updateClaimStatus(claimId: string, status: string) {
  const res = await fetch(`${API_BASE}/claims/${claimId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update claim status');
  return res.json();
}

export async function fetchNGOs() {
  const res = await fetch(`${API_BASE}/ngos`);
  if (!res.ok) throw new Error('Failed to fetch NGOs');
  return res.json();
}

export async function generateAIDescription(inputData: any) {
  const res = await fetch(`${API_BASE}/ai/donation-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputData),
  });
  if (!res.ok) throw new Error('Failed to generate AI description');
  return res.json();
}

export async function explainAIMatch(donation: any, ngo: any, matchScore: number, reasons: string[]) {
  const res = await fetch(`${API_BASE}/ai/match-explanation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ donation, ngo, matchScore, reasons }),
  });
  if (!res.ok) throw new Error('Failed to get AI match explanation');
  return res.json();
}

export async function generateAIImpactStory(inputData: any) {
  const res = await fetch(`${API_BASE}/ai/impact-story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputData),
  });
  if (!res.ok) throw new Error('Failed to generate impact story');
  return res.json();
}

export async function analyzeAIPrompt(prompt: string) {
  const res = await fetch(`${API_BASE}/ai/analyze-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('Failed to analyze prompt with AI');
  return res.json();
}

export async function analyzeFoodImageAI(imageData: string, mimeType?: string) {
  const res = await fetch(`${API_BASE}/ai/analyze-food-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData, mimeType }),
  });
  if (!res.ok) throw new Error('Failed to analyze food image');
  return res.json();
}

export async function fetchImpactStats() {
  const res = await fetch(`${API_BASE}/impact`);
  if (!res.ok) throw new Error('Failed to fetch impact metrics');
  return res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function fetchNotifications(userId?: string) {
  const res = await fetch(`${API_BASE}/notifications?user_id=${userId || ''}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationRead(id: string) {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to mark notification read');
  return res.json();
}
