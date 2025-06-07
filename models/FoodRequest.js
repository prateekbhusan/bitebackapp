// Food request model
export default class FoodRequest {
  constructor(data) {
    this.id = data.id;
    this.listingId = data.listingId;
    this.receiverId = data.receiverId;
    this.volunteerId = data.volunteerId || null;
    this.status = data.status || 'pending'; // 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
    this.pickupTime = data.pickupTime instanceof Date ? data.pickupTime : data.pickupTime ? new Date(data.pickupTime) : null;
    this.notes = data.notes || '';
    this.receiverType = data.receiverType || 'individual'; // 'individual', 'ngo', 'shelter'
    this.peopleToFeed = data.peopleToFeed || 0;
    this.needsDelivery = data.needsDelivery || false;
    this.deliveryAddress = data.deliveryAddress || null;
    this.deliveryLocation = data.deliveryLocation || null; // { latitude, longitude }
    this.createdAt = data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt);
    this.updatedAt = data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);
  }

  // Check if the request is pending
  isPending() {
    return this.status === 'pending';
  }

  // Check if the request is accepted
  isAccepted() {
    return this.status === 'accepted';
  }

  // Check if the request is completed
  isCompleted() {
    return this.status === 'completed';
  }

  // Check if the request is cancelled or rejected
  isCancelled() {
    return this.status === 'cancelled' || this.status === 'rejected';
  }

  // Check if the request needs a volunteer
  needsVolunteer() {
    return this.needsDelivery && !this.volunteerId && this.status === 'accepted';
  }
}