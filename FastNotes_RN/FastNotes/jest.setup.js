// jest.setup.js

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: jest.fn(() => ({})),
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

// Mock Expo-modules
jest.mock('expo-modules-core', () => ({}));
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  setNotificationHandler: jest.fn(),
}));
jest.mock('expo-constants', () => ({ manifest: {} }));
jest.mock('expo-asset', () => ({ Asset: { loadAsync: jest.fn() } }));

// Mock Expo UI-moduler
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(() => Promise.resolve({ uri: 'mocked-uri' })),
}));
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({ canceled: false, assets: [{ uri: 'mocked-uri' }] })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({ canceled: false, assets: [{ uri: 'mocked-uri' }] })
  ),
}));
jest.mock('expo-camera', () => ({
  CameraView: () => null,
  useCameraPermissions: () => [null, jest.fn()],
}));

// Mock vektor-ikoner
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: () => null,
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
    },
  },
}));