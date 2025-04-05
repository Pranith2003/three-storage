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

    if (!file || !walletAddress) {
      return NextResponse.json({ error: 'Missing file or wallet address' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pinataData = new FormData();
    pinataData.append('file', buffer, file.name);

    const pinataRes = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      pinataData,
      {
        headers: {
          ...pinataData.getHeaders(),
          Authorization: process.env.PINATA_JWT!, 
        },
      }
    );

    const cid = pinataRes.data.IpfsHash;

    const newPhoto = new Photo({
      ownerWallet: walletAddress,
      cid,
      description,
      isPrivate,
      uploadedAt: new Date(),
    });

    await newPhoto.save();

    return NextResponse.json({ message: 'File uploaded', cid }, { status: 201 });
  } catch (err: any) {
    console.error('❌ Upload error:', err?.response?.data || err);
    return NextResponse.json({ error: 'Failed to upload to Pinata' }, { status: 500 });
  }
}
