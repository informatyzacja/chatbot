import { createHmac } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const VERIFY_TOKEN = process.env.VERIFY_TOKEN ?? '';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN ?? '';

interface ResponseRecipient {
  id: string;
}

interface ResponseMessage {
  text: string;
}

interface Response {
  messaging_type: string;
  recipient: ResponseRecipient;
  message: ResponseMessage;
}

function handleVerificationRequest(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query['hub.mode'] ?? '';
  const token = req.query['hub.verify_token'] ?? '';
  const challenge = req.query['hub.challenge'] ?? '';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('');
    }
  }
}

function verifyRequestSignature(signature: string, data: string): boolean {
  const hmac = createHmac('sha1', PAGE_ACCESS_TOKEN)
    .update(data, 'utf-8')
    .digest('hex');
  return signature === `sha1=${hmac}`;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleMessage(data: any, signature: string, res: NextApiResponse) {
  if (!verifyRequestSignature(signature, data as string)) {
    res.status(200).send('Invalid signature');
    return;
  }

  if (data.object === 'page') {
    for (const pageEntry of data.entry) {
      const pageID = pageEntry.id as string;

      for (const messagingEvent of pageEntry.messaging) {
        const senderID = messagingEvent.sender.id as string;
        const messageContent = messagingEvent.message.text as string;

        if (pageID === senderID) {
          return;
        }

        const recipient: ResponseRecipient = {
          id: senderID,
        };

        const message: ResponseMessage = {
          text: `echo: ${messageContent}`,
        };

        const response: Response = {
          messaging_type: 'RESPONSE',
          recipient: recipient,
          message: message,
        };
        void fetch(
          `https://graph.facebook.com/v17.0/${pageID}/messages?access_token=${PAGE_ACCESS_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
          },
        );
      }
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      handleVerificationRequest(req, res);
      break;
    }
    case 'POST': {
      const data = req.body;
      const signature = (req.headers['x-hub-signature'] ?? '') as string;
      handleMessage(data, signature, res);
      break;
    }
    default:
      res.status(200).send('');
  }
}
