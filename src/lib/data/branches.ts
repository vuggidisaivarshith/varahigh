import { Branch } from '@/types/database';

export interface VerifiedBranch extends Branch {
  verified_address: boolean;
  owner_verification_status: 'verified' | 'pending_owner_pin';
  google_map_link?: string;
  landmark_notes?: string;
}

export const VERIFIED_CONTACTS = {
  business_name: 'VARAHI GIRLS HOSTEL',
  flagship_name: 'Varahi Girls Hostel — Branch 1',
  owner_proprietor: 'E. Bharath Chandra',
  owner_title: 'Proprietor & Founder',
  phones: ['+91 93919 44082'],
  primary_phone: '+91 93919 44082',
  secondary_phone: '+91 93919 44082',
  whatsapp_number: '919391944082',
  flagship_address: 'Near RGIA Airport Hub & Collegiate Corridor, Shamshabad, Hyderabad, Telangana — 501218',
  location_city: 'Shamshabad, Hyderabad, Telangana',
  google_knowledge_link: 'https://share.google/Jrs3jOQCx9tmhZapP',
  google_map_link: 'https://share.google/Jrs3jOQCx9tmhZapP',
  instagram_profile: 'https://share.google/Jrs3jOQCx9tmhZapP',
  instagram_handle: '@varahigirlshostel',
  google_rating: '4.9★ on Google (Varaahi Girls Hostel)',
};

export const VARAHI_BRANCHES: VerifiedBranch[] = [
  {
    id: 'b1-girls-branch-1',
    branch_code: 1,
    name: 'Varahi Girls Hostel — Branch 1',
    gender_category: 'girls',
    address_line1: 'Near RGIA Airport Hub & Collegiate Corridor',
    address_line2: 'Shamshabad (Opp. Bus Transit / College Zone)',
    city: 'Shamshabad, Hyderabad',
    state: 'Telangana',
    pincode: '501218',
    contact_phone: '+91 93919 44082',
    contact_email: 'contact@varahigirlshostel.com',
    total_floors: 5,
    distance_from_rgia: '5-8 Mins to RGIA Airport Terminal, Cargo Gate & College Buses',
    starting_price_per_month: 7000,
    status: 'active',
    verified_address: true,
    owner_verification_status: 'verified',
    google_map_link: 'https://share.google/Jrs3jOQCx9tmhZapP',
    landmark_notes: 'High-security exclusive women residence with resident lady warden — Verified Google Business Listing',
    description: 'Varahi Girls Hostel is a premium, high-security residence designed exclusively for female students, working women, and aviation professionals in Shamshabad. Featuring multi-tier CCTV surveillance, biometric security, resident lady wardens, nutritious 3-times daily home-cooked buffet meals, high-speed fiber Wi-Fi, attached bathrooms with 24/7 hot water geysers, inverter power backup, and automatic laundry facilities.',
    key_highlights: [
      'Exclusively for Women: Female college students, working professionals & airport crew',
      'Multi-tier 24/7 security: Resident lady warden, continuous CCTV surveillance & visitor logging',
      '3-times daily homely buffet meals (South & North Indian) with morning/night shift food packs',
      'Spacious AC & Non-AC room configurations with attached washrooms & 24/7 hot water',
      'Direct contact with Proprietor E. Bharath Chandra (+91 93919 44082)',
      'Verified Google Listing: Rated 4.9★'
    ],
    facilities: [
      '24/7 CCTV Surveillance & Resident Lady Warden',
      'Biometric / Secured Gated Entry with Visitor Log',
      'Attached Bathrooms with 24/7 Hot Water Geysers',
      'High-Speed Unlimited Fiber Wi-Fi Network',
      '3-Times Homely Buffet Meals (South & North Indian)',
      'Heavy Duty Generator & Inverter Power Backup',
      'Multi-Stage RO Purified Drinking Water on Every Floor',
      'Automatic Washing Machines & Dedicated Clothes Drying Area',
      'Daily Professional Housekeeping & Sanitization',
      'Quiet Study Desks & Ergonomic Wardrobe Storage'
    ],
    images: [
      '/images/branches/branch1-main.svg',
      '/images/branches/branch5-main.svg'
    ]
  }
];

// Compatibility alias for existing imports
export const DEVI_BRANCHES = VARAHI_BRANCHES;

export function getBranchByCode(code: number): VerifiedBranch | undefined {
  return VARAHI_BRANCHES.find(b => b.branch_code === code) || VARAHI_BRANCHES[0];
}

export function getBranchById(id: string): VerifiedBranch | undefined {
  return VARAHI_BRANCHES.find(b => b.id === id || b.branch_code.toString() === id) || VARAHI_BRANCHES[0];
}
