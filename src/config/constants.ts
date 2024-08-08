export const ADMIN_UIDS = [''];

// Handy types for Prisma queries
export const BASE_MOMENT_TYPE = {
  id: true,
  createdAt: true,
  location: true,
  locationLat: true,
  locationLon: true,
  message: true,
  image: true,
  media: true,
};
export const STONE_DETAILS = { id: true, nickname: true, totalDistance: true, mode: true, customBead: true };
export const USER_DETAILS = { username: true, image: true, name: true, uid: true };
export const NOTIFCATION_DETAILS = { title: true, message: true, createdAt: true, image: true, read: true };
export const PRIVATE_VIEW_QUERY = {
  id: true,
  image: true,
  nickname: true,
  mode: true,
  totalDistance: true,
  customBead: true,
  moments: {
    select: { createdAt: true, user: { select: { uid: true, username: true, image: true } } },
  },
  _count: { select: { moments: true, favoritedBy: true } },
  scans: {
    select: { createdAt: true, user: { select: { name: true, username: true } } },
  },
};
export const FAVORITES_VIEW_QUERY = {
  select: {
    id: true,
    image: true,
    scans: { select: { createdAt: true, user: { select: { name: true, username: true } } } },
  },
};
