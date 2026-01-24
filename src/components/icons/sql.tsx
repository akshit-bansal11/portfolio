import type { SVGProps } from "react";

const SqlIcon = (props: SVGProps<SVGSVGElement>) => (
   <svg
      {...props}
      viewBox="0 0 185.05 235.052"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <ellipse
         cx="92.5"
         cy="42.5"
         ry="35"
         rx="85"
         stroke="#df6c20"
         strokeWidth="15"
      />
      <path
         d="m 7.5,42.5 v 150 a 85.06338,35.026098 1 1 0 170,0 v -150 m -170,50 a 85.06338,35.026098 1 1 0 170,0 m -170,50 a 85.06338,35.026098 1 1 0 170,0"
         stroke="#df6c20"
         strokeWidth="15"
      />
   </svg>
);

export { SqlIcon };