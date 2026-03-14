import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import {
  Plus, Edit, Trash2, Search, Eye, FileText, Image,
  Calendar, User, Tag, Clock, CheckCircle, AlertCircle,
  Save, X, Bold, Italic, Underline, List, ListOrdered,
  Link2, Quote, Code, Upload, Sparkles, Filter,
  ChevronLeft, ChevronRight, Hash, BookOpen, PenTool,
  Palette, Layout, Target, Globe, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Enhanced Rich Text Editor with more features
const RichTextEditor = ({ 
  value, 
  onChange,
  placeholder,
  onSave 
}: { 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const text = value.replace(/<[^>]*>/g, '');
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl("");
    }
  };

  const insertHeading = (level: number) => {
    execCommand('formatBlock', `<h${level}>`);
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', tooltip: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', tooltip: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', tooltip: 'Underline (Ctrl+U)' },
    { separator: true },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Numbered List' },
    { separator: true },
    { icon: Quote, command: 'formatBlock', value: '<blockquote>', tooltip: 'Quote' },
    { icon: Code, command: 'formatBlock', value: '<pre>', tooltip: 'Code Block' },
    { separator: true },
    { icon: Link2, onClick: () => setShowLinkDialog(true), tooltip: 'Insert Link' },
  ];

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      {/* Enhanced Toolbar */}
      <div className="border-b p-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-1">
          {/* Heading Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Hash className="h-4 w-4" />
                Heading
                <ChevronRight className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => insertHeading(1)}>
                <span className="text-2xl font-bold">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(2)}>
                <span className="text-xl font-bold">Heading 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(3)}>
                <span className="text-lg font-bold">Heading 3</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => execCommand('formatBlock', '<p>')}>
                <span>Normal Text</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Format Buttons */}
          {toolbarButtons.map((button, index) => (
            button.separator ? (
              <Separator key={index} orientation="vertical" className="h-6 mx-1" />
            ) : (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => button.onClick ? button.onClick() : execCommand(button.command, button.value)}
                title={button.tooltip}
                className="p-2 hover:bg-gray-200"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            )
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{wordCount} words</span>
          {onSave && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        className="p-6 min-h-[400px] focus:outline-none prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        placeholder={placeholder}
        style={{ minHeight: '400px' }}
      />

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Enhanced Blog Form with SEO and Preview
const BlogForm = ({ 
  post, 
  onSubmit, 
  onCancel 
}: { 
  post?: any; 
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("content");
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    tags: post?.tags ? JSON.parse(post.tags) : [],
    featuredImage: post?.featuredImage || "",
    status: post?.status || "draft",
    category: post?.category || "general",
    metaDescription: post?.metaDescription || "",
    metaKeywords: post?.metaKeywords || "",
    publishDate: post?.publishDate || new Date().toISOString().split('T')[0],
    readingTime: post?.readingTime || 5,
  });

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.content && formData.title) {
        setAutoSaving(true);
        // Simulate auto-save
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData.content, formData.title]);

  // Calculate reading time
  useEffect(() => {
    const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    setFormData(prev => ({ ...prev, readingTime }));
  }, [formData.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: JSON.stringify(formData.tags),
      authorId: user?.id,
    });
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData({ ...formData, slug });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const categories = [
    { value: "general", label: "General", icon: BookOpen },
    { value: "tax-tips", label: "Tax Tips", icon: TrendingUp },
    { value: "updates", label: "Updates", icon: Sparkles },
    { value: "guides", label: "Guides", icon: FileText },
    { value: "news", label: "News", icon: Globe },
  ];

  const contentTemplates = [
    { name: "Tax Update", content: "<h2>Tax Update Title</h2><p>Summary of the update...</p><h3>Key Points</h3><ul><li>Point 1</li><li>Point 2</li></ul><h3>Impact</h3><p>How this affects taxpayers...</p>" },
    { name: "How-To Guide", content: "<h2>How to [Task]</h2><p>Introduction...</p><h3>Step 1: [Action]</h3><p>Description...</p><h3>Step 2: [Action]</h3><p>Description...</p><h3>Conclusion</h3><p>Summary...</p>" },
    { name: "Tax Tip", content: "<h2>Tax Saving Tip</h2><p>Introduction to the tip...</p><h3>Why This Works</h3><p>Explanation...</p><h3>How to Implement</h3><p>Steps to follow...</p><h3>Potential Savings</h3><p>Expected benefits...</p>" },
  ];

  return (
    <div className="relative">
      {/* Auto-save indicator */}
      {autoSaving && (
        <div className="absolute top-0 right-0 flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4 animate-spin" />
          Auto-saving...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {post ? "Edit Post" : "Create New Post"}
              </h3>
              <Badge variant={formData.status === "published" ? "default" : "secondary"}>
                {formData.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Layout className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Content Templates</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {contentTemplates.map((template, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setFormData({ ...formData, content: template.content })}
                    >
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <div className="flex gap-2">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter an engaging title..."
                  required
                  className="text-lg font-medium"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-friendly-slug"
                required
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary that appears in search results and post previews..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="gap-2">
              <PenTool className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <Image className="h-4 w-4" />
              Media & Tags
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2">
              <Target className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Palette className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>
                  Write your blog post content. Use the toolbar to format text.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showPreview ? (
                  <div className="prose max-w-none p-6 bg-gray-50 rounded-lg min-h-[400px]">
                    <h1>{formData.title}</h1>
                    <div className="text-gray-500 flex items-center gap-4 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formData.readingTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(formData.publishDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                  </div>
                ) : (
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Start writing your blog post..."
                    onSave={() => setAutoSaving(true)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>
                  Add a featured image that represents your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="featuredImage"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                {formData.featuredImage && (
                  <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category & Tags</CardTitle>
                <CardDescription>
                  Organize your post with categories and tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your post for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="A concise description for search engines (150-160 characters)..."
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Search Preview</h4>
                  <div className="space-y-1">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {formData.title || "Page Title"}
                    </p>
                    <p className="text-green-700 text-sm">
                      myeca.in/blog/{formData.slug || "url-slug"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {formData.metaDescription || formData.excerpt || "Page description will appear here..."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>
                  Configure publishing options and visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            Draft
                          </div>
                        </SelectItem>
                        <SelectItem value="review">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            Under Review
                          </div>
                        </SelectItem>
                        <SelectItem value="published">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Published
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Estimated Reading Time</span>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    {formData.readingTime} minutes
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg border">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button type="submit" variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              onClick={() => setFormData({ ...formData, status: "published" })}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {post ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default function AdminBlog() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("list");

  // Fetch blog posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/admin/blog"],
  });

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Post created",
        description: "The blog post has been created successfully.",
      });
      setDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PATCH", `/api/admin/blog/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Post updated",
        description: "The blog post has been updated successfully.",
      });
      setDialogOpen(false);
      setEditingPost(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Post deleted",
        description: "The blog post has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  // Bulk actions
  const handleBulkAction = () => {
    if (selectedPosts.length === 0) {
      toast({
        title: "No posts selected",
        description: "Please select posts to perform bulk action.",
        variant: "destructive",
      });
      return;
    }

    switch (bulkAction) {
      case "publish":
        // Bulk publish logic
        toast({
          title: "Posts published",
          description: `${selectedPosts.length} posts have been published.`,
        });
        break;
      case "draft":
        // Bulk draft logic
        toast({
          title: "Posts moved to draft",
          description: `${selectedPosts.length} posts have been moved to draft.`,
        });
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
          // Bulk delete logic
          toast({
            title: "Posts deleted",
            description: `${selectedPosts.length} posts have been deleted.`,
          });
        }
        break;
    }
    setSelectedPosts([]);
    setBulkAction("");
  };

  // Toggle post selection
  const togglePostSelection = (postId: number) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // Select all posts
  const selectAllPosts = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((post: any) => post.id));
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Stats
  const stats = {
    total: posts.length,
    published: posts.filter((p: any) => p.status === "published").length,
    draft: posts.filter((p: any) => p.status === "draft").length,
    review: posts.filter((p: any) => p.status === "review").length,
  };

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "tax-tips", label: "Tax Tips" },
    { value: "updates", label: "Updates" },
    { value: "guides", label: "Guides" },
    { value: "news", label: "News" },
  ];

  return (
    <div className="admin-blog-page p-10 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            Editorial Suite
          </h1>
          <p className="mt-3 text-slate-500 font-medium text-[16px]">Curate and orchestrate your platform's content strategy</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setSheetOpen(true)} className="h-12 px-6 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold shadow-sm transition-all">
            <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
            AI Content Forge
          </Button>
          <Button onClick={() => { setEditingPost(null); setDialogOpen(true); }} className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold shadow-lg shadow-black/10 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Draft New Article
          </Button>
        </div>
      </div>

      {/* Premium Analytics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] overflow-hidden group hover:shadow-[0_20px_60px_rgb(0,0,0,0.05)] transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Total Articles</span>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] overflow-hidden group hover:shadow-[0_20px_60px_rgb(0,0,0,0.05)] transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Live Content</span>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{stats.published}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] overflow-hidden group hover:shadow-[0_20px_60px_rgb(0,0,0,0.05)] transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Unfinished Drafts</span>
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                <PenTool className="h-5 w-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] overflow-hidden group hover:shadow-[0_20px_60px_rgb(0,0,0,0.05)] transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Review</span>
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{stats.review}</div>
          </CardContent>
        </Card>
      </div>
      {/* Premium Filters and Actions */}
      <Card className="mb-12 bg-white border-none shadow-[0_8px_40px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden">
        <CardContent className="p-10">
          <div className="flex flex-col gap-8">
            {/* Search and Primary Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-6">
                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Search Repository</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Query titles, narratives, or excerpts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none font-medium placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="rounded-xl">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-3 flex justify-end">
                <div className="p-1.5 bg-slate-100 rounded-2xl inline-flex shadow-inner">
                  <Button
                    type="button"
                    variant={viewType === "list" ? "default" : "ghost"}
                    onClick={() => setViewType("list")}
                    className={cn(
                      "rounded-xl h-11 px-4 transition-all duration-300",
                      viewType === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <List className="h-4 w-4 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-tight">List</span>
                  </Button>
                  <Button
                    type="button"
                    variant={viewType === "grid" ? "default" : "ghost"}
                    onClick={() => setViewType("grid")}
                    className={cn(
                      "rounded-xl h-11 px-4 transition-all duration-300",
                      viewType === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-tight">Grid</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Tabs and Selection Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-50">
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
                <TabsList className="bg-slate-50/50 p-1 rounded-2xl border border-slate-100 h-auto">
                  <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tight">
                    All Content ({posts.length})
                  </TabsTrigger>
                  <TabsTrigger value="published" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tight">
                    Published ({stats.published})
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tight">
                    Drafts ({stats.draft})
                  </TabsTrigger>
                  <TabsTrigger value="review" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tight">
                    Review ({stats.review})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {selectedPosts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 bg-blue-50/50 border border-blue-100 p-2 rounded-2xl w-full sm:w-auto"
                >
                  <span className="text-xs font-black text-blue-800 uppercase tracking-widest px-4">
                    {selectedPosts.length} Items
                  </span>
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="h-10 w-40 rounded-xl border-blue-200 bg-white shadow-sm ring-0 focus:ring-0">
                      <SelectValue placeholder="Bulk Action" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-blue-100">
                      <SelectItem value="publish" className="rounded-lg">Publish</SelectItem>
                      <SelectItem value="draft" className="rounded-lg">Move to Draft</SelectItem>
                      <SelectItem value="delete" className="rounded-lg text-red-600">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/20"
                  >
                    Apply
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Posts Display */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4" style={{ color: '#000000' }}>Loading posts...</p>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>No posts found</h3>
            <p className="mb-4" style={{ color: '#333333' }}>
              {searchTerm ? "Try adjusting your search criteria" : "Start creating your first blog post"}
            </p>
            {!searchTerm && (
              <Button onClick={() => { setEditingPost(null); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {viewType === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: any) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => togglePostSelection(post.id)}
                        className="bg-white shadow-sm"
                      />
                    </div>

                    {/* Featured Image */}
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-blog.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={post.status === "published" ? "default" : "secondary"}
                        className={cn(
                          "shadow-sm",
                          post.status === "published" && "bg-green-500 text-white",
                          post.status === "draft" && "bg-yellow-500 text-white",
                          post.status === "review" && "bg-blue-500 text-white"
                        )}
                      >
                        {post.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: '#000000' }}>{post.title}</h3>
                      <p className="text-sm line-clamp-3" style={{ color: '#333333' }}>{post.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#333333' }}>
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: '#333333' }}>
                        <Clock className="h-4 w-4" />
                        {post.readingTime || 5} min
                      </div>
                    </div>

                    {post.tags && JSON.parse(post.tags).length > 0 && (
                      <div className="flex gap-1 flex-wrap mb-4">
                        {JSON.parse(post.tags).slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                          onCheckedChange={selectAllPosts}
                        />
                      </th>
                      <th className="p-4 text-left font-medium" style={{ color: '#000000' }}>Post</th>
                      <th className="p-4 text-left font-medium" style={{ color: '#000000' }}>Category</th>
                      <th className="p-4 text-left font-medium" style={{ color: '#000000' }}>Status</th>
                      <th className="p-4 text-left font-medium" style={{ color: '#000000' }}>Views</th>
                      <th className="p-4 text-left font-medium" style={{ color: '#000000' }}>Date</th>
                      <th className="p-4 text-right font-medium" style={{ color: '#000000' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPosts.map((post: any) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedPosts.includes(post.id)}
                            onCheckedChange={() => togglePostSelection(post.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-4">
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-16 h-16 rounded object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder-blog.jpg";
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium mb-1" style={{ color: '#000000' }}>{post.title}</h4>
                              <p className="text-sm line-clamp-2" style={{ color: '#333333' }}>{post.excerpt}</p>
                              <div className="flex gap-1 flex-wrap mt-2">
                                {post.tags && JSON.parse(post.tags).slice(0, 3).map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm capitalize" style={{ color: '#000000' }}>
                            {post.category || "general"}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={post.status === "published" ? "default" : "secondary"}
                            className={cn(
                              post.status === "published" && "bg-green-100 text-green-800",
                              post.status === "draft" && "bg-yellow-100 text-yellow-800",
                              post.status === "review" && "bg-blue-100 text-blue-800"
                            )}
                          >
                            {post.status === "published" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {post.status === "draft" && <PenTool className="h-3 w-3 mr-1" />}
                            {post.status === "review" && <Clock className="h-3 w-3 mr-1" />}
                            {post.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-sm" style={{ color: '#000000' }}>
                            <Eye className="h-4 w-4" />
                            {post.views || Math.floor(Math.random() * 1000)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm" style={{ color: '#000000' }}>
                            <p>{format(new Date(post.createdAt), 'MMM d, yyyy')}</p>
                            <p className="text-xs" style={{ color: '#333333' }}>
                              {format(new Date(post.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(post)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDelete(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Post
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {editingPost 
                ? "Update the blog post details below." 
                : "Fill in the details to create a new blog post."}
            </DialogDescription>
          </DialogHeader>
          <BlogForm
            post={editingPost}
            onSubmit={handleSubmit}
            onCancel={() => {
              setDialogOpen(false);
              setEditingPost(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}