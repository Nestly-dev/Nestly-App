import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Video, ResizeMode, Audio } from "expo-av";
import { useCallback, useState, useRef, useEffect, memo, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
  isActive,
  onLike,
  onSave,
  onBook,
  isLiked,
  isSaved
}) => {
  return (
    <View style={{ width, height }}>
      <Video
        ref={videoRef}
        style={[StyleSheet.absoluteFill, styles.video]}
        source={{ uri: item.video_url }}
        isLooping={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
        isMuted={false}
        volume={1.0}
        useNativeControls={false}
        posterSource={item.thumbnail ? { uri: item.thumbnail } : null}
        usePoster={!!item.thumbnail}
      />

      <Pressable onPress={() => onPress(index)} style={styles.content}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.gradientOverlay}
        >
          {/* Top header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Explore</Text>
            <Feather name="camera" size={24} color="white" />
          </View>

          {/* Right sidebar with actions */}
          <View style={styles.sidebar}>
            {/* Like Button */}
            <TouchableOpacity style={styles.sidebarItem} onPress={() => onLike(item.id)}>
              <MaterialIcons
                name={isLiked ? "favorite" : "favorite-border"}
                size={32}
                color={isLiked ? "#FF3B30" : "white"}
              />
              <Text style={styles.iconText}>{item.likes_count || 0}</Text>
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity style={styles.sidebarItem} onPress={() => onSave(item.id)}>
              <MaterialIcons
                name={isSaved ? "bookmark" : "bookmark-border"}
                size={32}
                color={isSaved ? "#FFD700" : "white"}
              />
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.sidebarItem}>
              <Feather name="share-2" size={28} color="white" />
            </TouchableOpacity>

            {/* More Options */}
            <TouchableOpacity style={styles.sidebarItem}>
              <Feather name="more-vertical" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom content info */}
          <View style={styles.contentContainer}>
            <View style={styles.userInfoContainer}>
              <View style={styles.profileContainer}>
                {/* Hotel Profile Image */}
                <Image
                  source={
                    item.hotel?.logo_url
                      ? { uri: item.hotel.logo_url }
                      : require("../assets/images/profile.webp")
                  }
                  style={styles.profileImage}
                />
                {/* Hotel Name */}
                <Text style={styles.nameText}>
                  {item.hotel?.name || item.hotel_name || "Hotel"}
                </Text>
                {/* Book Button */}
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => onBook(item.hotel_id || item.hotel?.id)}
                >
                  <MaterialIcons name="hotel" size={14} color="white" />
                  <Text style={styles.bookText}>Book</Text>
                </TouchableOpacity>
              </View>

              {/* Caption/Description */}
              <Text style={styles.captionText}>
                {item.caption || item.description || ""}
              </Text>

              {/* Location Info */}
              {item.hotel?.location && (
                <View style={styles.locationContainer}>
                  <MaterialIcons name="location-on" size={14} color="white" />
                  <Text style={styles.locationText}>{item.hotel.location}</Text>
                </View>
              )}

              {/* Music info */}
              <View style={styles.musicContainer}>
                <Feather name="music" size={14} color="white" />
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
    prevProps.item.id === nextProps.item.id &&
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.isSaved === nextProps.isSaved
  );
});

const VideoScroll = () => {
  const { width, height } = useWindowDimensions();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const videoRefs = useRef([]);
  const [activePostId, setActivePostId] = useState(null);
  const [videoFeed, setVideoFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [savedVideos, setSavedVideos] = useState(new Set());
  const { ip, authToken, setCurrentID } = useContext(AuthContext);

  // Setup audio mode for proper playback on mobile devices
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.error('Failed to configure audio mode:', e);
      }
    };

    setupAudio();
  }, []);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const videoSource = `http://${ip}:8000/api/v1/content/videos/all`;
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

  // Load liked and saved videos
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!authToken) return;

      try {
        // Fetch liked videos
        const likedResponse = await axios.get(
          `http://${ip}:8000/api/v1/videos/liked`,
          { headers: { Authorization: `Bearer ${authToken}` }}
        );
        if (likedResponse.data.success && likedResponse.data.data) {
          setLikedVideos(new Set(likedResponse.data.data.map(v => v.id)));
        }

        // Fetch saved videos
        const savedResponse = await axios.get(
          `http://${ip}:8000/api/v1/videos/saved`,
          { headers: { Authorization: `Bearer ${authToken}` }}
        );
        if (savedResponse.data.success && savedResponse.data.data) {
          setSavedVideos(new Set(savedResponse.data.data.map(v => v.id)));
        }
      } catch (err) {
        console.log("Could not load user preferences:", err.message);
      }
    };

    loadUserPreferences();
  }, [authToken]);

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

  const handleLike = useCallback(async (videoId) => {
    if (!authToken) {
      // TODO: Show login prompt
      console.log("Please login to like videos");
      return;
    }

    try {
      const isLiked = likedVideos.has(videoId);
      const endpoint = isLiked ? 'unlike' : 'like';

      await axios.post(
        `http://${ip}:8000/api/v1/videos/${videoId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` }}
      );

      // Update local state
      setLikedVideos(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
        }
        return newSet;
      });

      // Update video feed likes count
      setVideoFeed(prev => prev.map(video => {
        if (video.id === videoId) {
          return {
            ...video,
            likes_count: isLiked
              ? (video.likes_count || 1) - 1
              : (video.likes_count || 0) + 1
          };
        }
        return video;
      }));
    } catch (error) {
      console.error('Like error:', error);
    }
  }, [authToken, likedVideos, ip]);

  const handleSave = useCallback(async (videoId) => {
    if (!authToken) {
      console.log("Please login to save videos");
      return;
    }

    try {
      const isSaved = savedVideos.has(videoId);
      const endpoint = isSaved ? 'unsave' : 'save';

      await axios.post(
        `http://${ip}:8000/api/v1/videos/${videoId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` }}
      );

      // Update local state
      setSavedVideos(prev => {
        const newSet = new Set(prev);
        if (isSaved) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [authToken, savedVideos, ip]);

  const handleBook = useCallback((hotelId) => {
    if (!hotelId) {
      console.log("Hotel ID not available");
      return;
    }

    // Set the current hotel ID in context
    setCurrentID(hotelId);

    // Navigate to hotel profile
    navigation.navigate('Places', {
      screen: 'Hotel Profile',
      params: { hotelId }
    });
  }, [navigation, setCurrentID]);

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
      onLike={handleLike}
      onSave={handleSave}
      onBook={handleBook}
      isLiked={likedVideos.has(item.id)}
      isSaved={savedVideos.has(item.id)}
    />
  ), [width, height, activePostId, isFocused, onPress, handleLike, handleSave, handleBook, likedVideos, savedVideos]);

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
            axios.get(`http://${ip}:8000/api/v1/content/videos/all`)
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
    marginVertical: 12,
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  nameText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#1995AD',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 4,
  },
  bookText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  captionText: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "400",
    width: '85%',
    lineHeight: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 13,
    marginLeft: 4,
    opacity: 0.9,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  musicText: {
    color: 'white',
    fontSize: 13,
    marginLeft: 6,
    opacity: 0.8,
  },
});

export default memo(VideoScroll);
