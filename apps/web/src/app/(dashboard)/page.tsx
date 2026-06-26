// Homepage — placeholder until FA-05 (homepage feed) is implemented.
// The /api/users call was scaffolding from create-next-app and has been removed.
// Real article feed will be wired here by Malindu in FA-05.
import React from 'react';

export default function HomePage(): React.JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-brand-textPrimary">
        Welcome to 1BT WIKI
      </h1>
      <p className="mt-2 text-brand-textSecondary text-sm">
        Your internal knowledge base. Article feed coming soon.
      </p>
    </div>
  );
}
