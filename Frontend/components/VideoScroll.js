import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  Image
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
      <Text style={{color: "white", alignItems:"center", justifyContent:"center", left:"40%", top:"6%", fontSize: 25, fontWeight:"bold"}}>Explore</Text>
      <Pressable onPress={() => onPress(index)} style={styles.content}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.content}
        >
          
          <View style={styles.contentContainer}>
            
            <View>
              
              <View style={styles.profileContainer}>
                <Image 
                  source={require("../assets/images/profile.webp")}
                  style={styles.profileImage}
                />
                <Text style={styles.nameText}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.captionText}>
                {item.caption}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Feather name="heart" size={30} color="white" style={styles.icon}/>
              <Feather name="bookmark" size={30} color="white" />
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
    <FlatList
      horizontal
      pagingEnabled
      data={memoizedData()}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={2}
      windowSize={3}
      initialNumToRender={1}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignSelf: "baseline",
    justifyContent: "space-between",
    marginTop: 600,
    marginLeft: 15,
    flexDirection: "row"
  },
  profileContainer: {
    flexDirection: "row"
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 100
  },
  nameText: {
    color: "white",
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10
  },
  captionText: {
    color: "white",
    width: 310,
    fontSize: 15,
    marginTop: 7,
    fontWeight: "300"
  },
  iconContainer: {
    marginLeft: 60
  },
  icon: {
    marginBottom: 30
  }
});

export default memo(VideoScroll);