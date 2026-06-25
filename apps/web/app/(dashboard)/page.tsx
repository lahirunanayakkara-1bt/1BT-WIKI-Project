// Homepage — placeholder until FA-05 (homepage feed) is implemented.
// Real article + tech-talk feed will be wired here in FA-05.
import React from 'react';

export default function HomePage(): React.JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#1A1A1A]">
        Welcome to 1BT WIKI
      </h1>
      <p className="mt-2 text-[#6B7280] text-sm">
        Your internal knowledge base. Article feed coming soon.
      </p>
    </div>
  );
}
