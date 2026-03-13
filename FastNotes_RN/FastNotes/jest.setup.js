// jest.setup.js

if (typeof global.structuredClone !== "function") {
  Object.defineProperty(global, "structuredClone", {
    value: (value) => JSON.parse(JSON.stringify(value)),
    writable: false,
    configurable: false,
  });
}

// Prevent Expo winter runtime from requiring modules outside Jest's scope.
jest.mock("expo/src/winter/ImportMetaRegistry", () => ({
  ImportMetaRegistry: {
    get: jest.fn(() => undefined),
    set: jest.fn(),
  },
}));

// Expo Router mock for components using routing hooks.
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: jest.fn(() => ({})),
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

// App-specific external module mocks.
jest.mock("expo-notifications", () => ({
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }),
  ),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(() =>
    Promise.resolve("mock-notification-id"),
  ),
}));

jest.mock("@expo/vector-icons", () => ({
  FontAwesome: () => null,
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}));
