import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../_styles/ProfileStyles';

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={18} color="#FF4D79" style={{ marginRight: 10 }} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>{value || 'Chưa cập nhật'}</Text>
  </View>
);

const ProfileInfoCard = ({ profile, clerkUser, loading, onEdit, onRefresh, isComplete }) => {
  const fullName =
    (profile?.last_name || profile?.first_name)
      ? `${profile?.last_name || ''} ${profile?.first_name || ''}`.trim()
      : clerkUser?.fullName || 'Người dùng mới';

  const roleLabel = profile?.role
    ? profile.role === 'seller'
      ? 'Người bán'
      : profile.role === 'shipper'
        ? 'Shipper'
        : 'Người mua'
    : 'Chưa chọn vai trò';

  return (
    <View style={styles.infoCard}>
      <LinearGradient
        colors={[ '#F7BCD3', '#9AD6DF' ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.infoGradient}
      >
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{fullName}</Text>
        <Text style={styles.infoSubtitle}>
          {isComplete ? 'Hồ sơ đã sẵn sàng mua sắm' : 'Cập nhật hồ sơ để thanh toán nhanh hơn'}
        </Text>
        <Text style={styles.infoBadge}>{roleLabel}</Text>

        <View style={styles.infoRows}>
          {loading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color="#FF4D79" />
              <Text style={styles.infoSubtitle}>Đang tải hồ sơ...</Text>
            </View>
          ) : (
            <>
              <InfoRow
                icon="mail-outline"
                label="Email"
                value={
                  profile?.email ||
                  profile?.emaiil ||
                  clerkUser?.primaryEmailAddress?.emailAddress
                }
              />
              <InfoRow icon="call-outline" label="Số điện thoại" value={profile?.phone_number} />
              <InfoRow
                icon="finger-print-outline"
                label="Mã người dùng"
                value={profile?.id || clerkUser?.id}
              />
            </>
          )}
        </View>

        <TouchableOpacity onPress={onEdit} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRefresh} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Tải lại thông tin</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
    </View>
  );
};

export default ProfileInfoCard;
