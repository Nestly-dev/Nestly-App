import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  Image,
  StatusBar
} from "react-native";
import { videodata } from "../data/data";
import { Video, ResizeMode } from "expo-av";
import { useCallback, useState, useRef, useEffect, memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';

// Memoized Video Item Component
const VideoItem = memo(({ 
  item, 
  index, 
  width, 
  height, 
  videoRef, 
  onPress, 
  isActive 
}) => {
  return (
    <View style={{ width, height }}>
      <Video
        ref={videoRef}
        style={[StyleSheet.absoluteFill, styles.video]}
        source={item.video}
        isLooping={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
      />
      
      <Pressable onPress={() => onPress(index)} style={styles.content}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.gradientOverlay}
        >
          {/* Top header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Reels</Text>
            <Feather name="camera" size={24} color="white" />
          </View>
          
          {/* Right sidebar with actions - removed share and comment buttons */}
          <View style={styles.sidebar}>
            <View style={styles.sidebarItem}>
              <Feather name="heart" size={28} color="white" />
              <Text style={styles.iconText}>12.5k</Text>
            </View>
            <View style={styles.sidebarItem}>
              <Feather name="bookmark" size={28} color="white" />
            </View>
            <View style={styles.sidebarItem}>
              <Feather name="more-vertical" size={28} color="white" />
            </View>
          </View>
          
          {/* Bottom content info */}
          <View style={styles.contentContainer}>
            <View style={styles.userInfoContainer}>
              <View style={styles.profileContainer}>
                <Image 
                  source={require("../assets/images/profile.webp")}
                  style={styles.profileImage}
                />
                <Text style={styles.nameText}>
                  {item.name}
                </Text>
                <Pressable style={styles.followButton}>
                  <Text style={styles.followText}>Follow</Text>
                </Pressable>
              </View>
              <Text style={styles.captionText}>
                {item.caption}
              </Text>
              
              {/* Music info */}
              <View style={styles.musicContainer}>
                <Feather name="music" size={16} color="white" />
                <Text style={styles.musicText}>Original Audio</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.item.id === nextProps.item.id
  );
});

const VideoScroll = () => {
  const { width, height } = useWindowDimensions();
  const isFocused = useIsFocused();
  const videoRefs = useRef([]);
  const [activePostId, setActivePostId] = useState(null);

  // Memoize video data to prevent unnecessary re-renders
  const memoizedData = useCallback(() => videodata, []);

  useEffect(() => {
    // Hide status bar when component mounts
    StatusBar.setHidden(true);
    
    return () => {
      // Show status bar when component unmounts
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    if (!isFocused) {
      videoRefs.current.forEach(async (video) => {
        if (video) {
          await video.pauseAsync();
        }
      });
    } else if (activePostId !== null) {
      const activeIndex = videodata.findIndex(item => item.id === activePostId);
      if (activeIndex !== -1 && videoRefs.current[activeIndex]) {
        videoRefs.current[activeIndex].playAsync();
      }
    }
  }, [isFocused, activePostId]);

  const onPress = useCallback((index) => {
    const videoRef = videoRefs.current[index];
    if (!videoRef) return;

    videoRef.getStatusAsync().then((status) => {
      if (status.isPlaying) {
        videoRef.pauseAsync();
      } else {
        videoRef.playAsync();
      }
    });
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentActiveId = viewableItems[0].item.id;
      setActivePostId(currentActiveId);

      if (isFocused) {
        videoRefs.current.forEach(async (video, index) => {
          if (video) {
            if (videodata[index].id === currentActiveId) {
              await video.playAsync();
            } else {
              await video.pauseAsync();
              await video.setPositionAsync(0);
            }
          }
        });
      }
    }
  }, [isFocused]);

  const renderItem = useCallback(({ item, index }) => (
    <VideoItem
      item={item}
      index={index}
      width={width}
      height={height}
      videoRef={(ref) => (videoRefs.current[index] = ref)}
      onPress={onPress}
      isActive={item.id === activePostId && isFocused}
    />
  ), [width, height, activePostId, isFocused, onPress]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        vertical
        pagingEnabled
        showsVerticalScrollIndicator={false}
        data={memoizedData()}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        snapToInterval={height}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  sidebar: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
  },
  sidebarItem: {
    alignItems: 'center',
    marginVertical: 16, // Increased spacing between remaining buttons
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  userInfoContainer: {
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'white',
  },
  nameText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  followButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 10,
  },
  followText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  captionText: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "400",
    width: '90%',
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default memo(VideoScroll);