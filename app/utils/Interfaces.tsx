interface User {
  id: number;
  username: string;
  permission: number;
  email: string;
  createdAt: string;
  updateAt: string;
  password: string;
  pp: string;
  biography: string;
  userLanguage: string;
  imageUrl?: string
}

interface Comment {
  id: number;
  author: User;
  content: string;
  createdAt: string;
  updateAt: string;
  has_permission: boolean;
}

interface RudimentaryComment {
  id: number;
  content: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  has_permission: boolean;
  comments: Comment[];
  description: string;
  tag: string;
  image: string;
  commentCount: number;
  imageUrl?: string;
}

interface PostWithoutComments {
  id: number;
  title: string;
  slug: string;
  content: string;
  html_content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  has_permission: boolean;
  description: string;
  tag: string;
  image: string;
  commentCount: number;
  required_age: number;
  is_verified: number;
  likes: number;
  views: number;
  imageUrl?: string;
}

interface RudimentaryPost {
  title: string;
  slug: string;
  content: string;
}

interface ServerError {
  errors: {
    message: string;
  }[];
}

interface AuthSuccess {
  token: string;
}

interface ServerToClientEvents {
  connected: (msg: string) => void;
}

interface ClientToServerEvents {
  ok: (msg: string) => void;
}
interface Banner {
  content: string;
  color: string;
  text_link: string;
  link: string;
}

interface ServerToClientEvents {
  connected: (msg: string) => void;
}

interface ClientToServerEvents {
  ok: (msg: string) => void;
}

interface Shorts {
  id: number;
  content: string;
  author: User;
  created_at: string;
  updated_at: string;
  has_permission: boolean;
}

interface UploadResponse {
  path: string;
}
