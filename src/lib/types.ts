export interface Group {
  id: string;
  name: string;
  order?: number; // Optional field for ordering groups
}

export interface Space {
  id: string;
  name: string;
  groupId: string; // Reference to a group document ID
  order?: number; // Optional field for ordering spaces within groups
}

export interface SpaceGroup {
  id: string;
  name: string;
  spaces: Space[];
}

export interface Post {
  id: string;
  title: string;
  spaceId: string; // Reference to a space document ID
  tags: string[];
  createdAt: Date;
  contentHTML: string;
  contentJSON?: object; // Optional now that we're using Jodit
  hearts: number; // Number of heart reactions
}

export interface CreatePostData {
  title: string;
  spaceId: string;
  tags: string[];
  contentHTML: string;
  contentJSON?: object;
  hearts?: number; // Optional, defaults to 0
}

export interface UpdatePostData {
  title?: string;
  spaceId?: string;
  tags?: string[];
  contentHTML?: string;
  contentJSON?: object; // Optional now that we're using Jodit
  hearts?: number; // Optional for updating heart count
}

export interface CreateGroupData {
  name: string;
  order?: number;
}

export interface UpdateGroupData {
  name?: string;
  order?: number;
}

export interface CreateSpaceData {
  name: string;
  groupId: string;
  order?: number;
}

export interface UpdateSpaceData {
  name?: string;
  groupId?: string;
  order?: number;
}

// Firebase document data type
export type FirestoreDocumentData = {
  [key: string]: unknown;
};
