import { TICKER_ITEMS } from '~/lib/brand';

/**
 * Scrolling "ticker tape" marquee rendered inside the header banner slot.
 *
 * Pure CSS marquee (see the `ticker` keyframes / `animate-ticker` utility in
 * tailwind.config.js). The item list is duplicated so the -50% translate loops
 * seamlessly, and the negative margins cancel the Banner primitive's inner
 * padding so the bar runs edge to edge. Animation pauses on hover.
 */
export function TickerTape() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="-my-3 -ml-3 -mr-12 flex overflow-hidden @xl:-mx-12">
      <ul className="animate-ticker flex shrink-0 items-center whitespace-nowrap hover:[animation-play-state:paused]">
        {items.map((item, index) => (
          <li className="flex items-center" key={`${item}-${index}`}>
            <span className="px-6 py-2.5 font-heading text-xs font-medium uppercase tracking-widest">
              {item}
            </span>
            <span aria-hidden className="text-primary">
              &#9670;
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
