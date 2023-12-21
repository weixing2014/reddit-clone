import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

import { FieldValue, Timestamp } from 'firebase/firestore';

export type CommunityData = {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'PUBLIC';
  createdAt: Timestamp;
  imageURL?: string;
};

export type UserVotedPost = {
  postId: string;
  value: number; // 0, -1, 1
};

type CommunitiesState = {
  currentCommunity: CommunityData | null;
};

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName?: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  createdAt: Timestamp;
  imageURL?: string;
};

export type CommunitySnippet = {
  communityId: string;
  isModerator: boolean;
};

interface AuthModal {
  open: boolean;
  view?: 'signup' | 'login';
}

interface UIState {
  authModal: AuthModal;
}

const uiInitialState: UIState = {
  authModal: {
    open: false,
    view: 'signup',
  },
};

const userInitialState: { joinedCommunities: CommunitySnippet[] } = {
  joinedCommunities: [],
};

const postsInitialState: { currentPosts: Post[]; userVotedPosts: UserVotedPost[] } = {
  currentPosts: [],
  userVotedPosts: [],
};

const communitiesInitialState: CommunitiesState = {
  currentCommunity: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: uiInitialState,
  reducers: {
    setAuthModalState: (state, action: PayloadAction<AuthModal>) => {
      state.authModal = {
        ...state.authModal,
        ...action.payload,
      };
    },
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setJoinedCommunities: (state, action: PayloadAction<CommunitySnippet[]>) => {
      state.joinedCommunities = action.payload;
    },
  },
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsInitialState,
  reducers: {
    setCurrentPosts: (state, action: PayloadAction<Post[]>) => {
      state.currentPosts = action.payload;
    },
    setUserVotedPosts: (state, action: PayloadAction<UserVotedPost[]>) => {
      state.userVotedPosts = action.payload;
    },
    increaseNumberOfComments: (state, action: PayloadAction<{ postId: string; delta: number }>) => {
      state.currentPosts = state.currentPosts.map((post) =>
        post.id === action.payload.postId
          ? { ...post, numberOfComments: post.numberOfComments + action.payload.delta }
          : post
      );
    },
    updateUserPostVoteValue: (
      state,
      action: PayloadAction<{ postId: string; valueDelta: number }>
    ) => {
      if (!state.userVotedPosts.map((post) => post.postId).includes(action.payload.postId)) {
        state.userVotedPosts = [
          ...state.userVotedPosts,
          { postId: action.payload.postId, value: 0 },
        ];
      }

      state.userVotedPosts = state.userVotedPosts
        .map((post) =>
          post.postId === action.payload.postId
            ? { ...post, value: post.value + action.payload.valueDelta }
            : post
        )
        .filter((post) => post.value);

      state.currentPosts = state.currentPosts.map((post) =>
        post.id === action.payload.postId
          ? { ...post, voteStatus: post.voteStatus + action.payload.valueDelta }
          : post
      );
    },
  },
});

const communitiesSlice = createSlice({
  name: 'communities',
  initialState: communitiesInitialState,
  reducers: {
    setCurrentCommunity: (state, action: PayloadAction<CommunityData>) => {
      state.currentCommunity = action.payload;
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const { setJoinedCommunities } = userSlice.actions;

export const { setAuthModalState } = uiSlice.actions;

export const {
  setCurrentPosts,
  setUserVotedPosts,
  updateUserPostVoteValue,
  increaseNumberOfComments,
} = postsSlice.actions;

export const { setCurrentCommunity } = communitiesSlice.actions;

export const selectAuthModalState = (state: RootState) => state.ui.authModal;

export const selectJoinedCommunities = (state: RootState) => state.user.joinedCommunities;

export const selectCurrentPosts = (state: RootState) => state.posts.currentPosts;

export const selectUserVotedPosts = (state: RootState) => state.posts.userVotedPosts;

export const selectCurrentCommunity = (state: RootState) => state.communities.currentCommunity;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    user: userSlice.reducer,
    posts: postsSlice.reducer,
    communities: communitiesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const selectVoteValueByUserIdAndPostId =
  (userId?: string | null, postId?: string) => (store: any) => {
    if (!postId || !userId) return 0;

    return store.posts.userVotedPosts.find((p: UserVotedPost) => p.postId === postId)?.value || 0;
  };
