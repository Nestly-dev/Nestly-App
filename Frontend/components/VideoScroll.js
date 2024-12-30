import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { videodata, livedata } from "../data/data";
import { Video, ResizeMode } from "expo-av";
import { useCallback, useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from '@expo/vector-icons/Feather';

const VideoScroll = () => {
  const { width, height } = useWindowDimensions();

  // Store individual refs for each video
  const videoRefs = useRef([]);
  const [activePostId, setActivePostId] = useState(null);

  const onPress = (index) => {
    const videoRef = videoRefs.current[index];
    if (!videoRef) return;

    videoRef.getStatusAsync().then((status) => {
      if (status.isPlaying) {
        videoRef.pauseAsync();
      } else {
        videoRef.playAsync();
      }
    });
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentActiveId = viewableItems[0].item.id;
      setActivePostId(currentActiveId);

      videoRefs.current.forEach(async (video, index) => {
        if (video) {
          if (videodata[index].id === currentActiveId) {
            // Play the currently active video
            await video.playAsync();
          } else {
            // Pause and reset inactive videos
            await video.pauseAsync();
            await video.setPositionAsync(0); // Reset to the start
          }
        }
      });
    }
  }, []);

  return (
    <FlatList
      horizontal
      pagingEnabled
      data={videodata}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      renderItem={({ item, index }) => (
        <View style={{ width: width, height: height }}>
          <Video
            ref={(ref) => (videoRefs.current[index] = ref)} // Assign individual refs
            style={[StyleSheet.absoluteFill, styles.video]}
            source={item.video}
            isLooping={true}
            resizeMode={ResizeMode.COVER}
          />
          <Pressable onPress={() => onPress(index)} style={styles.content}>
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={styles.content}
            >
              <View style={{alignSelf:"baseline", justifyContent:"space-between", marginTop: 600, marginLeft: 15, flexDirection:"row"}}>
                <View>
                <Text
                  style={{ color: "white", fontSize: 25 }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{ color: "white", width: 310, fontSize: 15, marginTop: 7, fontWeight: 200 }}
                >
                  {item.caption}
                </Text>
                </View>
                <View style={{marginLeft: 60}}>
                <Feather name="heart" size={30} color="white" style={{marginBottom:30}}/>
                <Feather name="bookmark" size={30} color="white" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      )}
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
});

export default VideoScroll;
