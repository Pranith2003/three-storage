'use client';

import FileUpload from '@/components/custom/FileUpload';




export default function DashBoardPage() {
  return <><div>This is DashBoard page 
  <FileUpload
tagline="Choose an image to upload"
onFileSelect={(file) => {
  console.log('Selected file:', file);
  // set state here or encrypt/send to backend
}}
/>
</div></>
  ;
}
