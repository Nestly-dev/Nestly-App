import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert
} from "react-native";
import React, { useState } from "react";
import { data } from "../data/reviewdata";
import * as ImagePicker from 'expo-image-picker'; // Make sure to install this: expo install expo-image-picker

const ReviewsScreen = () => {
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [attachments, setAttachments] = useState([]);

  const pickFile = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your media library to upload files.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Images and videos
      allowsMultipleSelection: true,
      maxFiles: 3,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      // Limit to 3 files
      const newAttachments = [...attachments];
      result.assets.forEach((asset) => {
        if (newAttachments.length < 3) {
          newAttachments.push(asset);
        }
      });
      
      setAttachments(newAttachments.slice(0, 3));
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const renderRatingInput = () => {
    return (
      <View style={styles.ratingInputContainer}>
        <Text style={styles.ratingLabel}>Your Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => setUserRating(star)}
              style={styles.starButton}
            >
              <Text style={[
                styles.star, 
                {color: star <= userRating ? '#FFB300' : '#C5CEE0'}
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    
    if (hasHalfStar) {
      stars.push("★");
    }
    
    while (stars.length < 5) {
      stars.push("☆");
    }
    
    return (
      <Text style={styles.ratingStars}>
        {stars.join('')}
      </Text>
    );
  };

  const renderAttachments = () => {
    if (attachments.length === 0) return null;

    return (
      <View style={styles.attachmentsContainer}>
        {attachments.map((file, index) => (
          <View key={index} style={styles.attachmentItem}>
            <Image 
              source={{ uri: file.uri }} 
              style={styles.attachmentThumbnail} 
            />
            <TouchableOpacity 
              style={styles.removeAttachmentButton}
              onPress={() => removeAttachment(index)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.profile }} style={styles.profileImage} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.name}</Text>
          <View style={styles.dateRatingContainer}>
            <Text style={styles.reviewDate}>{item.date}</Text>
            {renderRatingStars(item.rating || 4.5)}
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>{item.review}</Text>
      
      {/* Display review attachments if any */}
      {item.attachments && item.attachments.length > 0 && (
        <View style={styles.reviewAttachmentsContainer}>
          {item.attachments.map((attachment, index) => (
            <Image 
              key={index}
              source={{ uri: attachment }} 
              style={styles.reviewAttachmentImage} 
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reviews</Text>
      </View>
      
      <FlatList
        data={data}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id || item.name}
        contentContainerStyle={styles.reviewsList}
        showsVerticalScrollIndicator={false}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.commentContainer}
      >
        {renderRatingInput()}
        
        <TextInput
          placeholder="Share your thoughts..."
          style={styles.commentInput}
          multiline={true}
          value={comment}
          onChangeText={setComment}
          placeholderTextColor="#8F9BB3"
        />
        
        {renderAttachments()}
        
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={pickFile}
          >
            <Text style={styles.attachButtonText}>
              {attachments.length > 0 
                ? `Files (${attachments.length}/3)` 
                : "Attach Files"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.postButton, 
              { 
                opacity: (comment.trim().length > 0 && userRating > 0) ? 1 : 0.7,
                flex: 2
              }
            ]}
            disabled={comment.trim().length === 0 || userRating === 0}
          >
            <Text style={styles.postButtonText}>Post Review</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E9F2",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222B45",
  },
  reviewsList: {
    paddingHorizontal: 16,
    paddingBottom: 220, // Extra space for the larger comment box
  },
  reviewCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  reviewerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222B45",
  },
  dateRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: "#8F9BB3",
    marginRight: 8,
  },
  ratingStars: {
    fontSize: 14,
    color: "#FFB300",
  },
  reviewText: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
    color: "#2E3A59",
  },
  reviewAttachmentsContainer: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
  },
  reviewAttachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  commentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E4E9F2",
  },
  ratingInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222B45",
    marginRight: 12,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 24,
  },
  commentInput: {
    height: 80,
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F7F9FC",
    textAlignVertical: "top",
  },
  attachmentsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  attachmentItem: {
    position: "relative",
    marginRight: 8,
  },
  attachmentThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeAttachmentButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3D71",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionButtonsRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  attachButton: {
    backgroundColor: "#E4E9F2",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    flex: 1,
  },
  attachButtonText: {
    color: "#2E3A59",
    fontSize: 16,
    fontWeight: "500",
  },
  postButton: {
    backgroundColor: "#1995AD",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});