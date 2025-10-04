import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUpload = ({ files, onFilesChange, maxFiles = 5 }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)?.slice(0, maxFiles - files?.length);
    const validFiles = newFiles?.filter(file => {
      const isValidType = file?.type?.startsWith('image/');
      const isValidSize = file?.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles?.length > 0) {
      const filesWithPreview = validFiles?.map(file => ({
        file,
        id: Date.now() + Math.random(),
        preview: URL.createObjectURL(file),
        name: file?.name,
        size: file?.size
      }));
      onFilesChange([...files, ...filesWithPreview]);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files?.filter(f => f?.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Photos (Optional)</h4>
        <span className="text-sm text-muted-foreground">
          {files?.length}/{maxFiles} files
        </span>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-micro ${
          dragActive
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={files?.length >= maxFiles}
        />
        
        <div className="space-y-2">
          <Icon name="Upload" size={32} className="mx-auto text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop photos here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG up to 5MB each
            </p>
          </div>
        </div>
      </div>
      {/* File List */}
      {files?.length > 0 && (
        <div className="space-y-2">
          {files?.map((fileItem) => (
            <div
              key={fileItem?.id}
              className="flex items-center space-x-3 p-3 border border-border rounded-lg"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={fileItem?.preview}
                  alt={fileItem?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {fileItem?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileItem?.size)}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(fileItem?.id)}
                iconName="X"
                iconSize={16}
                className="text-muted-foreground hover:text-error"
              />
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        <Icon name="Info" size={12} className="inline mr-1" />
        Photos help technicians understand your service needs better
      </p>
    </div>
  );
};

export default FileUpload;