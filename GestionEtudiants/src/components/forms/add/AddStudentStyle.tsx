import React from "react";
import {StyleSheet} from 'react-native';
/* ================= STYLES ================= */
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
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
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
    padding: 12,
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
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
