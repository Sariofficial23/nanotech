import type { ComponentType } from 'react';
import { Phone } from 'lucide-react';
import type { ContactChannel } from '../../config/site';
import { InstagramIcon, TelegramIcon } from '../brand/SocialIcons';

export const CHANNEL_ICONS: Record<ContactChannel['kind'], ComponentType<{ className?: string }>> = {
  phone: Phone,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
};
