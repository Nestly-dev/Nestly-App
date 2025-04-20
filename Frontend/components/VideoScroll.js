import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  Image,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useCallback, useState, useRef, useEffect, memo, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import axios from "axios";
import AuthContext from "../context/AuthContext";

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
        source={{ uri: item.video_url }} // Updated to use URI from API
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
          
          {/* Right sidebar with actions */}
          <View style={styles.sidebar}>
            <View style={styles.sidebarItem}>
              <Feather name="heart" size={28} color="white" />
              <Text style={styles.iconText}>{item.likes || "0"}</Text>
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
                  source={item.profile_image ? { uri: item.profile_image } : require("../assets/images/profile.webp")}
                  style={styles.profileImage}
                />
                <Text style={styles.nameText}>
                  {item.username || "User"}
                </Text>
                <Pressable style={styles.followButton}>
                  <Text style={styles.followText}>Follow</Text>
                </Pressable>
              </View>
              <Text style={styles.captionText}>
                {item.caption || ""}
              </Text>
              
              {/* Music info */}
              <View style={styles.musicContainer}>
                <Feather name="music" size={16} color="white" />
                <Text style={styles.musicText}>{item.audio_title || "Original Audio"}</Text>
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
  const [videoFeed, setVideoFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {ip} = useContext(AuthContext)

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const videoSource = `http://127.0.0.1/api/v1/content/videos/all`;
        const response = await axios.get(videoSource);
        const result = response.data;
        
        if (result && result.data) {
          setVideoFeed(result.data);
          // Set first video as active once data is loaded
          if (result.data.length > 0) {
            setActivePostId(result.data[0].id);
          }
        } else {
          setError("No videos found");
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
      // Pause all videos when screen is not focused
      videoRefs.current.forEach(async (video) => {
        if (video) {
          try {
            await video.pauseAsync();
          } catch (err) {
            console.log("Error pausing video:", err);
          }
        }
      });
    } else if (activePostId !== null && videoFeed.length > 0) {
      // Play active video when screen is focused
      const activeIndex = videoFeed.findIndex(item => item.id === activePostId);
      if (activeIndex !== -1 && videoRefs.current[activeIndex]) {
        try {
          videoRefs.current[activeIndex].playAsync();
        } catch (err) {
          console.log("Error playing video:", err);
        }
      }
    }
  }, [isFocused, activePostId, videoFeed]);

  const onPress = useCallback((index) => {
    const videoRef = videoRefs.current[index];
    if (!videoRef) return;

    videoRef.getStatusAsync().then((status) => {
      if (status.isPlaying) {
        videoRef.pauseAsync();
      } else {
        videoRef.playAsync();
      }
    }).catch(err => {
      console.log("Error getting video status:", err);
    });
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && videoFeed.length > 0) {
      const currentActiveId = viewableItems[0].item.id;
      setActivePostId(currentActiveId);

      if (isFocused) {
        videoRefs.current.forEach(async (video, index) => {
          if (video) {
            try {
              if (videoFeed[index] && videoFeed[index].id === currentActiveId) {
                await video.playAsync();
              } else {
                await video.pauseAsync();
                await video.setPositionAsync(0);
              }
            } catch (err) {
              console.log("Error managing video playback:", err);
            }
          }
        });
      }
    }
  }, [isFocused, videoFeed]);

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

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color="#FFFFFF" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setIsLoading(true);
            // Retry fetching videos
            axios.get("http://127.0.0.1:8000/api/v1/content/videos/all")
              .then(response => {
                if (response.data && response.data.data) {
                  setVideoFeed(response.data.data);
                  if (response.data.data.length > 0) {
                    setActivePostId(response.data.data[0].id);
                  }
                  setIsLoading(false);
                }
              })
              .catch(err => {
                console.error("Error retrying video fetch:", err);
                setError("Failed to load videos");
                setIsLoading(false);
              });
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Empty state
  if (videoFeed.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="video-off" size={50} color="#FFFFFF" />
        <Text style={styles.emptyText}>No videos available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        vertical
        pagingEnabled
        showsVerticalScrollIndicator={false}
        data={videoFeed}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#1995AD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
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
    marginVertical: 16,
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