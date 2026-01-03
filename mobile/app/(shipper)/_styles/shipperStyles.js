import { StyleSheet } from 'react-native';

const pastelBg = '#FFF6FB';
const accent = '#FFD6E8';
const primary = '#FF4D79';
const gradientStart = '#FF8FB1';
const gradientEnd = '#FF4D79';
const text = '#2A0E23';
const muted = '#7A5368';

export const shipperStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: pastelBg,
  },
  container: {
    flex: 1,
    backgroundColor: pastelBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: primary,
    elevation: 4,
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    color: muted,
    fontSize: 16,
  },
  errorText: {
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: primary,
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
    color: text,
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
    color: muted,
    fontSize: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: primary,
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
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
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
    color: text,
    marginTop: 2,
    fontWeight: '600',
  },
  orderPhone: {
    fontSize: 12,
    color: muted,
    marginTop: 2,
  },
  orderLocation: {
    fontSize: 14,
    color: gradientStart,
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
    backgroundColor: primary,
  },
  statusButton: {
    backgroundColor: gradientStart,
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
    color: text,
  },
  modalDescription: {
    fontSize: 14,
    color: muted,
    marginBottom: 16,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: accent,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  updateModalButton: {
    backgroundColor: primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateModalButtonDisabled: {
    backgroundColor: muted,
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
    backgroundColor: primary,
  },
  statusOptionDisabled: {
    opacity: 0.5,
  },
  statusOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: text,
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
    borderBottomColor: accent,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: text,
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
    color: text,
  },
  detailPhone: {
    fontSize: 14,
    color: muted,
    marginTop: 2,
  },
  detailEmail: {
    fontSize: 14,
    color: muted,
    marginTop: 2,
  },
  detailAddress: {
    fontSize: 14,
    color: text,
    lineHeight: 20,
  },
  detailItem: {
    fontSize: 14,
    color: muted,
    marginBottom: 4,
  },
});
