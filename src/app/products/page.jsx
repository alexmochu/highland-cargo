'use client';

import { Suspense } from 'react';
import Products from './products';

export default function ProductsPage() {
  return (
    <Suspense>
      <Products/>
    </Suspense>
  );
}
