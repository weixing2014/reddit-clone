import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { firestore } from '@/firebase/clientApp';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [value, loading, error] = useCollection(collection(firestore, 'communities'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  return (
    <div>
      {value?.docs.map((doc) => (
        <div key={doc.id}>
          {doc.id}: {JSON.stringify(doc.data())},{' '}
        </div>
      ))}
    </div>
  );
}
