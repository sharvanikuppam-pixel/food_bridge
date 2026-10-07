"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mockData_1 = require("../mockData");
const matchingEngine_1 = require("../services/matchingEngine");
const urgencyEngine_1 = require("../services/urgencyEngine");
const geminiService_1 = require("../services/geminiService");
const router = (0, express_1.Router)();
// ----------------------------------------------------
// 1. DONATIONS ENDPOINTS
// ----------------------------------------------------
// GET /api/donations
router.get('/donations', (req, res) => {
    try {
        const { status, food_type, urgency, donor_id, search } = req.query;
        let filtered = [...mockData_1.mockDonations];
        // Auto-recalculate urgency for active items
        filtered = filtered.map((d) => {
            const uInfo = (0, urgencyEngine_1.calculateUrgency)(d.expires_at);
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
            filtered = filtered.filter((d) => d.food_name.toLowerCase().includes(q) ||
                d.description.toLowerCase().includes(q) ||
                d.address.toLowerCase().includes(q));
        }
        // Sort: Critical & High urgency first, then by created_at desc
        filtered.sort((a, b) => {
            const urgencyRank = { CRITICAL: 5, HIGH: 4, MEDIUM: 3, LOW: 2, EXPIRED: 1 };
            return (urgencyRank[b.urgency] || 0) - (urgencyRank[a.urgency] || 0);
        });
        res.json({ success: true, count: filtered.length, data: filtered });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// GET /api/donations/:id
router.get('/donations/:id', (req, res) => {
    try {
        const { id } = req.params;
        const donation = mockData_1.mockDonations.find((d) => d.id === id);
        if (!donation) {
            return res.status(404).json({ success: false, error: 'Donation not found' });
        }
        const urgencyInfo = (0, urgencyEngine_1.calculateUrgency)(donation.expires_at);
        donation.urgency = urgencyInfo.urgency;
        const rankedMatches = (0, matchingEngine_1.rankNGOsForDonation)(donation, mockData_1.mockNGOs);
        res.json({
            success: true,
            data: {
                ...donation,
                urgencyInfo,
                bestMatch: rankedMatches[0] || null,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// POST /api/donations
router.post('/donations', (req, res) => {
    try {
        const body = req.body;
        if (!body.food_name || !body.servings || !body.expires_at || !body.address) {
            return res
                .status(400)
                .json({ success: false, error: 'Missing required fields: food_name, servings, expires_at, address' });
        }
        const urgencyInfo = (0, urgencyEngine_1.calculateUrgency)(body.expires_at);
        const newDonation = {
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
            image_url: body.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
            created_at: new Date().toISOString(),
        };
        mockData_1.mockDonations.unshift(newDonation);
        // Calculate smart matches immediately
        const rankedMatches = (0, matchingEngine_1.rankNGOsForDonation)(newDonation, mockData_1.mockNGOs);
        // Create notification for NGOs
        if (rankedMatches.length > 0) {
            mockData_1.mockNotifications.unshift({
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
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// GET /api/donations/:id/matches
router.get('/donations/:id/matches', (req, res) => {
    try {
        const { id } = req.params;
        const donation = mockData_1.mockDonations.find((d) => d.id === id);
        if (!donation) {
            return res.status(404).json({ success: false, error: 'Donation not found' });
        }
        const matches = (0, matchingEngine_1.rankNGOsForDonation)(donation, mockData_1.mockNGOs);
        res.json({
            success: true,
            donation,
            matches,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// POST /api/donations/:id/claim
router.post('/donations/:id/claim', (req, res) => {
    try {
        const { id } = req.params;
        const { ngo_id } = req.body;
        const donation = mockData_1.mockDonations.find((d) => d.id === id);
        if (!donation) {
            return res.status(404).json({ success: false, error: 'Donation not found' });
        }
        const ngo = mockData_1.mockNGOs.find((n) => n.id === ngo_id) || mockData_1.mockNGOs[0];
        const matchInfo = (0, matchingEngine_1.computeMatchScore)(donation, ngo);
        donation.status = 'CLAIMED';
        const newClaim = {
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
        mockData_1.mockClaims.unshift(newClaim);
        // Create notification for donor
        mockData_1.mockNotifications.unshift({
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
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// PATCH /api/claims/:id/status
router.patch('/claims/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // PICKUP_ASSIGNED | PICKUP_IN_PROGRESS | DELIVERED | COMPLETED
        const claim = mockData_1.mockClaims.find((c) => c.id === id);
        if (!claim) {
            return res.status(404).json({ success: false, error: 'Claim not found' });
        }
        claim.status = status;
        if (status === 'COMPLETED') {
            claim.completed_at = new Date().toISOString();
        }
        const donation = mockData_1.mockDonations.find((d) => d.id === claim.donation_id);
        if (donation) {
            donation.status = status;
        }
        res.json({
            success: true,
            message: `Status updated to ${status}`,
            claim,
            donation,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// ----------------------------------------------------
// 2. NGO ENDPOINTS
// ----------------------------------------------------
router.get('/ngos', (req, res) => {
    res.json({ success: true, count: mockData_1.mockNGOs.length, data: mockData_1.mockNGOs });
});
router.get('/ngos/:id', (req, res) => {
    const ngo = mockData_1.mockNGOs.find((n) => n.id === req.params.id);
    if (!ngo)
        return res.status(404).json({ success: false, error: 'NGO not found' });
    res.json({ success: true, data: ngo });
});
// ----------------------------------------------------
// 3. AI GEMINI ENDPOINTS
// ----------------------------------------------------
// POST /api/ai/donation-description
router.post('/ai/donation-description', async (req, res) => {
    try {
        const description = await (0, geminiService_1.generateDonationDescription)(req.body);
        res.json({ success: true, description });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// POST /api/ai/match-explanation
router.post('/ai/match-explanation', async (req, res) => {
    try {
        const { donation, ngo, matchScore, reasons } = req.body;
        const explanation = await (0, geminiService_1.explainMatch)(donation, ngo, matchScore, reasons || []);
        res.json({ success: true, explanation });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// POST /api/ai/impact-story
router.post('/ai/impact-story', async (req, res) => {
    try {
        const story = await (0, geminiService_1.generateImpactStory)(req.body);
        res.json({ success: true, story });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// POST /api/ai/analyze-prompt
router.post('/ai/analyze-prompt', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, error: 'Prompt text is required' });
        }
        const result = await (0, geminiService_1.analyzeDonationInput)(prompt);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// POST /api/ai/analyze-food-image
router.post('/ai/analyze-food-image', async (req, res) => {
    try {
        const { image, mimeType } = req.body;
        if (!image) {
            return res.status(400).json({ success: false, error: 'Image data is required' });
        }
        const result = await (0, geminiService_1.analyzeFoodImage)(image, mimeType);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// ----------------------------------------------------
// 4. NOTIFICATIONS ENDPOINTS
// ----------------------------------------------------
router.get('/notifications', (req, res) => {
    const { user_id } = req.query;
    let notifs = [...mockData_1.mockNotifications];
    if (user_id) {
        notifs = notifs.filter((n) => n.user_id === String(user_id));
    }
    res.json({ success: true, data: notifs });
});
router.patch('/notifications/:id/read', (req, res) => {
    const notif = mockData_1.mockNotifications.find((n) => n.id === req.params.id);
    if (notif)
        notif.read = true;
    res.json({ success: true, data: notif });
});
// ----------------------------------------------------
// 5. IMPACT & ANALYTICS ENDPOINTS
// ----------------------------------------------------
router.get('/impact', (req, res) => {
    const completedDonations = mockData_1.mockDonations.filter((d) => d.status === 'COMPLETED' || d.status === 'DELIVERED' || d.status === 'CLAIMED');
    const totalMeals = completedDonations.reduce((acc, d) => acc + d.servings, 1240);
    const totalDonations = mockData_1.mockDonations.length + 34;
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
        { name: 'Active/Claimed', value: mockData_1.mockDonations.filter((d) => d.status !== 'COMPLETED').length },
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
router.get('/admin/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalUsers: mockData_1.mockProfiles.length + 42,
            activeDonors: mockData_1.mockProfiles.filter((p) => p.role === 'donor').length + 28,
            verifiedNGOs: mockData_1.mockNGOs.length,
            totalDonations: mockData_1.mockDonations.length + 34,
            activePickups: mockData_1.mockClaims.filter((c) => c.status !== 'COMPLETED').length,
            systemHealth: '100% Operational',
            recentLogs: [
                { id: 'l1', action: 'NEW_DONATION_CREATED', entity: 'Fresh Paneer Curry', user: 'Priya Sharma', time: '10 mins ago' },
                { id: 'l2', action: 'CLAIM_SUBMITTED', entity: 'Hope Community Kitchen', user: 'Father Joseph', time: '25 mins ago' },
                { id: 'l3', action: 'NGO_VERIFIED', entity: 'Anna Seva Trust', user: 'Admin', time: '2 hours ago' },
            ],
        },
    });
});
exports.default = router;
