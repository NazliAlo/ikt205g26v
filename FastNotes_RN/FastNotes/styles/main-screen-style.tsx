import {StyleSheet} from 'react-native'

export const mainScreanStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24, // 👈 thumb-zone for right-handed users
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 50,
    fontWeight: "600",
    marginBottom: 16,
    color: "white",
    padding: 12,
    alignSelf: "center"
  }
});