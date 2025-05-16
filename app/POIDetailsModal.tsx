import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const POIDetailsModal = ({ visible, poi, onSave, onClose, onDelete, onShare }) => {
  const [name, setName] = useState(poi?.name || '');
  const [description, setDescription] = useState(poi?.description || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    onSave({ name, description });
  };

  const handleUndo = () => {
    setName(poi?.name || '');
    setDescription(poi?.description || '');
    setIsEditing(false);
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <TextInput
          style={styles.input}
          placeholder="Point of Interest"
          value={name}
          onChangeText={setName}
          editable={isEditing}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          editable={isEditing}
        />
        {isEditing ? (
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSave} />
            <Button title="Undo" onPress={handleUndo} color="orange" />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setIsEditing(true)}><Text>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={onDelete}><Text>Delete</Text></TouchableOpacity>
            <TouchableOpacity onPress={onShare}><Text>Share</Text></TouchableOpacity>
            <TouchableOpacity onPress={onClose}><Text>Close</Text></TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default POIDetailsModal;
