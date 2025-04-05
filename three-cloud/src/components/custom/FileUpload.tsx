'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSDK } from '@metamask/sdk-react';

export default function FileUploadCard() {
  const { account } = useSDK(); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !account) {
      alert('Please select a file and connect your wallet');
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append('file', selectedFile);
      form.append('description', description);
      form.append('isPrivate', isPrivate.toString());
      form.append('walletAddress', account);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Uploaded to IPFS!\nCID: ${data.cid}`);
        // Reset form
        setSelectedFile(null);
        setFileName('');
        setDescription('');
        setIsPrivate(false);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error(error);
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Photo</CardTitle>
        <CardDescription>Select a photo, add details, and choose privacy.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">Image File</Label>
          <Input type="file" id="file" accept="image/*" onChange={handleFileChange} />
          {fileName && <p className="text-sm text-gray-500">📁 Selected: {fileName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="e.g., Beach photo from Goa trip"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
          <Label htmlFor="privacy">Private Photo</Label>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </CardFooter>
    </Card>
  );
}
