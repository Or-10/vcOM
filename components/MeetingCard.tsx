// components/MeetingCard.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { avatarImages } from '@/constants';
import { useToast } from './ui/use-toast';

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  children?: React.ReactNode;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  children,
}) => {
  const { toast } = useToast();

  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn('flex justify-center relative', {})}>
        {/* <Image
           src= {avatarImages}
           alt="Avatar"
           width={52}
           height={52}
           className="object-contain w-[62px] h-[52px] absolute top-[-30%]"
        /> */}
        <Button
          className="py-4 bg-secondary-bg w-full flex items-center justify-center rounded-[14px] gap-4 mt-[8%]"
          onClick={handleClick}
        >
          {buttonIcon1 && <Image src={buttonIcon1} alt="Play" width={20} height={20} />}
          {buttonText && <span>{buttonText}</span>}
        </Button>
        {children}
      </article>
    </section>
  );
};

export default MeetingCard;
