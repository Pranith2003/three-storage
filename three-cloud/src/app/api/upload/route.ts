import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Photo from '@/models/Photo';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const isPrivate = formData.get('isPrivate') === 'true';
    const walletAddress = formData.get('walletAddress') as string;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare for Pinata upload
    const pinataData = new FormData();
    pinataData.append('file', buffer, file.name);

    const pinataRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', pinataData, {
      headers: {
        ...pinataData.getHeaders(),
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    const cid = pinataRes.data.IpfsHash;

    // Save metadata to Mongo
    const newPhoto = new Photo({
      ownerWallet: walletAddress,
      cid,
      description,
      isPrivate,
      uploadedAt: new Date(),
    });

    await newPhoto.save();

    return NextResponse.json({ message: 'File uploaded', cid }, { status: 201 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
  }
}
