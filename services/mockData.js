import FoodListing from '../models/FoodListing';
import FoodRequest from '../models/FoodRequest';
import User from '../models/User';
import { addDays, addHours, subDays, subHours } from 'date-fns';

// Mock users
const mockUsers = [
  new User({
    id: '1',
    email: 'restaurant@example.com',
    name: 'John Smith',
    phone: '555-123-4567',
    userType: 'donor',
    organizationName: 'Fresh Eats Restaurant',
    organizationType: 'restaurant',
    address: '123 Main St, Anytown, USA',
    location: { latitude: 37.7749, longitude: -122.4194 },
    bio: 'We are committed to reducing food waste and helping our community.',
    totalDonations: 45,
    mealsSaved: 320,
    carbonFootprint: 560,
    createdAt: subDays(new Date(), 120),
  }),
  new User({
    id: '2',
    email: 'grocery@example.com',
    name: 'Sarah Johnson',
    phone: '555-987-6543',
    userType: 'donor',
    organizationName: 'Green Grocery',
    organizationType: 'grocery',
    address: '456 Oak Ave, Anytown, USA',
    location: { latitude: 37.7739, longitude: -122.4312 },
    bio: 'Local grocery store focused on sustainability and community support.',
    totalDonations: 78,
    mealsSaved: 650,
    carbonFootprint: 890,
    createdAt: subDays(new Date(), 90),
  }),
  new User({
    id: '3',
    email: 'shelter@example.com',
    name: 'Michael Brown',
    phone: '555-456-7890',
    userType: 'receiver',
    organizationName: 'Hope Shelter',
    organizationType: 'shelter',
    address: '789 Pine St, Anytown, USA',
    location: { latitude: 37.7719, longitude: -122.4139 },
    bio: 'Providing shelter and meals to those in need since 2010.',
    totalReceived: 120,
    mealsSaved: 980,
    createdAt: subDays(new Date(), 150),
  }),
  new User({
    id: '4',
    email: 'volunteer@example.com',
    name: 'Jessica Lee',
    phone: '555-789-0123',
    userType: 'volunteer',
    address: '101 Maple Dr, Anytown, USA',
    location: { latitude: 37.7829, longitude: -122.4324 },
    bio: 'Passionate about fighting food waste and hunger in our community.',
    totalDeliveries: 34,
    mealsSaved: 270,
    carbonFootprint: 340,
    createdAt: subDays(new Date(), 60),
  }),
  new User({
    id: '5',
    email: 'foodbank@example.com',
    name: 'David Wilson',
    phone: '555-234-5678',
    userType: 'receiver',
    organizationName: 'Community Food Bank',
    organizationType: 'ngo',
    address: '202 Elm St, Anytown, USA',
    location: { latitude: 37.7699, longitude: -122.4269 },
    bio: 'Distributing food to families in need throughout the city.',
    totalReceived: 230,
    mealsSaved: 1850,
    createdAt: subDays(new Date(), 180),
  }),
];

// Mock food listings
const mockFoodListings = [
  new FoodListing({
    id: '1',
    donorId: '1',
    title: 'Leftover Catering Food',
    description: 'Various appetizers, sandwiches, and salads from a corporate event. All prepared today and properly stored.',
    foodType: 'prepared',
    quantity: 25,
    quantityUnit: 'servings',
    expiryDate: addHours(new Date(), 12),
    pickupStartTime: new Date(),
    pickupEndTime: addHours(new Date(), 4),
    location: { latitude: 37.7749, longitude: -122.4194 },
    address: '123 Main St, Anytown, USA',
    images: [],
    dietaryInfo: ['contains-meat', 'contains-dairy'],
    allergens: ['gluten', 'dairy'],
    status: 'available',
    servesEstimate: 25,
    createdAt: subHours(new Date(), 2),
    updatedAt: subHours(new Date(), 2),
  }),
  new FoodListing({
    id: '2',
    donorId: '2',
    title: 'Fresh Produce Bundle',
    description: 'Assorted fruits and vegetables including apples, oranges, lettuce, tomatoes, and carrots. All fresh and in good condition.',
    foodType: 'produce',
    quantity: 15,
    quantityUnit: 'kg',
    expiryDate: addDays(new Date(), 3),
    pickupStartTime: addHours(new Date(), 1),
    pickupEndTime: addHours(new Date(), 8),
    location: { latitude: 37.7739, longitude: -122.4312 },
    address: '456 Oak Ave, Anytown, USA',
    images: [],
    dietaryInfo: ['vegan', 'vegetarian'],
    allergens: [],
    status: 'available',
    servesEstimate: 30,
    createdAt: subHours(new Date(), 5),
    updatedAt: subHours(new Date(), 5),
  }),
  new FoodListing({
    id: '3',
    donorId: '1',
    title: 'Bread and Pastries',
    description: 'Assorted bread loaves, rolls, and pastries from today\'s baking. All fresh and delicious.',
    foodType: 'bakery',
    quantity: 40,
    quantityUnit: 'items',
    expiryDate: addDays(new Date(), 1),
    pickupStartTime: addHours(new Date(), 2),
    pickupEndTime: addHours(new Date(), 6),
    location: { latitude: 37.7749, longitude: -122.4194 },
    address: '123 Main St, Anytown, USA',
    images: [],
    dietaryInfo: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    status: 'available',
    servesEstimate: 20,
    createdAt: subHours(new Date(), 8),
    updatedAt: subHours(new Date(), 8),
  }),
  new FoodListing({
    id: '4',
    donorId: '2',
    title: 'Dairy Products',
    description: 'Milk, yogurt, and cheese approaching sell-by date but still perfectly good.',
    foodType: 'dairy',
    quantity: 20,
    quantityUnit: 'items',
    expiryDate: addDays(new Date(), 2),
    pickupStartTime: addHours(new Date(), 3),
    pickupEndTime: addHours(new Date(), 10),
    location: { latitude: 37.7739, longitude: -122.4312 },
    address: '456 Oak Ave, Anytown, USA',
    images: [],
    dietaryInfo: ['vegetarian', 'contains-dairy'],
    allergens: ['dairy'],
    status: 'available',
    servesEstimate: 15,
    createdAt: subHours(new Date(), 10),
    updatedAt: subHours(new Date(), 10),
  }),
  new FoodListing({
    id: '5',
    donorId: '1',
    title: 'Prepared Meals',
    description: 'Individual boxed meals including pasta, salad, and dessert. Properly refrigerated.',
    foodType: 'prepared',
    quantity: 15,
    quantityUnit: 'meals',
    expiryDate: addHours(new Date(), 24),
    pickupStartTime: addHours(new Date(), 4),
    pickupEndTime: addHours(new Date(), 8),
    location: { latitude: 37.7749, longitude: -122.4194 },
    address: '123 Main St, Anytown, USA',
    images: [],
    dietaryInfo: ['contains-meat', 'contains-dairy'],
    allergens: ['gluten', 'dairy'],
    status: 'reserved',
    servesEstimate: 15,
    createdAt: subHours(new Date(), 12),
    updatedAt: subHours(new Date(), 6),
  }),
];

// Mock food requests
const mockFoodRequests = [
  new FoodRequest({
    id: '1',
    listingId: '5',
    receiverId: '3',
    volunteerId: '4',
    status: 'accepted',
    pickupTime: addHours(new Date(), 5),
    notes: 'We can pick up anytime during the window. Thank you!',
    receiverType: 'shelter',
    peopleToFeed: 15,
    needsDelivery: true,
    deliveryAddress: '789 Pine St, Anytown, USA',
    deliveryLocation: { latitude: 37.7719, longitude: -122.4139 },
    createdAt: subHours(new Date(), 7),
    updatedAt: subHours(new Date(), 6),
  }),
  new FoodRequest({
    id: '2',
    listingId: '2',
    receiverId: '5',
    status: 'pending',
    notes: 'We would greatly appreciate this produce for our weekly food distribution.',
    receiverType: 'ngo',
    peopleToFeed: 30,
    needsDelivery: false,
    createdAt: subHours(new Date(), 3),
    updatedAt: subHours(new Date(), 3),
  }),
];

// Mock data service
export default {
  // User methods
  getUsers: () => Promise.resolve([...mockUsers]),
  getUserById: (id) => Promise.resolve(mockUsers.find(user => user.id === id) || null),
  getUsersByType: (type) => Promise.resolve(mockUsers.filter(user => user.userType === type)),
  
  // Food listing methods
  getFoodListings: () => Promise.resolve([...mockFoodListings]),
  getFoodListingById: (id) => Promise.resolve(mockFoodListings.find(listing => listing.id === id) || null),
  getFoodListingsByDonor: (donorId) => Promise.resolve(mockFoodListings.filter(listing => listing.donorId === donorId)),
  getAvailableFoodListings: () => Promise.resolve(mockFoodListings.filter(listing => listing.status === 'available' && !listing.isExpired())),
  getNearbyFoodListings: (location, radiusKm = 10) => {
    // Simple distance calculation (not accounting for Earth's curvature)
    const nearbyListings = mockFoodListings.filter(listing => {
      const latDiff = listing.location.latitude - location.latitude;
      const lngDiff = listing.location.longitude - location.longitude;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough conversion to km
      return distance <= radiusKm && listing.status === 'available' && !listing.isExpired();
    });
    return Promise.resolve(nearbyListings);
  },
  createFoodListing: (listingData) => {
    const newListing = new FoodListing({
      id: (mockFoodListings.length + 1).toString(),
      ...listingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockFoodListings.push(newListing);
    return Promise.resolve(newListing);
  },
  updateFoodListing: (id, listingData) => {
    const index = mockFoodListings.findIndex(listing => listing.id === id);
    if (index === -1) return Promise.reject(new Error('Listing not found'));
    
    const updatedListing = new FoodListing({
      ...mockFoodListings[index],
      ...listingData,
      updatedAt: new Date(),
    });
    mockFoodListings[index] = updatedListing;
    return Promise.resolve(updatedListing);
  },
  
  // Food request methods
  getFoodRequests: () => Promise.resolve([...mockFoodRequests]),
  getFoodRequestById: (id) => Promise.resolve(mockFoodRequests.find(request => request.id === id) || null),
  getFoodRequestsByReceiver: (receiverId) => Promise.resolve(mockFoodRequests.filter(request => request.receiverId === receiverId)),
  getFoodRequestsByDonor: (donorId) => {
    const donorListingIds = mockFoodListings
      .filter(listing => listing.donorId === donorId)
      .map(listing => listing.id);
    
    return Promise.resolve(mockFoodRequests.filter(request => donorListingIds.includes(request.listingId)));
  },
  getFoodRequestsByVolunteer: (volunteerId) => Promise.resolve(mockFoodRequests.filter(request => request.volunteerId === volunteerId)),
  createFoodRequest: (requestData) => {
    const newRequest = new FoodRequest({
      id: (mockFoodRequests.length + 1).toString(),
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockFoodRequests.push(newRequest);
    return Promise.resolve(newRequest);
  },
  updateFoodRequest: (id, requestData) => {
    const index = mockFoodRequests.findIndex(request => request.id === id);
    if (index === -1) return Promise.reject(new Error('Request not found'));
    
    const updatedRequest = new FoodRequest({
      ...mockFoodRequests[index],
      ...requestData,
      updatedAt: new Date(),
    });
    mockFoodRequests[index] = updatedRequest;
    return Promise.resolve(updatedRequest);
  },
  
  // Impact metrics methods
  getDonorImpact: (donorId) => {
    const donor = mockUsers.find(user => user.id === donorId);
    if (!donor) return Promise.reject(new Error('Donor not found'));
    
    return Promise.resolve({
      totalDonations: donor.totalDonations,
      mealsSaved: donor.mealsSaved,
      carbonFootprint: donor.carbonFootprint,
    });
  },
  getReceiverImpact: (receiverId) => {
    const receiver = mockUsers.find(user => user.id === receiverId);
    if (!receiver) return Promise.reject(new Error('Receiver not found'));
    
    return Promise.resolve({
      totalReceived: receiver.totalReceived,
      mealsSaved: receiver.mealsSaved,
    });
  },
  getVolunteerImpact: (volunteerId) => {
    const volunteer = mockUsers.find(user => user.id === volunteerId);
    if (!volunteer) return Promise.reject(new Error('Volunteer not found'));
    
    return Promise.resolve({
      totalDeliveries: volunteer.totalDeliveries,
      mealsSaved: volunteer.mealsSaved,
      carbonFootprint: volunteer.carbonFootprint,
    });
  },
  getGlobalImpact: () => {
    return Promise.resolve({
      totalDonations: mockUsers.reduce((sum, user) => sum + (user.totalDonations || 0), 0),
      totalDeliveries: mockUsers.reduce((sum, user) => sum + (user.totalDeliveries || 0), 0),
      mealsSaved: mockUsers.reduce((sum, user) => sum + (user.mealsSaved || 0), 0),
      carbonFootprint: mockUsers.reduce((sum, user) => sum + (user.carbonFootprint || 0), 0),
    });
  },
};