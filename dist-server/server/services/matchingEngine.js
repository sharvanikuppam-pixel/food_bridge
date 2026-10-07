"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistanceKm = calculateDistanceKm;
exports.computeMatchScore = computeMatchScore;
exports.rankNGOsForDonation = rankNGOsForDonation;
const urgencyEngine_1 = require("./urgencyEngine");
// Haversine formula to compute distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Rounded to 1 decimal
}
function computeMatchScore(donation, ngo) {
    // 1. Distance Score (25%)
    const distanceKm = calculateDistanceKm(donation.latitude, donation.longitude, ngo.latitude, ngo.longitude);
    let distanceScore = 100;
    if (distanceKm <= 3) {
        distanceScore = 100;
    }
    else if (distanceKm <= 10) {
        distanceScore = 100 - (distanceKm - 3) * 7;
    }
    else if (distanceKm <= 25) {
        distanceScore = 50 - (distanceKm - 10) * 2.5;
    }
    else {
        distanceScore = Math.max(10, 100 - distanceKm * 3);
    }
    distanceScore = Math.max(0, Math.min(100, distanceScore));
    // 2. Urgency Score (25%)
    const urgencyInfo = (0, urgencyEngine_1.calculateUrgency)(donation.expires_at);
    let urgencyScore = 50;
    switch (urgencyInfo.urgency) {
        case 'CRITICAL':
            urgencyScore = 100;
            break;
        case 'HIGH':
            urgencyScore = 85;
            break;
        case 'MEDIUM':
            urgencyScore = 65;
            break;
        case 'LOW':
            urgencyScore = 45;
            break;
        case 'EXPIRED':
            urgencyScore = 0;
            break;
    }
    // 3. NGO Capacity Score (20%)
    let capacityScore = 100;
    if (ngo.capacity >= donation.servings) {
        capacityScore = 100;
    }
    else if (ngo.capacity > 0) {
        capacityScore = Math.round((ngo.capacity / donation.servings) * 100);
    }
    else {
        capacityScore = 20;
    }
    capacityScore = Math.max(0, Math.min(100, capacityScore));
    // 4. Service Area Score (15%)
    let serviceAreaScore = 70;
    const donationCity = (donation.city || donation.address || '').toLowerCase();
    const ngoCity = ngo.city.toLowerCase();
    const ngoArea = ngo.service_area.toLowerCase();
    if (ngoArea.includes('citywide') || ngoArea.includes('all') || donationCity.includes(ngoCity)) {
        serviceAreaScore = 100;
    }
    else if (donation.address.toLowerCase().includes(ngoArea) || ngoArea.includes(donationCity)) {
        serviceAreaScore = 90;
    }
    else {
        serviceAreaScore = 60;
    }
    // 5. Food Compatibility Score (15%)
    let compatibilityScore = 30;
    const prefs = (ngo.food_preferences || []).map((p) => p.toLowerCase());
    const type = donation.food_type.toLowerCase();
    if (prefs.includes(type) || prefs.includes('all') || prefs.length === 0) {
        compatibilityScore = 100;
    }
    else if (type === 'vegan' && prefs.includes('vegetarian')) {
        compatibilityScore = 90;
    }
    // Calculate Weighted Match Score
    const rawScore = distanceScore * 0.25 +
        urgencyScore * 0.25 +
        capacityScore * 0.20 +
        serviceAreaScore * 0.15 +
        compatibilityScore * 0.15;
    const finalScore = Math.round(rawScore);
    // Generate Checkmarks / Reasons
    const reasons = [];
    reasons.push(`✓ ${distanceKm} km away`);
    if (compatibilityScore >= 90) {
        reasons.push(`✓ Accepts ${donation.food_type} meals`);
    }
    if (capacityScore >= 90) {
        reasons.push(`✓ Capacity available (${ngo.capacity} servings capacity)`);
    }
    else {
        reasons.push(`Partial capacity (${ngo.capacity} of ${donation.servings} meals)`);
    }
    if (serviceAreaScore >= 90) {
        reasons.push(`✓ Serves this area (${ngo.service_area})`);
    }
    if (urgencyInfo.urgency === 'CRITICAL' || urgencyInfo.urgency === 'HIGH') {
        reasons.push(`✓ Can arrange urgent pickup quickly`);
    }
    return {
        ngo,
        score: finalScore,
        breakdown: {
            distanceScore: Math.round(distanceScore),
            distanceKm,
            urgencyScore: Math.round(urgencyScore),
            capacityScore: Math.round(capacityScore),
            serviceAreaScore: Math.round(serviceAreaScore),
            compatibilityScore: Math.round(compatibilityScore),
        },
        reasons,
    };
}
function rankNGOsForDonation(donation, ngos) {
    const matches = ngos.map((ngo) => computeMatchScore(donation, ngo));
    // Sort descending by match score
    return matches.sort((a, b) => b.score - a.score);
}
