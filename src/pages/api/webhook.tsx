import type { NextApiRequest, NextApiResponse } from 'next';

function handleVerificationRequest(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('');
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      handleVerificationRequest(req, res);
      break;
    }
    case 'POST':
      break;
    default:
      res.status(200).send('');
  }
}
