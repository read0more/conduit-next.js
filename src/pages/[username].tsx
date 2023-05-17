import { useRouter } from 'next/router';
import React from 'react';

export default function Profile() {
  const { query } = useRouter();
  return <div>{query.username}</div>;
}
