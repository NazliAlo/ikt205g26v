import { StyleSheet } from 'react-native';

export const popupWindow = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end", // 👈 thumb-friendly bottom sheet
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  closeBtn: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#4F46E5",
    fontSize: 16,
  },
  input: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  },
  
  label: {
  fontWeight: "600",
  fontSize: 14,
  marginBottom: 4,
  color: "#111",
},

  textArea: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,

  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 8,
    alignItems: "center",
  },

  saveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginLeft: 8,
    alignItems: "center",
  },

  cancelText: {
    color: "#c01717",
    fontWeight: "600",
  },

  saveText: {
    color: "#379041",
    fontWeight: "600",
  },

});
