// Food listing model
export default class FoodListing {
  constructor(data) {
    this.id = data.id;
    this.donorId = data.donorId;
    this.title = data.title;
    this.description = data.description;
    this.foodType = data.foodType; // e.g., 'prepared', 'produce', 'packaged', 'bakery'
    this.quantity = data.quantity;
    this.quantityUnit = data.quantityUnit; // e.g., 'servings', 'kg', 'items'
    this.expiryDate = data.expiryDate instanceof Date ? data.expiryDate : new Date(data.expiryDate);
    this.pickupStartTime = data.pickupStartTime instanceof Date ? data.pickupStartTime : new Date(data.pickupStartTime);
    this.pickupEndTime = data.pickupEndTime instanceof Date ? data.pickupEndTime : new Date(data.pickupEndTime);
    this.location = data.location; // { latitude, longitude }
    this.address = data.address;
    this.images = data.images || [];
    this.dietaryInfo = data.dietaryInfo || []; // e.g., ['vegetarian', 'contains-dairy']
    this.allergens = data.allergens || []; // e.g., ['nuts', 'gluten', 'dairy']
    this.status = data.status || 'available'; // 'available', 'reserved', 'completed', 'expired'
    this.createdAt = data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt);
    this.updatedAt = data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);
    this.servesEstimate = data.servesEstimate || 0; // Estimated number of people this food can serve
  }

  // Check if the listing is expired
  isExpired() {
    return new Date() > this.expiryDate;
  }

  // Check if pickup time is valid (current time is within pickup window)
  isPickupTimeValid() {
    const now = new Date();
    return now >= this.pickupStartTime && now <= this.pickupEndTime;
  }

  // Calculate time remaining until expiry
  getTimeUntilExpiry() {
    const now = new Date();
    const diffMs = this.expiryDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} left`;
    }
    
    if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} left`;
    }
    
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  }
}