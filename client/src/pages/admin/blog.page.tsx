import { useState, useEffect, useRef } from "react";
import { sanitizeHTML } from '@/lib/sanitize';
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
  Palette, Layout, Target, Globe, TrendingUp, Bell,
  Landmark, Receipt, Rocket, Calculator
} from "lucide-react";
import { m } from "framer-motion";
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

const Loader2 = ({ className }: { className?: string }) => (
  <m.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={cn("w-8 h-8", className)}
  >
    <div className="w-full h-full border-4 border-current border-t-transparent rounded-full" />
  </m.div>
);


// Enhanced Rich Text Editor with more features
// Enhanced Rich Text Editor with Blog-Specific Typography
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

  // Sync value to editor only if it's different and not active
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = sanitizeHTML(value);
    }
  }, [value]);

  useEffect(() => {
    const text = (value || "").replace(/<[^>]*>/g, '');
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(sanitizeHTML(editorRef.current.innerHTML));
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
    <div className="flex flex-col h-full">
      {/* Floating Assistant Toolbar */}
      <div className="sticky top-0 z-10 p-2 bg-white/80 backdrop-blur-md border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 gap-1 font-bold text-[10px] uppercase tracking-widest text-slate-500">
                <Hash className="h-3.5 w-3.5" />
                Structure
                <ChevronRight className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 min-w-[200px] rounded-xl border-slate-200">
              <DropdownMenuItem onClick={() => insertHeading(1)} className="rounded-lg py-3">
                <span className="text-xl font-black text-slate-900">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(2)} className="rounded-lg py-3">
                <span className="text-lg font-black text-slate-800">Heading 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(3)} className="rounded-lg py-3">
                <span className="text-base font-black text-slate-700">Heading 3</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => execCommand('formatBlock', '<p>')} className="rounded-lg py-3">
                <span className="text-sm font-bold text-slate-500">Normal Intel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-slate-200 mx-2" />

          {toolbarButtons.map((button, index) => (
            button.separator ? (
              <div key={`sep-${index}`} className="h-4 w-px bg-slate-200 mx-1" />
            ) : (
              <Button
                key={button.command || `btn-${index}`}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => button.onClick ? button.onClick() : execCommand(button.command, button.value)}
                title={button.tooltip}
                className="h-9 w-9 p-0 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            )
          ))}
        </div>

        <div className="flex items-center gap-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            {wordCount} Signals
          </span>
        </div>
      </div>

      {/* Actual Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(sanitizeHTML((e.target as HTMLDivElement).innerHTML))}
        placeholder={placeholder}
        className="flex-1 p-0 focus:outline-none prose prose-slate max-w-none 
          prose-p:text-[18px] prose-p:text-slate-800/90 prose-p:leading-[1.8] prose-p:font-medium prose-p:tracking-tight
          prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:italic
          prose-li:text-slate-600 prose-li:font-medium prose-li:text-lg
          prose-strong:text-slate-900 prose-strong:font-black"
      />

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="rounded-3xl p-8 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Neural Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
               <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Destination URL</Label>
               <Input
                 value={linkUrl}
                 onChange={(e) => setLinkUrl(e.target.value)}
                 placeholder="https://..."
                 className="rounded-xl border-slate-200 h-11"
               />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowLinkDialog(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button onClick={insertLink} className="rounded-xl bg-blue-600 text-white font-black px-6 shadow-lg shadow-blue-500/20">Establish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Enhanced Blog Form with SEO and Preview
const BlogForm = ({ post, categories, onSubmit, onCancel }: { post?: any, categories: any[], onSubmit: (data: any) => void, onCancel: () => void }) => {
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    tags: post?.tags ? (typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags) : [],
    featuredImage: post?.featuredImage || "",
    status: post?.status || "draft",
    categoryId: post?.categoryId || (categories.length > 0 ? categories[0].id : null),
    metaDescription: post?.metaDescription || "",
    metaKeywords: post?.metaKeywords || "",
    publishDate: post?.publishDate || new Date().toISOString().split('T')[0],
    readingTime: post?.readingTime || 5,
  });

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, slug });
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId.toString()) : null,
      authorId: user?.id,
      tags: formData.tags,
    };
    onSubmit(submitData);
  };

  const mappedCategories = categories.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.name.toLowerCase().includes("tax") ? Calculator : 
          cat.name.toLowerCase().includes("gst") ? Receipt :
          cat.name.toLowerCase().includes("legal") ? Landmark : BookOpen
  }));

  const categoryName = categories.find(c => c.id.toString() === formData.categoryId?.toString())?.name || "Uncategorized";

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-xl hover:bg-slate-100 font-bold text-xs uppercase tracking-widest text-slate-500">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Cache
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <PenTool className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Editor Mode</p>
                <h2 className="text-sm font-black text-slate-900 leading-none">Intelligence Synthesis</h2>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
             <Button 
              variant={!showPreview ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setShowPreview(false)}
              className="rounded-lg font-bold text-[10px] uppercase tracking-widest"
             >
               Edit
             </Button>
             <Button 
              variant={showPreview ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setShowPreview(true)}
              className="rounded-lg font-bold text-[10px] uppercase tracking-widest"
             >
               Preview
             </Button>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <Button 
            onClick={handleSubmit}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4" />
            Deploy to Global
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        <div className={cn("flex-1 overflow-y-auto bg-slate-100/30", showPreview ? "hidden lg:block w-1/2" : "w-full")}>
           <div className="max-w-[900px] mx-auto py-16 px-8">
              <div className="mb-12 space-y-6">
                 <Input 
                   value={formData.title}
                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   placeholder="Intelligence Headline..."
                   className="text-4xl md:text-6xl font-black bg-transparent border-none p-0 h-auto focus-visible:ring-0 placeholder:text-slate-200 tracking-tighter"
                 />
                 
                 <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-500 shadow-sm">
                       <Link2 className="w-4 h-4 text-slate-300" />
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40">/blog/</span>
                       <input 
                         value={formData.slug}
                         onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                         className="bg-transparent border-none p-0 text-[11px] font-black text-blue-600 focus:ring-0 outline-none w-auto min-w-[120px]"
                       />
                       <Button variant="ghost" size="icon" onClick={generateSlug} className="h-6 w-6 p-0 hover:bg-blue-50 rounded-lg">
                         <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                       </Button>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-500 shadow-sm">
                       <Clock className="w-4 h-4 text-slate-300" />
                       <input 
                         type="number"
                         value={formData.readingTime}
                         onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) })}
                         className="bg-transparent border-none p-0 text-[11px] font-black text-slate-900 focus:ring-0 w-8 text-center"
                       />
                       <span className="text-[11px] font-black uppercase tracking-widest opacity-40">Min Read</span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-blue-600 shadow-sm">
                       <Calendar className="w-4 h-4" />
                       <input 
                         type="date"
                         value={formData.publishDate}
                         onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                         className="bg-transparent border-none p-0 text-[11px] font-black focus:ring-0 uppercase tracking-widest cursor-pointer"
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[1000px] flex flex-col">
                 <div className="p-12 md:p-20 flex-1 flex flex-col">
                    <RichTextEditor 
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="Start drafting high-signal intelligence here..."
                    />
                 </div>
              </div>
              <div className="h-32" />
           </div>
        </div>

        <div className={cn("w-[420px] bg-white border-l border-slate-200 overflow-y-auto shrink-0", showPreview ? "w-1/2" : "w-[420px]")}>
           {showPreview ? (
              <div className="h-full flex flex-col bg-white">
                 <div className="h-16 border-b border-slate-100 flex items-center px-12 justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5" />
                      Global Preview Resolution
                    </span>
                    <Badge variant="outline" className="text-[9px] font-black border-emerald-100 text-emerald-600 bg-emerald-50 rounded-full px-4">Signals Verified</Badge>
                 </div>
                 <div className="flex-1 overflow-y-auto p-12 lg:p-20 scrollbar-hide">
                    <article className="max-w-none">
                       <div className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                          {categoryName}
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          {format(new Date(formData.publishDate), 'MMMM d, yyyy')}
                       </div>
                       
                       <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                          {formData.title || "Untitled Intelligence"}
                       </h1>

                       {formData.featuredImage && (
                          <div className="aspect-[16/9] rounded-[2rem] overflow-hidden mb-12 shadow-2xl border border-slate-100">
                             <img src={formData.featuredImage} className="w-full h-full object-cover" alt="Hero" />
                          </div>
                       )}

                       <div className="text-xl text-slate-500 font-medium leading-relaxed italic mb-12 border-l-[6px] border-blue-500 pl-8 bg-blue-50/30 py-6 rounded-r-3xl">
                          {formData.excerpt}
                       </div>

                       <div 
                         className="prose prose-slate max-w-none
                           prose-p:text-[18px] prose-p:text-slate-800/90 prose-p:leading-[1.8] prose-p:font-medium prose-p:tracking-tight
                           prose-headings:font-black prose-headings:text-slate-900
                           prose-strong:text-slate-900 prose-strong:font-black"
                         dangerouslySetInnerHTML={{ __html: sanitizeHTML(formData.content) }}
                       />
                       
                       <div className="mt-16 pt-12 border-t border-slate-100 flex flex-wrap gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          {formData.tags.map((t: string) => <span key={t}>#{t}</span>)}
                       </div>
                    </article>
                 </div>
              </div>
           ) : (
              <div className="p-8 space-y-12 pb-24">
                 <section>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">Media Core</label>
                    <div className="space-y-4">
                       <div className="aspect-[16/10] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative group overflow-hidden shadow-inner">
                          {formData.featuredImage ? (
                            <img src={formData.featuredImage} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-slate-200 border border-slate-100">
                                <Image className="w-6 h-6" />
                              </div>
                              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Connect Hero Entity</span>
                            </>
                          )}
                       </div>
                       <div className="relative">
                          <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input 
                            value={formData.featuredImage}
                            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                            placeholder="Input Entity URL..." 
                            className="rounded-xl border-slate-200 bg-white text-xs h-11 pl-12"
                          />
                       </div>
                    </div>
                 </section>

                 <Separator className="bg-slate-100" />

                 <section>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">Taxonomy</label>
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Target Segment</Label>
                          <Select
                            value={formData.categoryId?.toString()}
                            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                          >
                            <SelectTrigger className="rounded-xl bg-white border-slate-200 h-11 shadow-sm">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                              {mappedCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <cat.icon className="h-3.5 w-3.5 text-blue-600" />
                                    <span className="font-bold text-xs">{cat.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                       </div>

                       <div className="space-y-4">
                          <Label className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Descriptor Nodes (Tags)</Label>
                          <div className="flex gap-2">
                            <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              placeholder="Add node..."
                              className="rounded-xl bg-white border-slate-200 h-11 text-xs shadow-sm"
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag} className="rounded-xl bg-slate-900 h-11 w-11 p-0 shadow-lg shadow-slate-900/10">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {formData.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="rounded-lg bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 gap-2 hover:bg-red-50 hover:text-red-600 transition-all cursor-default">
                                <span className="text-[10px] font-black">{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTag(index)}
                                  className="text-[14px] leading-none"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                       </div>
                    </div>
                 </section>

                 <Separator className="bg-slate-100" />

                 <section>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">Search Optimization</label>
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Abstract (Excerpt)</Label>
                          <Textarea 
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Brief neural summary for indexers..."
                            className="rounded-2xl border-slate-200 bg-white text-xs min-h-[120px] resize-none focus:ring-blue-500 shadow-sm p-4 leading-relaxed"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Indexing Keywords</Label>
                          <Input 
                            value={formData.metaKeywords}
                            onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                            placeholder="tax, wealth, future..."
                            className="rounded-xl border-slate-200 bg-white text-xs h-11 shadow-sm"
                          />
                       </div>
                    </div>
                 </section>

                 <div className="pt-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Stable</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-300">v7.3.0</span>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default function AdminBlog() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // Fetch blog posts
  const { data: postsData, isLoading: postsLoading } = useQuery<{ posts: any[] }>({
    queryKey: ["/api/cms/posts"],
    queryFn: async () => {
      const response = await apiRequest("/api/cms/posts");
      const data = await response.json();
      return data;
    }
  });

  // Fetch categories
  const { data: catData, isLoading: categoriesLoading } = useQuery<{ categories: any[] }>({
    queryKey: ["/api/cms/categories"],
    queryFn: async () => {
      const response = await apiRequest("/api/cms/categories");
      const data = await response.json();
      return data;
    }
  });

  const posts = (postsData as any)?.posts || [];
  const categories = (catData as any)?.categories || [];
  const isLoading = postsLoading || categoriesLoading;

  const filteredPosts = posts.filter((post: any) => {
    const title = post.title || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.categoryId?.toString() === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate Stats
  const stats = {
    total: posts.length,
    published: posts.filter((p: any) => p.status === "published").length,
    drafts: posts.filter((p: any) => p.status === "draft").length,
    reviews: posts.filter((p: any) => p.status === "review").length,
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/cms/posts", {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/posts"] });
      toast({ title: "Intelligence Captured", description: "The new insight has been successfully logged." });
      setDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => 
      apiRequest(`/api/cms/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/posts"] });
      toast({ title: "Neural Link Updated", description: "Your modifications have been synchronized." });
      setDialogOpen(false);
      setEditingPost(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => apiRequest(`/api/cms/posts/${id}`, {
      method: "DELETE"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/posts"] });
      toast({ title: "Insight Redacted", description: "The intelligence entry has been purged." });
    },
  });

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you certain you wish to redact this intelligence?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <m.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
              <BookOpen className="w-4 h-4" />
              Intelligence Management
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The <span className="text-blue-600">Vault</span></h1>
            <p className="text-slate-500 font-medium mt-4">Curating and deploying high-signal financial intelligence.</p>
          </m.div>

          <m.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
               <Button 
                variant={viewType === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewType("list")}
                className="rounded-xl"
               >
                 <List className="w-4 h-4" />
               </Button>
               <Button 
                variant={viewType === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewType("grid")}
                className="rounded-xl"
               >
                 <Layout className="w-4 h-4" />
               </Button>
            </div>
            <Button 
              onClick={() => { setEditingPost(null); setDialogOpen(true); }}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
              New Insight
            </Button>
          </m.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Total Assets", value: stats.total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Deployed", value: stats.published, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "In Review", value: stats.reviews, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Drafted", value: stats.drafts, icon: PenTool, color: "text-slate-500", bg: "bg-slate-100" },
          ].map((stat, i) => (
            <m.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </m.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm mb-12 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search intelligence cache..." 
              className="pl-12 h-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
             <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="h-12 rounded-2xl w-[160px] bg-white border-slate-200 font-bold text-xs uppercase tracking-widest">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Every State</SelectItem>
                 <SelectItem value="published">Deployed</SelectItem>
                 <SelectItem value="draft">Drafted</SelectItem>
                 <SelectItem value="review">In Review</SelectItem>
               </SelectContent>
             </Select>

             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
               <SelectTrigger className="h-12 rounded-2xl w-[160px] bg-white border-slate-200 font-bold text-xs uppercase tracking-widest">
                 <SelectValue placeholder="Topic" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Topics</SelectItem>
                 {categories.map((cat: any) => (
                   <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
          </div>
        </div>

        {/* Content View */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
             <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Querying Database...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-200">
                <Target className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">No signals detected</h3>
             <p className="text-slate-500 font-medium">Adjust your filters to scan different frequency bands.</p>
          </div>
        ) : viewType === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post: any, i: number) => (
              <m.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group h-full bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  <div className="h-48 relative overflow-hidden bg-slate-50">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-20 filter grayscale transition-all group-hover:grayscale-0 group-hover:scale-110 duration-700">
                      {post.featuredImage || post.image || "📄"}
                    </div>
                    <div className="absolute top-6 right-6">
                      <Badge className={cn(
                        "rounded-xl px-4 py-1.5 font-black text-[9px] uppercase tracking-widest border-none shadow-lg",
                        post.status === "published" ? "bg-emerald-500 text-white shadow-emerald-500/20" : 
                        post.status === "review" ? "bg-amber-500 text-white shadow-amber-500/20" : 
                        "bg-slate-500 text-white shadow-slate-500/20"
                      )}>
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 flex-grow flex flex-col">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Tag className="w-3 h-3" />
                       {post.category}
                    </p>
                    <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex -space-x-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 font-black text-xs shadow-sm">
                            {post.author?.firstName?.charAt(0) || "A"}
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} className="rounded-xl hover:bg-blue-50 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="rounded-xl hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100">
                    <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Signal</th>
                    <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Topic</th>
                    <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {filteredPosts.map((post: any) => (
                   <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-8">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                               {post.featuredImage || post.image || "📄"}
                            </div>
                            <div>
                               <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{post.title}</p>
                               <p className="text-xs text-slate-400 font-medium">{(() => {
                                   try {
                                     const dateObj = post.createdAt;
                                     let date: Date;
                                     if (dateObj?._seconds) {
                                       date = new Date(dateObj._seconds * 1000);
                                     } else if (dateObj?.toDate) {
                                       date = dateObj.toDate();
                                     } else {
                                       date = new Date(dateObj);
                                     }
                                     return isNaN(date.getTime()) ? "No Date" : format(date, 'MMM d, yyyy');
                                   } catch (e) {
                                     return "No Date";
                                   }
                                 })()}
</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-8 capitalize">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-4 py-1.5 bg-blue-50 rounded-full">
                            {post.category}
                         </span>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", 
                              post.status === "published" ? "bg-emerald-500" : 
                              post.status === "review" ? "bg-amber-500" : "bg-slate-400"
                            )} />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600">{post.status}</span>
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} className="rounded-xl hover:bg-blue-50 hover:text-blue-600">
                               <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="rounded-xl hover:bg-red-50 hover:text-red-600">
                               <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Editor Full Screen Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none border-none overflow-hidden flex flex-col bg-slate-50">
          <BlogForm 
            post={editingPost}
            categories={categories}
            onSubmit={(data) => {
              if (editingPost) {
                updateMutation.mutate({ id: editingPost.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}