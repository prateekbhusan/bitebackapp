// User model
export default class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.phone = data.phone;
    this.userType = data.userType; // 'donor', 'receiver', 'volunteer'
    this.profilePicture = data.profilePicture || null;
    this.location = data.location || null; // { latitude, longitude }
    this.address = data.address || null;
    this.bio = data.bio || '';
    this.organizationName = data.organizationName || null;
    this.organizationType = data.organizationType || null; // 'restaurant', 'grocery', 'event', 'ngo', 'shelter'
    this.website = data.website || null;
    this.pushToken = data.pushToken || null;
    this.createdAt = data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt);
    this.updatedAt = data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);
    
    // Impact metrics
    this.totalDonations = data.totalDonations || 0;
    this.totalReceived = data.totalReceived || 0;
    this.totalDeliveries = data.totalDeliveries || 0;
    this.mealsSaved = data.mealsSaved || 0;
    this.carbonFootprint = data.carbonFootprint || 0; // in kg of CO2 equivalent
  }

  // Check if user is a donor
  isDonor() {
    return this.userType === 'donor';
  }

  // Check if user is a receiver
  isReceiver() {
    return this.userType === 'receiver';
  }

  // Check if user is a volunteer
  isVolunteer() {
    return this.userType === 'volunteer';
  }

  // Get user's display name (organization name or personal name)
  getDisplayName() {
    return this.organizationName || this.name;
  }
}