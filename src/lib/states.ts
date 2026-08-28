// All 28 Indian states + 8 Union Territories with major crops grown.
export type StateCrops = { state: string; ut?: boolean; crops: string[] };

export const INDIA_STATES: StateCrops[] = [
  { state: "Andhra Pradesh", crops: ["Rice", "Chilli", "Cotton", "Groundnut", "Tobacco", "Sugarcane", "Tomato", "Turmeric"] },
  { state: "Arunachal Pradesh", crops: ["Rice", "Maize", "Millet", "Ginger", "Orange", "Apple", "Kiwi"] },
  { state: "Assam", crops: ["Rice", "Tea", "Jute", "Sugarcane", "Mustard", "Potato", "Pulses"] },
  { state: "Bihar", crops: ["Rice", "Wheat", "Maize", "Pulses", "Litchi", "Sugarcane", "Potato", "Jute"] },
  { state: "Chhattisgarh", crops: ["Rice", "Maize", "Pulses", "Groundnut", "Sugarcane", "Soybean"] },
  { state: "Goa", crops: ["Rice", "Coconut", "Cashew", "Areca nut", "Banana", "Mango"] },
  { state: "Gujarat", crops: ["Cotton", "Groundnut", "Castor", "Cumin", "Wheat", "Bajra", "Tobacco", "Mango"] },
  { state: "Haryana", crops: ["Wheat", "Rice", "Bajra", "Mustard", "Sugarcane", "Cotton", "Barley"] },
  { state: "Himachal Pradesh", crops: ["Apple", "Wheat", "Maize", "Potato", "Ginger", "Pear", "Plum"] },
  { state: "Jharkhand", crops: ["Rice", "Maize", "Pulses", "Wheat", "Oilseeds", "Vegetables"] },
  { state: "Karnataka", crops: ["Ragi", "Rice", "Jowar", "Sugarcane", "Coffee", "Coconut", "Cotton", "Maize", "Tur", "Onion"] },
  { state: "Kerala", crops: ["Rice", "Coconut", "Rubber", "Tea", "Coffee", "Cardamom", "Pepper", "Banana", "Cashew"] },
  { state: "Madhya Pradesh", crops: ["Wheat", "Soybean", "Pulses", "Cotton", "Gram", "Maize", "Garlic", "Onion"] },
  { state: "Maharashtra", crops: ["Cotton", "Sugarcane", "Jowar", "Bajra", "Soybean", "Onion", "Grapes", "Banana", "Tur"] },
  { state: "Manipur", crops: ["Rice", "Maize", "Pulses", "Pineapple", "Cabbage"] },
  { state: "Meghalaya", crops: ["Rice", "Maize", "Potato", "Turmeric", "Ginger", "Orange"] },
  { state: "Mizoram", crops: ["Rice", "Maize", "Sugarcane", "Ginger", "Banana", "Bamboo"] },
  { state: "Nagaland", crops: ["Rice", "Maize", "Pulses", "Sugarcane", "Potato", "Pineapple"] },
  { state: "Odisha", crops: ["Rice", "Pulses", "Oilseeds", "Sugarcane", "Jute", "Coconut", "Turmeric"] },
  { state: "Punjab", crops: ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Mustard", "Potato", "Basmati"] },
  { state: "Rajasthan", crops: ["Bajra", "Wheat", "Mustard", "Gram", "Moong", "Cumin", "Coriander", "Guar"] },
  { state: "Sikkim", crops: ["Maize", "Rice", "Cardamom", "Ginger", "Orange", "Tea"] },
  { state: "Tamil Nadu", crops: ["Rice", "Sugarcane", "Cotton", "Banana", "Turmeric", "Coconut", "Groundnut", "Tea"] },
  { state: "Telangana", crops: ["Rice", "Cotton", "Maize", "Chilli", "Turmeric", "Tur", "Soybean", "Mango"] },
  { state: "Tripura", crops: ["Rice", "Jute", "Tea", "Sugarcane", "Pineapple", "Rubber"] },
  { state: "Uttar Pradesh", crops: ["Wheat", "Rice", "Sugarcane", "Potato", "Pulses", "Mango", "Mustard", "Mentha"] },
  { state: "Uttarakhand", crops: ["Rice", "Wheat", "Apple", "Mandarin", "Basmati", "Potato", "Tea"] },
  { state: "West Bengal", crops: ["Rice", "Jute", "Tea", "Potato", "Banana", "Pineapple", "Mango", "Mustard"] },
  // Union Territories
  { state: "Andaman & Nicobar Islands", ut: true, crops: ["Coconut", "Areca nut", "Banana", "Rice", "Spices"] },
  { state: "Chandigarh", ut: true, crops: ["Wheat", "Rice", "Maize", "Vegetables"] },
  { state: "Dadra & Nagar Haveli and Daman & Diu", ut: true, crops: ["Rice", "Ragi", "Wheat", "Sugarcane", "Mango"] },
  { state: "Delhi", ut: true, crops: ["Wheat", "Vegetables", "Bajra", "Jowar", "Mustard"] },
  { state: "Jammu & Kashmir", ut: true, crops: ["Apple", "Saffron", "Rice", "Walnut", "Cherry", "Almond"] },
  { state: "Ladakh", ut: true, crops: ["Barley", "Wheat", "Apricot", "Apple", "Vegetables"] },
  { state: "Lakshadweep", ut: true, crops: ["Coconut", "Banana", "Vegetables"] },
  { state: "Puducherry", ut: true, crops: ["Rice", "Sugarcane", "Cotton", "Pulses", "Groundnut"] },
];

export const STATE_NAMES = INDIA_STATES.map((s) => s.state);

export function cropsForState(state: string): string[] {
  const found = INDIA_STATES.find((s) => s.state.toLowerCase() === state.toLowerCase());
  return found?.crops ?? [];
}
