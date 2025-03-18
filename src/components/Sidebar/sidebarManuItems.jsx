import React from 'react';
import { Dashboard as DashboardIcon, Person as UserIcon, Task as TaskIcon, 
        Gavel as DisputeIcon, Receipt as RequestIcon, MonetizationOn as TransactionIcon, 
        Campaign as PromotionIcon, AccountCircle as ProfileIcon, Description as TermsIcon } from '@mui/icons-material';

const menuItems = [
  { path: '/home', icon: <DashboardIcon />, text: 'Home' },
  { path: '/user', icon: <UserIcon />, text: 'Users' },
  { path: '/task', icon: <TaskIcon />, text: 'Tasks' },
  { path: '/disputes', icon: <DisputeIcon />, text: 'Disputes' },
  { path: '/requsts', icon: <RequestIcon />, text: 'Request' },
  { path: '/transections', icon: <TransactionIcon />, text: 'Tansections' },
  { path: '/promotions', icon: <PromotionIcon />, text: 'Promotions' },
  { path: '/profile', icon: <ProfileIcon />, text: 'Profile' },
  { path: '/termsconditions', icon: <TermsIcon />, text: 'Terms & Conditions' },
];

export default menuItems;
