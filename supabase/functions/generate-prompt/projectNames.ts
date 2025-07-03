// Generate project name suggestions for all categories
export function generateProjectName(intent: string, projectType: string): string {
  const projectNames = {
    'messaging_app': ['ChatFlow', 'MessageSpace', 'TalkStream', 'ConversaHub', 'ChatVibe'],
    'e_commerce': ['ShopFlow', 'MarketPlace', 'BuyNow', 'CommerceHub', 'StoreVibe'],
    'productivity': ['TaskFlow', 'ProductiveSpace', 'OrganizeHub', 'PlannerPro', 'TaskVibe'],
    'creative': ['CreateFlow', 'ArtSpace', 'DesignHub', 'CreativeVibe', 'PortfolioPro'],
    'analytics': ['DataFlow', 'AnalyticsHub', 'ChartSpace', 'MetricsVibe', 'DashboardPro'],
    'gaming': ['GameFlow', 'PlaySpace', 'GameHub', 'FunVibe', 'PlayPro'],
    'health': ['HealthFlow', 'WellnessSpace', 'FitnessHub', 'HealthVibe', 'WellnessPro'],
    'finance': ['FinanceFlow', 'MoneySpace', 'BudgetHub', 'FinanceVibe', 'MoneyPro'],
    'education': ['LearnFlow', 'EduSpace', 'StudyHub', 'LearnVibe', 'EduPro'],
    'government_services': ['GovFlow', 'DocumentHub', 'VisaSpace', 'LegalVibe', 'ApplicationPro'],
    'travel_planning': ['TravelFlow', 'JourneySpace', 'TripHub', 'TravelVibe', 'VoyagePro'],
    'real_estate': ['PropertyFlow', 'RealtySpace', 'HomeHub', 'PropertyVibe', 'EstatePro'],
    'food_delivery': ['FoodFlow', 'DeliverySpace', 'OrderHub', 'FoodVibe', 'TastePro'],
    'event_management': ['EventFlow', 'PlannerSpace', 'EventHub', 'PartyVibe', 'EventPro'],
    'fitness_tracking': ['FitFlow', 'WorkoutSpace', 'FitnessHub', 'GymVibe', 'FitPro'],
    'dating_social': ['MatchFlow', 'LoveSpace', 'ConnectHub', 'HeartVibe', 'DatePro'],
    'music_audio': ['SoundFlow', 'MusicSpace', 'TuneHub', 'AudioVibe', 'BeatPro'],
    'photo_video': ['PixelFlow', 'VisualSpace', 'CreativeHub', 'MediaVibe', 'PhotoPro'],
    'ai_tools': ['AIFlow', 'SmartSpace', 'IntelliHub', 'AIVibe', 'CognitoPro'],
    'developer_tools': ['CodeFlow', 'DevSpace', 'BuildHub', 'DevVibe', 'CodePro'],
    'blockchain_crypto': ['CryptoFlow', 'Web3Space', 'BlockHub', 'CryptoVibe', 'ChainPro'],
    'community_forum': ['CommunityFlow', 'SocialSpace', 'ForumHub', 'CommunityVibe', 'SocialPro'],
    'news_media': ['NewsFlow', 'MediaSpace', 'InfoHub', 'NewsVibe', 'MediaPro'],
    'weather_location': ['WeatherFlow', 'LocationSpace', 'MapHub', 'WeatherVibe', 'GeoLogic'],
    'marketplace_p2p': ['TradeFlow', 'MarketSpace', 'ExchangeHub', 'TradeVibe', 'MarketPro'],
    'remote_work': ['WorkFlow', 'RemoteSpace', 'TeamHub', 'WorkVibe', 'RemotePro'],
    'sustainability': ['EcoFlow', 'GreenSpace', 'SustainHub', 'EcoVibe', 'GreenPro'],
    'pets_animals': ['PetFlow', 'AnimalSpace', 'PetHub', 'PetVibe', 'AnimalPro'],
    'beauty_fashion': ['StyleFlow', 'BeautySpace', 'FashionHub', 'StyleVibe', 'BeautyPro'],
    'parenting_family': ['FamilyFlow', 'ParentSpace', 'FamilyHub', 'ParentVibe', 'FamilyPro'],
    'elderly_care': ['CareFlow', 'SeniorSpace', 'ElderHub', 'CareVibe', 'SeniorPro'],
    'local_services': ['ServiceFlow', 'LocalSpace', 'ServiceHub', 'LocalVibe', 'ServicePro'],
    'mental_wellness': ['WellnessFlow', 'MindSpace', 'WellnessHub', 'MindVibe', 'WellnessPro'],
    'transportation': ['RideFlow', 'TransportSpace', 'MoveHub', 'RideVibe', 'TransportPro']
  };

  const names = projectNames[projectType] || ['AppFlow', 'ProjectSpace', 'MyApp', 'AppVibe', 'ProjectPro'];
  return names[Math.floor(Math.random() * names.length)];
}