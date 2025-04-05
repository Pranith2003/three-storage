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
  const { account } = useSDK(); // connected wallet address
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !account) {
      alert('Please select files and connect your wallet');
      return;
    }

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const form = new FormData();
        form.append('file', file);
        form.append('description', description);
        form.append('isPrivate', isPrivate.toString());
        form.append('walletAddress', account);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: form,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Upload failed');
        console.log(`✅ Uploaded ${file.name} → CID: ${data.cid}`);
      }

      alert('✅ All photos uploaded!');
      setSelectedFiles([]);
      setDescription('');
      setIsPrivate(false);
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
        <CardTitle>Upload Photos</CardTitle>
        <CardDescription>Upload multiple photos with optional privacy setting.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">Image Files</Label>
          <Input type="file" id="file" multiple accept="image/*" onChange={handleFileChange} />
          {selectedFiles.length > 0 && (
            <ul className="text-sm text-gray-500 list-disc pl-5">
              {selectedFiles.map((file, idx) => (
                <li key={idx}>📁 {file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="e.g., Family vacation photos"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
          <Label htmlFor="privacy">Private Photos</Label>
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
