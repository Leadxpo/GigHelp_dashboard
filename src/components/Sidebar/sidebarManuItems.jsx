import React from 'react';
import {
  Dashboard as DashboardIcon,
  Person as UserIcon,
  Task as TaskIcon,
  Gavel as DisputeIcon,
  Receipt as RequestIcon,
  MonetizationOn as TransactionIcon,
  Campaign as PromotionIcon,
  AccountCircle as ProfileIcon,
  Description as TermsIcon,
} from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const menuItems = [
  { path: '/home', icon: <DashboardIcon />, text: 'Home' },
  { path: '/systemuser', icon: <UserIcon />, text: 'System Users' },

  {
    text: 'Categories',
    icon: <CategoryIcon />,
    submenu: [
      {
        path: '/categories/categories',
        text: 'Main Category',
        icon: <FiberManualRecordIcon fontSize="small" />,
      },
      {
        path: '/categories/subcategories',
        text: 'Sub Category',
        icon: <FiberManualRecordIcon fontSize="small" />,
      },
    ],
  },
  { path: '/user', icon: <UserIcon />, text: 'Users' },
  { path: '/task', icon: <TaskIcon />, text: 'Tasks' },
  { path: '/disputes', icon: <DisputeIcon />, text: 'Disputes' },
  { path: '/requsts', icon: <RequestIcon />, text: 'Request' },
  { path: '/transections', icon: <TransactionIcon />, text: 'Tansections' },
  { path: '/promotions', icon: <PromotionIcon />, text: 'Promotions' },
  // { path: '/profile', icon: <ProfileIcon />, text: 'Profile' },
  { path: '/termsconditions', icon: <TermsIcon />, text: 'Terms & Conditions' },
];

export default menuItems;
