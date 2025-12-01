import { StyleSheet } from 'react-native';

export const shipperStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4A90E2',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerSection: {
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  headerSectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    marginTop: 8,
    color: '#CCC',
    fontSize: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#4A90E2',
    margin: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    marginLeft: 8,
    color: '#FFF',
    fontWeight: 'bold',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderAvatarContainer: {
    marginRight: 12,
  },
  buyerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderInfo: {
    flex: 1,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  orderBuyer: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
    fontWeight: '600',
  },
  orderPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderLocation: {
    fontSize: 14,
    color: '#00A651',
    marginTop: 4,
    fontStyle: 'italic',
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  locationButton: {
    backgroundColor: '#4A90E2',
  },
  statusButton: {
    backgroundColor: '#FF6B00',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  updateModalButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateModalButtonDisabled: {
    backgroundColor: '#CCC',
  },
  updateModalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles mới cho UpdateStatusModal
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: '#4A90E2',
  },
  statusOptionDisabled: {
    opacity: 0.5,
  },
  statusOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // Styles mới cho OrderDetailModal
  detailScroll: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  detailAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  detailEmail: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  detailAddress: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  detailItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});