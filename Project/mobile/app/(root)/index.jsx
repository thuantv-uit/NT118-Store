import { SignOutButton } from '@/components/SignOutButton';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/home.styles";
// import { BalanceCard } from '../../components/BalanceCard';
import PageLoader from '../../components/PageLoader';
import { useTransactions } from "../../hooks/useTransactions";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(
    user.id
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) return <PageLoader/>

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* <BalanceCard summary={summary} /> */}

        {/* <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View> */}
      </View>

      {/* FlatList is a performant way to render long lists in React Native. */}
      {/* it renders items lazily — only those on the screen. */}
      {/* <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      /> */}
    </View>
  );
}