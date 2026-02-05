import React from "react";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputDisabled: {
    backgroundColor: '#e5e5e5',
  },
  inputError: {
    borderColor: 'red',
  },
  sexeContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  sexeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  sexeSelected: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  sexeText: {
    color: '#111',
    fontWeight: '600',
  },
  sexeTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1e90ff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoWrapper: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1e90ff',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1e90ff',
  },
});