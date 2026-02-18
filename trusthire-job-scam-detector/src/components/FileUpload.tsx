import { useCallback, useState } from "react";
import { Upload, FileText, Image, MessageSquare, X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

const FileUpload = ({ onFilesSelected, selectedFiles, onRemoveFile }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg"
      );
      if (files.length > 0) {
        onFilesSelected([...selectedFiles, ...files]);
      }
    },
    [onFilesSelected, selectedFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length > 0) {
        onFilesSelected([...selectedFiles, ...files]);
      }
    },
    [onFilesSelected, selectedFiles]
  );

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5 text-destructive" />;
    }
    return <Image className="h-5 w-5 text-primary" />;
  };

  const getFileTypeLabel = (file: File) => {
    if (file.type === "application/pdf") return "PDF";
    if (file.type.includes("image")) return "Image";
    return "File";
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={cn(
          "relative cursor-pointer border-2 border-dashed transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
            id="file-upload"
          />
          <div
            className={cn(
              "mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all",
              isDragging ? "bg-primary/20" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-all",
                isDragging ? "text-primary scale-110" : "text-muted-foreground"
              )}
            />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {isDragging ? "Drop files here" : "Upload Job Documents"}
          </h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Drag & drop files here, or click to browse
          </p>

          {/* File Type Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive">
              <FileText className="h-3.5 w-3.5" />
              Offer Letter (PDF)
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Image className="h-3.5 w-3.5" />
              Job Posting (JPG, PNG)
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
              <MessageSquare className="h-3.5 w-3.5" />
              Chat Screenshots
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 animate-fade-in"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getFileTypeLabel(file)} • {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                    <Check className="h-3.5 w-3.5 text-success" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
