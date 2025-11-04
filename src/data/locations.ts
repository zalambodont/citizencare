export interface CountryDefinition {
  code: string;
  name: string;
  callingCode: string;
  phoneFormat: string;
  phoneValidation: {
    requiredLength: number;
    requiredPrefix: string;
  };
  currency: string;
  states: StateDefinition[];
}

export interface StateDefinition {
  name: string;
  cities: string[];
}

export const countries: CountryDefinition[] = [
  {
    code: 'US',
    name: 'United States',
    callingCode: '+1',
    phoneFormat: '555 123 4567',
    phoneValidation: {
      requiredLength: 11,
      requiredPrefix: '1',
    },
    currency: 'USD',
    states: [
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'] },
      { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany'] },
      { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'] },
      { name: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Peoria'] },
      { name: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Bellevue'] },
      { name: 'Massachusetts', cities: ['Boston', 'Cambridge', 'Worcester', 'Springfield'] },
      { name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins'] },
      { name: 'Georgia', cities: ['Atlanta', 'Savannah', 'Augusta', 'Columbus'] },
      { name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing'] },
      { name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler'] },
      { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie'] },
      { name: 'Minnesota', cities: ['Minneapolis', 'Saint Paul', 'Duluth', 'Rochester'] },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    callingCode: '+1',
    phoneFormat: '555 123 4567',
    phoneValidation: {
      requiredLength: 11,
      requiredPrefix: '1',
    },
    currency: 'USD',
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Hamilton', 'London'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Kelowna', 'Richmond'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Sherbrooke'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'] },
      { name: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson'] },
      { name: 'Nova Scotia', cities: ['Halifax', 'Sydney', 'Truro', 'New Glasgow'] },
      { name: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw'] },
      { name: 'Newfoundland and Labrador', cities: ['St. John’s', 'Mount Pearl', 'Corner Brook', 'Gander'] },
      { name: 'New Brunswick', cities: ['Moncton', 'Saint John', 'Fredericton', 'Dieppe'] },
      { name: 'Prince Edward Island', cities: ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall'] },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    callingCode: '+971',
    phoneFormat: '50 123 4567',
    phoneValidation: {
      requiredLength: 12,
      requiredPrefix: '971',
    },
    currency: 'AED',
    states: [
      { name: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain', 'Madinat Zayed', 'Al Dhafra'] },
      { name: 'Dubai', cities: ['Dubai', 'Jebel Ali', 'Hatta', 'Al Barsha'] },
      { name: 'Sharjah', cities: ['Sharjah', 'Khor Fakkan', 'Kalba', 'Dibba Al-Hisn'] },
      { name: 'Ajman', cities: ['Ajman'] },
      { name: 'Ras Al Khaimah', cities: ['Ras Al Khaimah', 'Al Jazirah Al Hamra'] },
      { name: 'Fujairah', cities: ['Fujairah', 'Dibba Al-Fujairah'] },
      { name: 'Umm Al Quwain', cities: ['Umm Al Quwain'] },
    ],
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    callingCode: '+966',
    phoneFormat: '50 123 4567',
    phoneValidation: {
      requiredLength: 12,
      requiredPrefix: '966',
    },
    currency: 'USD',
    states: [
      { name: 'Riyadh Province', cities: ['Riyadh', 'Al Kharj', 'Al Majmaah', 'Diriyah'] },
      { name: 'Makkah Province', cities: ['Jeddah', 'Mecca', 'Taif', 'Rabigh'] },
      { name: 'Eastern Province', cities: ['Dammam', 'Khobar', 'Dhahran', 'Al Hofuf', 'Jubail'] },
      { name: 'Al Madinah Province', cities: ['Medina', 'Yanbu', 'Badr', 'Al-Ula'] },
      { name: 'Asir Province', cities: ['Abha', 'Khamis Mushait', 'Bisha', 'Ahad Rafidah'] },
      { name: 'Tabuk Province', cities: ['Tabuk', 'Umluj', 'Haql', 'Duba'] },
      { name: 'Al-Qassim Province', cities: ['Buraydah', 'Unaizah', 'Ar Rass', 'Al Mithnab'] },
      { name: 'Najran Province', cities: ['Najran', 'Sharurah', 'Badr Al-Janoub'] },
      { name: 'Hail Province', cities: ['Hail', 'Baqaa', 'Ash Shamli'] },
      { name: 'Jazan Province', cities: ['Jazan', 'Sabya', 'Abu Arish', 'Samta'] },
    ],
  },
  {
    code: 'TR',
    name: 'Turkey',
    callingCode: '+90',
    phoneFormat: '555 123 45 67',
    phoneValidation: {
      requiredLength: 12,
      requiredPrefix: '90',
    },
    currency: 'USD',
    states: [
      { name: 'Istanbul Province', cities: ['Istanbul', 'Besiktas', 'Kadikoy', 'Uskudar'] },
      { name: 'Ankara Province', cities: ['Ankara', 'Cankaya', 'Kecioren', 'Etimesgut'] },
      { name: 'Izmir Province', cities: ['Izmir', 'Karşıyaka', 'Bornova', 'Buca'] },
      { name: 'Bursa Province', cities: ['Bursa', 'Inegol', 'Gemlik', 'Mudanya'] },
      { name: 'Antalya Province', cities: ['Antalya', 'Alanya', 'Manavgat', 'Kemer'] },
      { name: 'Adana Province', cities: ['Adana', 'Ceyhan', 'Seyhan', 'Yuregir'] },
      { name: 'Konya Province', cities: ['Konya', 'Karapinar', 'Ereğli', 'Beysehir'] },
      { name: 'Gaziantep Province', cities: ['Gaziantep', 'Nizip', 'Islahiye', 'Araban'] },
      { name: 'Kayseri Province', cities: ['Kayseri', 'Develi', 'Talask', 'Tomarza'] },
      { name: 'Mersin Province', cities: ['Mersin', 'Tarsus', 'Silifke', 'Anamur'] },
      { name: 'Eskisehir Province', cities: ['Eskisehir', 'Tepebaşı', 'Odunpazarı', 'Sivrihisar'] },
      { name: 'Diyarbakir Province', cities: ['Diyarbakir', 'Silvan', 'Bismil', 'Ergani'] },
      { name: 'Samsun Province', cities: ['Samsun', 'Bafra', 'Çarşamba', 'Terme'] },
      { name: 'Trabzon Province', cities: ['Trabzon', 'Of', 'Akcaabat', 'Arsin'] },
      { name: 'Malatya Province', cities: ['Malatya', 'Battalgazi', 'Akcadag', 'Darende'] },
    ],
  },
];
