export interface MockProfile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'donor' | 'ngo' | 'admin';
  organization_name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface MockNGO {
  id: string;
  profile_id: string;
  organization_name: string;
  description: string;
  service_area: string;
  capacity: number;
  food_preferences: string[];
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  verified: boolean;
}

export interface MockDonation {
  id: string;
  donor_id: string;
  donor_name: string;
  donor_org: string;
  food_name: string;
  category: string;
  food_type: 'vegetarian' | 'non-vegetarian' | 'vegan';
  quantity: number;
  unit: string;
  servings: number;
  description: string;
  prepared_at: string;
  available_from: string;
  expires_at: string;
  pickup_deadline: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED';
  status: 'CREATED' | 'MATCHING' | 'CLAIMED' | 'PICKUP_ASSIGNED' | 'PICKUP_IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  image_url?: string;
  created_at: string;
}

export interface MockClaim {
  id: string;
  donation_id: string;
  ngo_id: string;
  ngo_name: string;
  match_score: number;
  match_reason: string;
  status: 'CLAIMED' | 'PICKUP_ASSIGNED' | 'PICKUP_IN_PROGRESS' | 'DELIVERED' | 'COMPLETED';
  claimed_at: string;
  pickup_time?: string;
  completed_at?: string;
}

export interface MockNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

// Initial mock data store
export const mockProfiles: MockProfile[] = [
  {
    id: 'prof-donor-1',
    full_name: 'Priya Sharma',
    email: 'priya@greenleaf.com',
    phone: '+91 98765 43210',
    role: 'donor',
    organization_name: 'Green Leaf Restaurant',
    address: '102 MG Road, Brigade Junction',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    id: 'prof-donor-2',
    full_name: 'Prof. Rajesh Verma',
    email: 'rajesh@canteen.edu',
    phone: '+91 98123 45678',
    role: 'donor',
    organization_name: 'Campus Canteen',
    address: 'Koramangala 4th Block',
    city: 'Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
  },
  {
    id: 'prof-ngo-1',
    full_name: 'Father Joseph',
    email: 'joseph@hopecommunity.org',
    phone: '+91 97654 32109',
    role: 'ngo',
    organization_name: 'Hope Community Kitchen',
    address: '14 Residency Road',
    city: 'Bengaluru',
    latitude: 12.9650,
    longitude: 77.6010,
  },
  {
    id: 'prof-ngo-2',
    full_name: 'Sunita Rao',
    email: 'sunita@helpinghands.org',
    phone: '+91 96543 21098',
    role: 'ngo',
    organization_name: 'Helping Hands Foundation',
    address: '88 Koramangala 8th Block',
    city: 'Bengaluru',
    latitude: 12.9380,
    longitude: 77.6180,
  },
  {
    id: 'prof-ngo-3',
    full_name: 'Dr. Ramesh Kumar',
    email: 'ramesh@careshare.org',
    phone: '+91 95432 10987',
    role: 'ngo',
    organization_name: 'Care & Share Center',
    address: '45 Whitefield Main Road',
    city: 'Bengaluru',
    latitude: 12.9698,
    longitude: 77.7500,
  },
  {
    id: 'prof-admin-1',
    full_name: 'Platform Admin',
    email: 'admin@foodbridge.ai',
    phone: '+91 99999 00000',
    role: 'admin',
    organization_name: 'FoodBridge AI HQ',
    address: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    latitude: 12.9784,
    longitude: 77.6408,
  }
];

export const mockNGOs: MockNGO[] = [
  {
    id: 'ngo-1',
    profile_id: 'prof-ngo-1',
    organization_name: 'Hope Community Kitchen',
    description: 'Providing daily fresh meals and emergency food relief to underprivileged families and urban shelters.',
    service_area: 'MG Road, Central Bengaluru, Shanthi Nagar',
    capacity: 500,
    food_preferences: ['vegetarian', 'non-vegetarian', 'vegan'],
    address: '14 Residency Road, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9650,
    longitude: 77.6010,
    verified: true,
  },
  {
    id: 'ngo-2',
    profile_id: 'prof-ngo-2',
    organization_name: 'Helping Hands Foundation',
    description: 'Empowering local communities through hot meal distribution and food rescue programs.',
    service_area: 'Koramangala, BTM Layout, HSR Layout',
    capacity: 350,
    food_preferences: ['vegetarian', 'vegan'],
    address: '88 Koramangala 8th Block, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9380,
    longitude: 77.6180,
    verified: true,
  },
  {
    id: 'ngo-3',
    profile_id: 'prof-ngo-3',
    organization_name: 'Care & Share Center',
    description: 'Dedicated shelter feeding center supporting migrant workers and children schools.',
    service_area: 'Whitefield, Marathahalli, Bellandur',
    capacity: 600,
    food_preferences: ['vegetarian', 'non-vegetarian'],
    address: '45 Whitefield Main Road, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9698,
    longitude: 77.7500,
    verified: true,
  },
  {
    id: 'ngo-4',
    profile_id: 'prof-ngo-4',
    organization_name: 'Anna Seva Trust',
    description: 'Zero food waste initiative distributing nutritious food packages across South Bengaluru.',
    service_area: 'Jayanagar, JP Nagar, Banashankari',
    capacity: 400,
    food_preferences: ['vegetarian', 'vegan'],
    address: '22 South End Circle, Jayanagar, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9250,
    longitude: 77.5800,
    verified: true,
  }
];

const now = new Date();
const addHours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
const subHours = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

export let mockDonations: MockDonation[] = [
  {
    id: 'don-1',
    donor_id: 'prof-donor-1',
    donor_name: 'Priya Sharma',
    donor_org: 'Green Leaf Restaurant',
    food_name: 'Fresh Paneer Curry & Chapati Meals',
    category: 'Cooked Meals',
    food_type: 'vegetarian',
    quantity: 50,
    unit: 'boxes',
    servings: 50,
    description: '50 freshly prepared vegetarian meals packaged in hygienic containers from lunch buffet surplus.',
    prepared_at: subHours(1),
    available_from: subHours(1),
    expires_at: addHours(1.33), // ~1h 20m
    pickup_deadline: addHours(1),
    address: '102 MG Road, Brigade Junction, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    urgency: 'HIGH',
    status: 'CREATED',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    created_at: subHours(1),
  },
  {
    id: 'don-2',
    donor_id: 'prof-donor-2',
    donor_name: 'Prof. Rajesh Verma',
    donor_org: 'Campus Canteen',
    food_name: 'Vegetable Biryani Packets',
    category: 'Cooked Meals',
    food_type: 'vegetarian',
    quantity: 25,
    unit: 'packets',
    servings: 25,
    description: 'Hot vegetable biryani packets prepared for college event, ready for immediate pickup.',
    prepared_at: subHours(2),
    available_from: subHours(2),
    expires_at: addHours(0.4), // ~24 minutes remaining
    pickup_deadline: addHours(0.3),
    address: 'Koramangala 4th Block, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    urgency: 'CRITICAL',
    status: 'CREATED',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    created_at: subHours(2),
  },
  {
    id: 'don-3',
    donor_id: 'prof-donor-1',
    donor_name: 'Priya Sharma',
    donor_org: 'Green Leaf Restaurant',
    food_name: 'Mixed Rice & Vegetable Curry',
    category: 'Cooked Meals',
    food_type: 'vegetarian',
    quantity: 120,
    unit: 'servings',
    servings: 120,
    description: '120 portions of rice, dal, and mixed vegetable curry packed in large insulated food containers.',
    prepared_at: subHours(1),
    available_from: subHours(1),
    expires_at: addHours(4.5), // 4h 30m
    pickup_deadline: addHours(4),
    address: '102 MG Road, Brigade Junction, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    urgency: 'MEDIUM',
    status: 'CLAIMED',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    created_at: subHours(3),
  },
  {
    id: 'don-4',
    donor_id: 'prof-donor-1',
    donor_name: 'Priya Sharma',
    donor_org: 'Green Leaf Restaurant',
    food_name: 'Fresh Bakery Bread & Sandwiches',
    category: 'Bakery & Snacks',
    food_type: 'vegetarian',
    quantity: 80,
    unit: 'items',
    servings: 80,
    description: 'Assorted baked artisan loaves, whole wheat sandwiches, and rolls.',
    prepared_at: subHours(4),
    available_from: subHours(4),
    expires_at: addHours(8),
    pickup_deadline: addHours(7),
    address: '102 MG Road, Brigade Junction, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    urgency: 'LOW',
    status: 'COMPLETED',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    created_at: subHours(12),
  }
];

export let mockClaims: MockClaim[] = [
  {
    id: 'claim-1',
    donation_id: 'don-3',
    ngo_id: 'ngo-1',
    ngo_name: 'Hope Community Kitchen',
    match_score: 94,
    match_reason: 'Proximity 2.4km, capacity matched (500 servings), accepts vegetarian meals.',
    status: 'CLAIMED',
    claimed_at: subHours(2),
    pickup_time: addHours(1),
  },
  {
    id: 'claim-2',
    donation_id: 'don-4',
    ngo_id: 'ngo-2',
    ngo_name: 'Helping Hands Foundation',
    match_score: 88,
    match_reason: 'Capacity match, high bakery preference, fast pickup vehicle dispatched.',
    status: 'COMPLETED',
    claimed_at: subHours(10),
    pickup_time: subHours(8),
    completed_at: subHours(7),
  }
];

export let mockNotifications: MockNotification[] = [
  {
    id: 'notif-1',
    user_id: 'prof-donor-1',
    title: 'Donation Claimed!',
    message: 'Your donation of 120 Rice & Curry Packets was claimed by Hope Community Kitchen.',
    type: 'claim',
    read: false,
    created_at: subHours(2),
  },
  {
    id: 'notif-2',
    user_id: 'prof-ngo-1',
    title: 'High Priority Food Nearby',
    message: '50 Vegetarian Meals available 2.4 km away from Green Leaf Restaurant.',
    type: 'donation',
    read: true,
    created_at: subHours(1),
  },
  {
    id: 'notif-3',
    user_id: 'prof-donor-2',
    title: 'Urgent Expiry Alert',
    message: 'Your donation of Vegetable Biryani Packets expires in 24 minutes!',
    type: 'expiry',
    read: false,
    created_at: subHours(0.1),
  }
];
