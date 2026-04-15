import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  res.status(200).json({
    status: 'ok',
    message: 'OrderFlow Terminal API is running',
    timestamp: new Date().toISOString(),
    version: '4.0.0'
  });
}
