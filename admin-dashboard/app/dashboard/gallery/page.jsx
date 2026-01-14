// app/dashboard/gallery/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Loader2,
  Trash2,
  Eye,
  Download,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, API_BASE_URL } from "@/lib/apiClient";
import { format } from "date-fns";

export default function GalleryPage() {
  const { hotel } = useAuth();
  const [activeTab, setActiveTab] = useState('images'); // images, videos, posts
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Data states
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);

  // Upload form states
  const [uploadType, setUploadType] = useState('image'); // image, video, post
  const [uploadForm, setUploadForm] = useState({
    // For images
    media_type: 'image/jpeg',
    media_category: 'rooms',
    file: null,
    // For videos
    title: '',
    thumbnail: null,
    video: null,
    // For posts
    caption: '',
    postDescription: '',
    postMedia: null,
  });

  useEffect(() => {
    if (hotel?.id) {
      loadAllMedia();
    }
  }, [hotel]);

  const loadAllMedia = async () => {
    if (!hotel?.id) return;

    try {
      setLoading(true);

      // Load images/media
      try {
        const mediaResponse = await apiClient.media.getByHotel(hotel.id);
        console.log('Media response:', mediaResponse);

        // The backend returns joined data, extract hotel_media objects
        let mediaData = [];
        if (Array.isArray(mediaResponse.data)) {
          mediaData = mediaResponse.data.map(item => {
            // Check if it's a joined response with hotel_media and hotels keys
            if (item.hotel_media) {
              return { ...item.hotel_media, hotel: item.hotels };
            }
            // Otherwise return as is
            return item;
          });
        }
        setImages(mediaData);
      } catch (err) {
        console.error('Error loading media:', err);
        setImages([]);
      }

      // Load videos
      try {
        const videosResponse = await fetch(`${API_BASE_URL}/content/videos/hotel/${hotel.id}`);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideos(Array.isArray(videosData.data) ? videosData.data : []);
        }
      } catch (err) {
        console.error('Error loading videos:', err);
        setVideos([]);
      }

      // Load posts
      try {
        const postsResponse = await fetch(`${API_BASE_URL}/hotels/posts/${hotel.id}`);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(Array.isArray(postsData.data) ? postsData.data : []);
        }
      } catch (err) {
        console.error('Error loading posts:', err);
        setPosts([]);
      }

    } catch (err) {
      console.error('Error loading all media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, [fieldName]: file }));
      setUploadError("");
      setUploadSuccess("");
    }
  };

  const handleUploadImage = async () => {
    if (!uploadForm.file || !hotel?.id) {
      setUploadError("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append('media', uploadForm.file);
      formData.append('media_type', uploadForm.media_type);
      formData.append('media_category', uploadForm.media_category);

      const response = await fetch(`${API_BASE_URL}/hotels/Media/upload/${hotel.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadSuccess("Image uploaded successfully!");
      setTimeout(() => {
        loadAllMedia();
        resetForm();
        setUploadDialogOpen(false);
      }, 1500);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadVideo = async () => {
    if (!uploadForm.video || !uploadForm.title || !hotel?.id) {
      setUploadError("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append('video', uploadForm.video);
      formData.append('title', uploadForm.title);
      if (uploadForm.thumbnail) {
        formData.append('thumbnail', uploadForm.thumbnail);
      }

      const response = await fetch(`${API_BASE_URL}/content/videos/${hotel.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadSuccess("Video uploaded successfully!");
      setTimeout(() => {
        loadAllMedia();
        resetForm();
        setUploadDialogOpen(false);
      }, 1500);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPost = async () => {
    if (!uploadForm.postMedia || !uploadForm.caption || !hotel?.id) {
      setUploadError("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append('media', uploadForm.postMedia);
      formData.append('caption', uploadForm.caption);
      formData.append('postDescription', uploadForm.postDescription);

      const response = await fetch(`${API_BASE_URL}/hotels/posts/${hotel.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadSuccess("Post created successfully!");
      setTimeout(() => {
        loadAllMedia();
        resetForm();
        setUploadDialogOpen(false);
      }, 1500);
    } catch (err) {
      setUploadError(err.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = () => {
    switch (uploadType) {
      case 'image':
        return handleUploadImage();
      case 'video':
        return handleUploadVideo();
      case 'post':
        return handleUploadPost();
      default:
        return;
    }
  };

  const resetForm = () => {
    setUploadForm({
      media_type: 'image/jpeg',
      media_category: 'rooms',
      file: null,
      title: '',
      thumbnail: null,
      video: null,
      caption: '',
      postDescription: '',
      postMedia: null,
    });
    setUploadSuccess("");
    setUploadError("");
  };

  const stats = {
    totalImages: images.length,
    totalVideos: videos.length,
    totalPosts: posts.length,
    totalViews: images.reduce((sum, m) => sum + (m.view_count || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1995AD] mx-auto" />
          <p className="mt-4 text-gray-600">Loading media gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-gray-600 mt-1">
            Manage your hotel's photos, videos, and posts
          </p>
        </div>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="bg-[#1995AD] hover:bg-[#177a91]"
        >
          <Plus className="mr-2 h-4 w-4" /> Upload Media
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalImages}</p>
                <p className="text-xs text-gray-500 mt-1">Gallery photos</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVideos}</p>
                <p className="text-xs text-gray-500 mt-1">Video content</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Posts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPosts}</p>
                <p className="text-xs text-gray-500 mt-1">Social posts</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalViews.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Impressions</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different media types */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="images">Images ({stats.totalImages})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({stats.totalVideos})</TabsTrigger>
          <TabsTrigger value="posts">Posts ({stats.totalPosts})</TabsTrigger>
        </TabsList>

        {/* Images Tab */}
        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>
                Photos and images from your hotel gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="text-center py-16">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No images uploaded yet</p>
                  <Button
                    onClick={() => {
                      setUploadType('image');
                      setUploadDialogOpen(true);
                    }}
                    className="mt-4 bg-[#1995AD]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload First Image
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="aspect-square relative bg-gray-100">
                        <img
                          src={item.url || 'https://via.placeholder.com/400?text=No+Image'}
                          alt={item.media_category || 'Hotel image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                          <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <Badge variant="outline" className="text-xs mb-2">
                          {item.media_category || 'general'}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {item.created_at ? format(new Date(item.created_at), 'MMM dd, yyyy') : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Videos</CardTitle>
              <CardDescription>
                Video content showcasing your hotel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div className="text-center py-16">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No videos uploaded yet</p>
                  <Button
                    onClick={() => {
                      setUploadType('video');
                      setUploadDialogOpen(true);
                    }}
                    className="mt-4 bg-[#1995AD]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload First Video
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="aspect-video relative bg-gray-900">
                        <video
                          src={video.video_url || `${API_BASE_URL}/content/videos/stream/${video.id}`}
                          poster={video.thumbnail_url}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                        <p className="text-xs text-gray-500">
                          {video.created_at ? format(new Date(video.created_at), 'MMM dd, yyyy') : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Posts</CardTitle>
              <CardDescription>
                Social media posts and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No posts created yet</p>
                  <Button
                    onClick={() => {
                      setUploadType('post');
                      setUploadDialogOpen(true);
                    }}
                    className="mt-4 bg-[#1995AD]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Create First Post
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all"
                    >
                      {(post.url || post.media_url) && (
                        <div className="aspect-video relative bg-gray-100">
                          <img
                            src={post.url || post.media_url}
                            alt={post.caption}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/600x400?text=Post+Image';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{post.caption}</h3>
                        {post.postDescription && (
                          <p className="text-sm text-gray-600 mb-2">{post.postDescription}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {post.created_at ? format(new Date(post.created_at), 'MMM dd, yyyy') : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent
          className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
          onClose={() => {
            setUploadDialogOpen(false);
            resetForm();
          }}
        >
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Choose the type of content you want to upload
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Upload Type Selector */}
            <div className="space-y-2">
              <Label>Upload Type</Label>
              <Select value={uploadType} onValueChange={(value) => {
                setUploadType(value);
                resetForm();
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Gallery Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Form */}
            {uploadType === 'image' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="image-file">Select Image *</Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'file')}
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <Select
                    value={uploadForm.media_type}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, media_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/jpeg">JPEG</SelectItem>
                      <SelectItem value="image/png">PNG</SelectItem>
                      <SelectItem value="image/webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={uploadForm.media_category}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, media_category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rooms">Rooms</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="amenities">Amenities</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="lobby">Lobby</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Video Upload Form */}
            {uploadType === 'video' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="video-title">Video Title *</Label>
                  <Input
                    id="video-title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter video title"
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-file">Select Video *</Label>
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e, 'video')}
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail-file">Thumbnail (Optional)</Label>
                  <Input
                    id="thumbnail-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'thumbnail')}
                    disabled={uploading}
                  />
                </div>
              </>
            )}

            {/* Post Upload Form */}
            {uploadType === 'post' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="post-caption">Caption *</Label>
                  <Input
                    id="post-caption"
                    value={uploadForm.caption}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Enter post caption"
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-description">Description</Label>
                  <Textarea
                    id="post-description"
                    value={uploadForm.postDescription}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, postDescription: e.target.value }))}
                    placeholder="Enter post description"
                    disabled={uploading}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-media">Media *</Label>
                  <Input
                    id="post-media"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleFileSelect(e, 'postMedia')}
                    disabled={uploading}
                  />
                </div>
              </>
            )}

            {/* Error/Success Messages */}
            {uploadError && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700">{uploadSuccess}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                resetForm();
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-[#1995AD] hover:bg-[#177a91]"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
