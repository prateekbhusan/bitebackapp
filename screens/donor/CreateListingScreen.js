import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useLocation } from '../../contexts/LocationContext';
import { useUser } from '../../contexts/UserContext';
import mockData from '../../services/mockData';
import { addHours } from 'date-fns';

const foodTypes = [
  { id: 'prepared', label: 'Prepared Meals', icon: 'restaurant-outline' },
  { id: 'produce', label: 'Fresh Produce', icon: 'nutrition-outline' },
  { id: 'bakery', label: 'Bakery Items', icon: 'pizza-outline' },
  { id: 'dairy', label: 'Dairy Products', icon: 'water-outline' },
  { id: 'packaged', label: 'Packaged Foods', icon: 'cube-outline' },
  { id: 'other', label: 'Other', icon: 'fast-food-outline' },
];

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'contains-meat', label: 'Contains Meat' },
  { id: 'contains-dairy', label: 'Contains Dairy' },
];

const allergenOptions = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'soy', label: 'Soy' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'fish', label: 'Fish' },
];

export default function CreateListingScreen({ navigation }) {
  const { user } = useUser();
  const { location, getAddressFromCoordinates } = useLocation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [foodType, setFoodType] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('servings');
  const [servesEstimate, setServesEstimate] = useState('');
  const [pickupStartHour, setPickupStartHour] = useState('');
  const [pickupEndHour, setPickupEndHour] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [images, setImages] = useState([]);
  const [dietaryInfo, setDietaryInfo] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set address from current location
  React.useEffect(() => {
    if (location && useCurrentLocation) {
      getAddressFromCoordinates(location.coords.latitude, location.coords.longitude)
        .then(addressObj => {
          if (addressObj) {
            const formattedAddress = [
              addressObj.street,
              addressObj.city,
              addressObj.region,
              addressObj.postalCode,
              addressObj.country
            ].filter(Boolean).join(', ');
            
            setAddress(formattedAddress);
          }
        })
        .catch(error => {
          console.error('Error getting address:', error);
        });
    }
  }, [location, useCurrentLocation]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to add images.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const toggleDietaryOption = (optionId) => {
    if (dietaryInfo.includes(optionId)) {
      setDietaryInfo(dietaryInfo.filter(id => id !== optionId));
    } else {
      setDietaryInfo([...dietaryInfo, optionId]);
    }
  };

  const toggleAllergen = (allergenId) => {
    if (allergens.includes(allergenId)) {
      setAllergens(allergens.filter(id => id !== allergenId));
    } else {
      setAllergens([...allergens, allergenId]);
    }
  };

  const validateForm = () => {
    if (!title) return 'Please enter a title';
    if (!description) return 'Please enter a description';
    if (!foodType) return 'Please select a food type';
    if (!quantity || isNaN(Number(quantity))) return 'Please enter a valid quantity';
    if (!servesEstimate || isNaN(Number(servesEstimate))) return 'Please enter a valid number of servings';
    if (!pickupStartHour || isNaN(Number(pickupStartHour))) return 'Please enter a valid pickup start hour';
    if (!pickupEndHour || isNaN(Number(pickupEndHour))) return 'Please enter a valid pickup end hour';
    if (Number(pickupStartHour) >= Number(pickupEndHour)) return 'Pickup end time must be after start time';
    if (!expiryHours || isNaN(Number(expiryHours))) return 'Please enter valid expiry hours';
    if (!address) return 'Please enter an address';
    
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Form Error', validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const now = new Date();
      const pickupStartTime = new Date(now);
      pickupStartTime.setHours(parseInt(pickupStartHour, 10), 0, 0, 0);
      
      const pickupEndTime = new Date(now);
      pickupEndTime.setHours(parseInt(pickupEndHour, 10), 0, 0, 0);
      
      // If end time is before start time, assume it's the next day
      if (pickupEndTime < pickupStartTime) {
        pickupEndTime.setDate(pickupEndTime.getDate() + 1);
      }
      
      const expiryDate = addHours(now, parseInt(expiryHours, 10));
      
      const listingData = {
        donorId: user?.id || '1', // Default to first donor in mock data
        title,
        description,
        foodType,
        quantity: parseInt(quantity, 10),
        quantityUnit,
        expiryDate,
        pickupStartTime,
        pickupEndTime,
        location: useCurrentLocation && location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } : null, // In a real app, we would geocode the address if not using current location
        address,
        images,
        dietaryInfo,
        allergens,
        servesEstimate: parseInt(servesEstimate, 10),
        status: 'available',
      };
      
      const newListing = await mockData.createFoodListing(listingData);
      
      Alert.alert(
        'Success',
        'Your food listing has been created!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Food Listing</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="E.g., Leftover Catering Food"
                maxLength={50}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the food, its condition, etc."
                multiline
                numberOfLines={4}
                maxLength={300}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Food Type</Text>
              <View style={styles.foodTypeContainer}>
                {foodTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.foodTypeButton,
                      foodType === type.id && styles.foodTypeButtonSelected
                    ]}
                    onPress={() => setFoodType(type.id)}
                  >
                    <Ionicons
                      name={type.icon}
                      size={24}
                      color={foodType === type.id ? '#fff' : '#4CAF50'}
                    />
                    <Text
                      style={[
                        styles.foodTypeText,
                        foodType === type.id && styles.foodTypeTextSelected
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Amount"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      quantityUnit === 'servings' && styles.unitButtonSelected
                    ]}
                    onPress={() => setQuantityUnit('servings')}
                  >
                    <Text style={quantityUnit === 'servings' ? styles.unitTextSelected : styles.unitText}>
                      Servings
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      quantityUnit === 'kg' && styles.unitButtonSelected
                    ]}
                    onPress={() => setQuantityUnit('kg')}
                  >
                    <Text style={quantityUnit === 'kg' ? styles.unitTextSelected : styles.unitText}>
                      kg
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      quantityUnit === 'items' && styles.unitButtonSelected
                    ]}
                    onPress={() => setQuantityUnit('items')}
                  >
                    <Text style={quantityUnit === 'items' ? styles.unitTextSelected : styles.unitText}>
                      Items
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estimated Servings</Text>
              <TextInput
                style={styles.input}
                value={servesEstimate}
                onChangeText={setServesEstimate}
                placeholder="How many people can this feed?"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Pickup & Expiry</Text>
            
            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Pickup Start (24h)</Text>
                <TextInput
                  style={styles.input}
                  value={pickupStartHour}
                  onChangeText={setPickupStartHour}
                  placeholder="e.g., 14 for 2 PM"
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Pickup End (24h)</Text>
                <TextInput
                  style={styles.input}
                  value={pickupEndHour}
                  onChangeText={setPickupEndHour}
                  placeholder="e.g., 18 for 6 PM"
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Expiry (hours from now)</Text>
              <TextInput
                style={styles.input}
                value={expiryHours}
                onChangeText={setExpiryHours}
                placeholder="e.g., 24 for 1 day"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Use Current Location</Text>
              <Switch
                value={useCurrentLocation}
                onValueChange={setUseCurrentLocation}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter pickup address"
                editable={!useCurrentLocation}
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Images</Text>
            
            <View style={styles.imagesContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="camera-outline" size={32} color="#4CAF50" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Dietary Information</Text>
            
            <View style={styles.optionsContainer}>
              {dietaryOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    dietaryInfo.includes(option.id) && styles.optionButtonSelected
                  ]}
                  onPress={() => toggleDietaryOption(option.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      dietaryInfo.includes(option.id) && styles.optionTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Allergens</Text>
            
            <View style={styles.optionsContainer}>
              {allergenOptions.map((allergen) => (
                <TouchableOpacity
                  key={allergen.id}
                  style={[
                    styles.optionButton,
                    allergens.includes(allergen.id) && styles.optionButtonSelected
                  ]}
                  onPress={() => toggleAllergen(allergen.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      allergens.includes(allergen.id) && styles.optionTextSelected
                    ]}
                  >
                    {allergen.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  foodTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    minWidth: '45%',
  },
  foodTypeButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  foodTypeText: {
    marginLeft: 8,
    color: '#333',
  },
  foodTypeTextSelected: {
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  unitButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  unitButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  unitText: {
    color: '#333',
  },
  unitTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    margin: 5,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addImageText: {
    marginTop: 5,
    color: '#4CAF50',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});