import { Dimensions, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import { styles } from '../styles/ProfileStyles';

const { width } = Dimensions.get('window');

const ExpensesSection = ({ expenses }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Quản lý chi tiêu</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.expenseScroll}
      snapToInterval={width * 0.9}
      decelerationRate="fast"
    >
      {expenses.map((item, index) => (
        <View
          key={index}
          style={[
            styles.expenseCard,
            {
              backgroundColor:
                index === 1
                  ? colors.background.secondary
                  : index === 2
                  ? colors.background.secondary
                  : index === 3
                  ? colors.secondary.lightPink
                  : colors.background.secondary,
              marginRight: 12,
            },
          ]}
        >
          <View style={styles.expenseHeader}>
            <Icon name={`${item.icon}-outline`} size={20} color={item.color} />
            <Text style={styles.expenseTitle}>{item.title}</Text>
          </View>
          <Text style={styles.expenseValue}>{item.value}</Text>
          <Text style={[styles.expenseTrend, { color: item.color }]}>{item.trend}</Text>
          {index === 2 && <Text style={styles.expenseSub}>Áo nữ</Text>}
        </View>
      ))}
    </ScrollView>
  </View>
);

export default ExpensesSection;