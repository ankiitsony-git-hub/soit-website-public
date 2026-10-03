'use client';

import { useEffect } from 'react';

export default function AxeProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      import('react').then(React => {
        import('react-dom').then(ReactDOM => {
          import('@axe-core/react').then(axe => {
            axe.default(React.default, ReactDOM.default, 1000, {
              rules: [
                {
                  id: 'region',
                  enabled: false,
                },
                {
                  id: 'heading-order',
                  enabled: false,
                },
              ],
            });
          });
        });
      });
    }
  }, []);

  return null;
}