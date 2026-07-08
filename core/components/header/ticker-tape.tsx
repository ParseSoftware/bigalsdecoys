import {
  AwardIcon,
  LockIcon,
  RotateCcwIcon,
  ShieldIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
} from 'lucide-react';

export const TICKER_ITEMS = [
  { title: 'MADE IN THE USA', icon: ShieldIcon },
  { title: 'SUPER FAST SHIPPING', icon: TruckIcon },
  { title: '30-DAY RETURNS', icon: RotateCcwIcon },
  { title: '30-DAY RISK-FREE GUARANTEE', icon: AwardIcon },
  { title: 'ULTRA-MATTE FINISH', icon: AwardIcon },
  { title: 'BULK PRICING AVAILABLE', icon: TagIcon },
  { title: 'SECURE CHECKOUT', icon: LockIcon },
  { title: 'FIELD-PROVEN PERFORMANCE', icon: StarIcon },
] as const;

export function TickerTape() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="-my-3 -ml-3 -mr-12 flex overflow-hidden @xl:-mx-12">
      <ul className="animate-ticker flex shrink-0 items-center whitespace-nowrap hover:[animation-play-state:paused]">
        {items.map(({ title, icon: Icon }, index) => (
          <li className="flex items-center" key={`${title}-${index}`}>
            <span className="px-6 py-2.5 font-heading text-xs font-medium uppercase tracking-widest">
              {title}
            </span>
            <Icon className="size-4 h-4 w-4 text-primary" />
          </li>
        ))}
      </ul>
    </div>
  );
}
