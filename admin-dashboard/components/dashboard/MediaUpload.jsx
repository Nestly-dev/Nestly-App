// components/dashboard/MediaUpload.jsx
"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  UploadCloud,
  File,
  ImageIcon,
  Video,
  X,
  Loader2,
  Check,
  Link,
  Folder
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample categories
const categories = [
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "rooms", label: "Rooms" },
  { value: "amenities", label: "Amenities" },
  { value: "dining", label: "Dining" },
  { value: "services", label: "Services" },
  { value: "tours", label: "Tours" },
  { value: "events", label: "Events" }
];

const MediaUpload = () => {
  const [uploadType, setUploadType] = useState("file"); // "file" | "url" | "folder"
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    url: "",
    featured: false
  });
  const { toast } = useToast();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview for files
    const newFiles = files.map(file => ({
      file,
      id: Math.random().toString(36).substring(2),
      name: file.name,
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      status: 'pending' // pending, uploading, complete, error
    }));
    
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleRemoveFile = (id) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0 && uploadType === "file") {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadType === "url" && !formData.url) {
      toast({
        title: "URL is required",
        description: "Please enter a valid URL.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate uploading with progress
    const updatedFiles = selectedFiles.map(file => ({
      ...file,
      status: 'uploading'
    }));
    setSelectedFiles(updatedFiles);
    
    // Simulate upload progress for each file
    const progressIntervals = selectedFiles.map((file, index) => {
      return setInterval(() => {
        setSelectedFiles(prevFiles => {
          const newFiles = [...prevFiles];
          if (newFiles[index] && newFiles[index].progress < 100) {
            newFiles[index] = {
              ...newFiles[index],
              progress: Math.min(newFiles[index].progress + 10, 100)
            };
            
            if (newFiles[index].progress === 100) {
              newFiles[index].status = 'complete';
              clearInterval(progressIntervals[index]);
            }
          }
          return newFiles;
        });
      }, 300 + (index * 100)); // Stagger the uploads
    });
    
    // Simulate completion after all files are uploaded
    setTimeout(() => {
      progressIntervals.forEach(interval => clearInterval(interval));
      setUploading(false);
      
      // Show success message
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${selectedFiles.length} files.`,
      });
      
      // Reset form and selected files after short delay
      setTimeout(() => {
        setSelectedFiles([]);
        setFormData({
          title: "",
          category: "",
          description: "",
          url: "",
          featured: false
        });
      }, 2000);
    }, selectedFiles.length * 1000 + 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
        <CardDescription>
          Add photos, videos, or other media to your hotel gallery
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="file" onValueChange={setUploadType}>
          <TabsList className="mb-4">
            <TabsTrigger value="file">Upload Files</TabsTrigger>
            <TabsTrigger value="url">Add from URL</TabsTrigger>
            <TabsTrigger value="folder">Upload Folder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file">
            <div className="mb-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  selectedFiles.length > 0 ? "border-gray-300 bg-gray-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleFileSelect({ target: { files } });
                }}
              >
                {selectedFiles.length === 0 ? (
                  <div>
                    <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supports images (JPG, PNG, GIF) and videos (MP4, MOV) up to 20MB
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => document.getElementById("file-upload").click()}
                      className="mx-auto"
                    >
                      Select Files
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,video/*"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedFiles.length} files selected
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById("file-upload").click()}
                    >
                      Add More Files
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Selected Files</h3>
                  <div className="space-y-2">
                    {selectedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded">
                            {file.type === 'image' && file.preview ? (
                              <img 
                                src={file.preview} 
                                alt={file.name} 
                                className="w-full h-full object-cover rounded" 
                              />
                            ) : file.type === 'image' ? (
                              <ImageIcon className="h-5 w-5 text-gray-500" />
                            ) : file.type === 'video' ? (
                              <Video className="h-5 w-5 text-gray-500" />
                            ) : (
                              <File className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {file.status === 'uploading' && (
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{file.progress}%</span>
                            </div>
                          )}
                          
                          {file.status === 'complete' ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : file.status !== 'uploading' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file.id)}
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="url">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      id="url"
                      name="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button variant="outline">
                    <Link className="h-4 w-4 mr-2" /> Verify
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the URL of an image or video to add it to your gallery
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="folder">
            <div className="text-center py-8">
              <Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Upload an entire folder of media files
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Maintains folder structure for better organization
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById("folder-upload").click()}
              >
                Select Folder
              </Button>
              <input
                id="folder-upload"
                type="file"
                webkitdirectory="true"
                directory="true"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a title for this media"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add a description..."
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="featured">Add to featured media</Label>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Media
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MediaUpload;