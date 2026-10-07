import { Router, Request, Response } from 'express';
import {
  mockDonations,
  mockNGOs,
  mockProfiles,
  mockClaims,
  mockNotifications,
  MockDonation,
  MockClaim,
  MockNotification,
} from '../mockData';
import { rankNGOsForDonation, computeMatchScore } from '../services/matchingEngine';
import { calculateUrgency } from '../services/urgencyEngine';
import {
  explainMatch,
  generateDonationDescription,
  generateImpactStory,
  analyzeDonationInput,
  analyzeFoodImage,
} from '../services/geminiService';

const router = Router();

// ----------------------------------------------------
// 1. DONATIONS ENDPOINTS
// ----------------------------------------------------

// GET /api/donations
router.get('/donations', (req: Request, res: Response) => {
  try {
    const { status, food_type, urgency, donor_id, search } = req.query;

    let filtered = [...mockDonations];

    // Auto-recalculate urgency for active items
    filtered = filtered.map((d) => {
      const uInfo = calculateUrgency(d.expires_at);
      return {
        ...d,
        urgency: uInfo.urgency,
      };
    });

    if (status) {
      filtered = filtered.filter((d) => d.status.toLowerCase() === String(status).toLowerCase());
    }

    if (food_type && food_type !== 'all') {
      filtered = filtered.filter((d) => d.food_type.toLowerCase() === String(food_type).toLowerCase());
    }

    if (urgency && urgency !== 'all') {
      filtered = filtered.filter((d) => d.urgency.toLowerCase() === String(urgency).toLowerCase());
    }

    if (donor_id) {
      filtered = filtered.filter((d) => d.donor_id === String(donor_id));
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.food_name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q)
      );
    }

    // Sort: Critical & High urgency first, then by created_at desc
    filtered.sort((a, b) => {
      const urgencyRank: Record<string, number> = { CRITICAL: 5, HIGH: 4, MEDIUM: 3, LOW: 2, EXPIRED: 1 };
      return (urgencyRank[b.urgency] || 0) - (urgencyRank[a.urgency] || 0);
    });

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/donations/:id
router.get('/donations/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donation = mockDonations.find((d) => d.id === id);

    if (!donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    const urgencyInfo = calculateUrgency(donation.expires_at);
    donation.urgency = urgencyInfo.urgency;

    const rankedMatches = rankNGOsForDonation(donation, mockNGOs);

    res.json({
      success: true,
      data: {
        ...donation,
        urgencyInfo,
        bestMatch: rankedMatches[0] || null,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/donations
router.post('/donations', (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.food_name || !body.servings || !body.expires_at || !body.address) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required fields: food_name, servings, expires_at, address' });
    }

    const urgencyInfo = calculateUrgency(body.expires_at);

    const newDonation: MockDonation = {
      id: `don-${Date.now()}`,
      donor_id: body.donor_id || 'prof-donor-1',
      donor_name: body.donor_name || 'Priya Sharma',
      donor_org: body.donor_org || 'Green Leaf Restaurant',
      food_name: body.food_name,
      category: body.category || 'Cooked Meals',
      food_type: body.food_type || 'vegetarian',
      quantity: Number(body.quantity) || Number(body.servings),
      unit: body.unit || 'meals',
      servings: Number(body.servings),
      description: body.description || `${body.food_name} ready for donation`,
      prepared_at: body.prepared_at || new Date().toISOString(),
      available_from: body.available_from || new Date().toISOString(),
      expires_at: new Date(body.expires_at).toISOString(),
      pickup_deadline: body.pickup_deadline || new Date(body.expires_at).toISOString(),
      address: body.address,
      city: body.city || 'Bengaluru',
      latitude: body.latitude || 12.9716,
      longitude: body.longitude || 77.5946,
      urgency: urgencyInfo.urgency,
      status: 'CREATED',
      image_url:
        body.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
    };

    mockDonations.unshift(newDonation);

    // Calculate smart matches immediately
    const rankedMatches = rankNGOsForDonation(newDonation, mockNGOs);

    // Create notification for NGOs
    if (rankedMatches.length > 0) {
      mockNotifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: rankedMatches[0].ngo.profile_id,
        title: 'High Priority Food Nearby',
        message: `${newDonation.servings} ${newDonation.food_type} meals available ${rankedMatches[0].breakdown.distanceKm} km away.`,
        type: 'donation',
        read: false,
        created_at: new Date().toISOString(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: newDonation,
      matches: rankedMatches,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/donations/:id/matches
router.get('/donations/:id/matches', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donation = mockDonations.find((d) => d.id === id);

    if (!donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    const matches = rankNGOsForDonation(donation, mockNGOs);

    res.json({
      success: true,
      donation,
      matches,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/donations/:id/claim
router.post('/donations/:id/claim', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ngo_id } = req.body;

    const donation = mockDonations.find((d) => d.id === id);
    if (!donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    const ngo = mockNGOs.find((n) => n.id === ngo_id) || mockNGOs[0];

    const matchInfo = computeMatchScore(donation, ngo);

    donation.status = 'CLAIMED';

    const newClaim: MockClaim = {
      id: `claim-${Date.now()}`,
      donation_id: donation.id,
      ngo_id: ngo.id,
      ngo_name: ngo.organization_name,
      match_score: matchInfo.score,
      match_reason: matchInfo.reasons.join(', '),
      status: 'CLAIMED',
      claimed_at: new Date().toISOString(),
      pickup_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };

    mockClaims.unshift(newClaim);

    // Create notification for donor
    mockNotifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: donation.donor_id,
      title: 'Donation Claimed!',
      message: `Your donation "${donation.food_name}" has been claimed by ${ngo.organization_name}.`,
      type: 'claim',
      read: false,
      created_at: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Donation claimed successfully',
      claim: newClaim,
      donation,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/claims/:id/status
router.patch('/claims/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PICKUP_ASSIGNED | PICKUP_IN_PROGRESS | DELIVERED | COMPLETED

    const claim = mockClaims.find((c) => c.id === id);
    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    claim.status = status;
    if (status === 'COMPLETED') {
      claim.completed_at = new Date().toISOString();
    }

    const donation = mockDonations.find((d) => d.id === claim.donation_id);
    if (donation) {
      donation.status = status;
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      claim,
      donation,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// 2. NGO ENDPOINTS
// ----------------------------------------------------
router.get('/ngos', (req: Request, res: Response) => {
  res.json({ success: true, count: mockNGOs.length, data: mockNGOs });
});

router.get('/ngos/:id', (req: Request, res: Response) => {
  const ngo = mockNGOs.find((n) => n.id === req.params.id);
  if (!ngo) return res.status(404).json({ success: false, error: 'NGO not found' });
  res.json({ success: true, data: ngo });
});

// ----------------------------------------------------
// 3. AI GEMINI ENDPOINTS
// ----------------------------------------------------

// POST /api/ai/donation-description
router.post('/ai/donation-description', async (req: Request, res: Response) => {
  try {
    const description = await generateDonationDescription(req.body);
    res.json({ success: true, description });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/match-explanation
router.post('/ai/match-explanation', async (req: Request, res: Response) => {
  try {
    const { donation, ngo, matchScore, reasons } = req.body;
    const explanation = await explainMatch(donation, ngo, matchScore, reasons || []);
    res.json({ success: true, explanation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/impact-story
router.post('/ai/impact-story', async (req: Request, res: Response) => {
  try {
    const story = await generateImpactStory(req.body);
    res.json({ success: true, story });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/analyze-prompt
router.post('/ai/analyze-prompt', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt text is required' });
    }
    const result = await analyzeDonationInput(prompt);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/analyze-food-image
router.post('/ai/analyze-food-image', async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image data is required' });
    }
    const result = await analyzeFoodImage(image, mimeType);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// 4. NOTIFICATIONS ENDPOINTS
// ----------------------------------------------------
router.get('/notifications', (req: Request, res: Response) => {
  const { user_id } = req.query;
  let notifs = [...mockNotifications];
  if (user_id) {
    notifs = notifs.filter((n) => n.user_id === String(user_id));
  }
  res.json({ success: true, data: notifs });
});

router.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const notif = mockNotifications.find((n) => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true, data: notif });
});

// ----------------------------------------------------
// 5. IMPACT & ANALYTICS ENDPOINTS
// ----------------------------------------------------
router.get('/impact', (req: Request, res: Response) => {
  const completedDonations = mockDonations.filter(
    (d) => d.status === 'COMPLETED' || d.status === 'DELIVERED' || d.status === 'CLAIMED'
  );

  const totalMeals = completedDonations.reduce((acc, d) => acc + d.servings, 1240);
  const totalDonations = mockDonations.length + 34;
  const completedCount = completedDonations.length + 32;
  const totalKgRescued = Math.round(totalMeals * 0.26);
  const peopleReached = Math.round(totalMeals * 0.88);

  const monthlyTrend = [
    { month: 'May', meals: 240, weightKg: 62 },
    { month: 'Jun', meals: 420, weightKg: 109 },
    { month: 'Jul', meals: 680, weightKg: 176 },
    { month: 'Aug', meals: 950, weightKg: 247 },
    { month: 'Sep', meals: 1120, weightKg: 291 },
    { month: 'Oct', meals: totalMeals, weightKg: totalKgRescued },
  ];

  const categoryDistribution = [
    { name: 'Cooked Meals', value: 55 },
    { name: 'Bakery & Snacks', value: 25 },
    { name: 'Fresh Produce', value: 12 },
    { name: 'Packaged Foods', value: 8 },
  ];

  const statusDistribution = [
    { name: 'Completed', value: completedCount },
    { name: 'Active/Claimed', value: mockDonations.filter((d) => d.status !== 'COMPLETED').length },
    { name: 'Expired', value: 2 },
  ];

  res.json({
    success: true,
    data: {
      totalMeals,
      totalDonations,
      completedCount,
      totalKgRescued,
      peopleReached,
      successfulMatchRate: '96.4%',
      avgPickupTimeMinutes: 34,
      monthlyTrend,
      categoryDistribution,
      statusDistribution,
    },
  });
});

// ----------------------------------------------------
// 6. ADMIN ENDPOINTS
// ----------------------------------------------------
router.get('/admin/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      totalUsers: mockProfiles.length + 42,
      activeDonors: mockProfiles.filter((p) => p.role === 'donor').length + 28,
      verifiedNGOs: mockNGOs.length,
      totalDonations: mockDonations.length + 34,
      activePickups: mockClaims.filter((c) => c.status !== 'COMPLETED').length,
      systemHealth: '100% Operational',
      recentLogs: [
        { id: 'l1', action: 'NEW_DONATION_CREATED', entity: 'Fresh Paneer Curry', user: 'Priya Sharma', time: '10 mins ago' },
        { id: 'l2', action: 'CLAIM_SUBMITTED', entity: 'Hope Community Kitchen', user: 'Father Joseph', time: '25 mins ago' },
        { id: 'l3', action: 'NGO_VERIFIED', entity: 'Anna Seva Trust', user: 'Admin', time: '2 hours ago' },
      ],
    },
  });
});

export default router;
