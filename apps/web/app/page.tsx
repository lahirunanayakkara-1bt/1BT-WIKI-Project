"use client"

import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className={styles.page}>
      <main>
        <ol>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ol>
        <Button appName="web">
          Open alert
        </Button>
      </main>
      <footer>
        <div>Footer content test</div>
      </footer>
    </div>
  );
}
