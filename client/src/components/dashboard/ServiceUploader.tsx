import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ServiceUploaderProps {
  serviceId: string;
  serviceType: string;
  expectedDocs: { id: string; name: string; required: boolean }[];
}

export function ServiceUploader({ serviceType, expectedDocs }: ServiceUploaderProps) {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  const { toast } = useToast();

  const handleFileChange = (docId: string, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }
    setUploadedDocs((prev) => ({ ...prev, [docId]: file }));
  };

  const removeFile = (docId: string) => {
    setUploadedDocs((prev) => ({ ...prev, [docId]: null }));
  };

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-600" />
          Required Documents for {serviceType}
        </CardTitle>
        <CardDescription>Upload clear copies of the following documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {expectedDocs.map((doc) => (
          <div key={doc.id} className="relative">
            <div className={`p-4 rounded-xl border-2 border-dashed transition-all ${
              uploadedDocs[doc.id] 
                ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" 
                : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${uploadedDocs[doc.id] ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500 dark:bg-gray-700"}`}>
                    <File className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {doc.name}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {uploadedDocs[doc.id] ? (uploadedDocs[doc.id] as File).name : "PDF, JPG or PNG (Max 10MB)"}
                    </p>
                  </div>
                </div>

                {uploadedDocs[doc.id] ? (
                  <Button variant="ghost" size="icon" onClick={() => removeFile(doc.id)} className="h-8 w-8 text-gray-500 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>Upload</span>
                    </Button>
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
            Submit Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
