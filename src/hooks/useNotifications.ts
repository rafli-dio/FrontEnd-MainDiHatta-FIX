'use client';

import { useState } from 'react';

export interface NotificationItem {
  id: number;
  type: string;
  data: any;
  read?: boolean;
}

export default function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));

  return { items, setItems, markAllRead };
}
