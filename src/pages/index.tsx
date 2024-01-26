import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { firestore } from '@/firebase/clientApp';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import PageContent from '@/components/Layout/PageContent';
import Sidebar from '@/components/Community/Sidebar';
import usePosts from '@/hooks/usePosts';
import { useEffect, useState } from 'react';
import { fetchTopPostsAsync } from '@/firebase/api/api';
import { Post as PostData } from '@/redux/appSlice';
import Post from '@/components/Community/Post';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);

  const initData = async () => {
    setPosts(await fetchTopPostsAsync(5));
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <PageContent>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <Sidebar />
    </PageContent>
  );
}
