import { useRef, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { banners } from '../_data/homeData';
import { styles } from '../_styles/HomeStyles';

export default function BannerCarousel() {
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveBanner(viewableItems[0].index);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderBanner = ({ item }) => {
    const source = typeof item.image === 'string' ? { uri: item.image } : item.image;
    return <Image source={source} style={styles.bannerImage} />;
  };

  return (
    <View style={styles.bannerWrapper}>
      <FlatList
        ref={bannerRef}
        data={banners || []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderBanner}
        keyExtractor={(i) => i.id.toString()}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
      <View style={styles.dots}>
        {(banners || []).map((b, i) => (
          <View key={b.id} style={[styles.dot, i === activeBanner && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}
