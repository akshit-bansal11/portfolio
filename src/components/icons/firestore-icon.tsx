import type { SVGProps } from "react";

const FirestoreIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      {...props}
      viewBox="0 0 224.98399 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <defs>
         <linearGradient
            id="gradient1"
            gradientUnits="userSpaceOnUse"
            x1="249.95506"
            y1="262.49997"
            x2="362.48438"
            y2="262.49997"
            gradientTransform="translate(-137.5,-124.99997)"
         >
            <stop stopColor="#ff9100" offset="0" />
            <stop stopColor="#ff9100" offset="0.9985" />
         </linearGradient>
      </defs>
      <path
         d="m 154.6875,181.25003 -42.1875,18.75 v 50 l 98.4375,-43.75 z"
         fill="#dd2c00"
         fillRule="evenodd"
         clipRule="evenodd"
      />
      <path
         d="m 112.45507,137.5137 0.0293,-0.0137 112.5,50 v -6.25 -43.75 l -112.5,-50 -0.0293,0.0137 z"
         fill="url(#gradient1)"
         fillRule="evenodd"
         clipRule="evenodd"
      />
      <path
         d="m 112.4707,137.5137 v -50 L 0,137.50003 v 50 z"
         fill="#ffc400"
         fillRule="evenodd"
         clipRule="evenodd"
      />
      <path
         d="m 112.11715,50.0137 0.0293,-0.0137 112.5,50 V 50 l -112.5,-50 -0.0293,0.0137 z"
         fill="#ff9100"
         fillRule="evenodd"
         clipRule="evenodd"
      />
      <path
         d="m 112.4707,50.0137 v -50 L 0,50.00003 v 50 z"
         fill="#ffc400"
         fillRule="evenodd"
         clipRule="evenodd"
      />
   </svg>
);

export { FirestoreIcon };
