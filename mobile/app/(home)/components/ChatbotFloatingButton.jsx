// components/ChatbotFloatingButton.jsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // npm i react-native-vector-icons nếu chưa có
import { primary, accent } from '../_styles/HomeStyles'; // Import từ HomeStyles (điều chỉnh path nếu cần)
import ChatbotModal from './ChatbotModal';

export default function ChatbotFloatingButton() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="chat-bubble-outline" size={30} color="#fff" />
      </TouchableOpacity>

      <ChatbotModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90, // Trên BottomNav một chút
    right: 20,
    backgroundColor: primary, // Đồng bộ: primary (#FF4D79)
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: accent, // Thêm viền accent cho khớp theme
  },
});