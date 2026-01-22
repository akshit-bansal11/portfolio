import type { SVGProps } from "react";

const ClionIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        viewBox="0 0 105 105"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <linearGradient
            id="a"
            gradientUnits="userSpaceOnUse"
            x1="39.01"
            x2="66.51"
            y1="23.27"
            y2="23.27"
        >
            <stop offset="0" stopColor="#ff318c" />
            <stop offset=".15" stopColor="#fb348c" />
            <stop offset=".28" stopColor="#f03c8c" />
            <stop offset=".42" stopColor="#de4a8c" />
            <stop offset=".54" stopColor="#c45d8b" />
            <stop offset=".67" stopColor="#a2778b" />
            <stop offset=".79" stopColor="#79958a" />
            <stop offset=".91" stopColor="#49b98a" />
            <stop offset="1" stopColor="#21d789" />
        </linearGradient>
        <linearGradient
            id="b"
            gradientUnits="userSpaceOnUse"
            x1="27.99"
            x2="13.87"
            y1="16.68"
            y2="111.42"
        >
            <stop offset=".09" stopColor="#21d789" />
            <stop offset=".9" stopColor="#009ae5" />
        </linearGradient>
        <linearGradient
            id="c"
            x1="92.05"
            x2="-4.53"
            xlinkHref="#b"
            y1="13.4"
            y2="115.4"
        />
        <linearGradient
            id="d"
            x1="62.84"
            x2="95.87"
            xlinkHref="#b"
            y1="77.02"
            y2="81.72"
        />
        <path d="m39.01 42.04 2.08-37.54 21.83 12.1z" fill="url(#a)" />
        <path d="m39.01 42.04 2.08-37.54-27.72 17.47-8.87 53.11z" fill="url(#b)" />
        <path
            d="m98.59 33.27-12.35-25.11-23.32 8.44-23.91 25.44-34.51 33.04 31.13 22.66 39.13-35.29z"
            fill="url(#c)"
        />
        <path
            d="m82.5 59.54v22.96h-37.7l16.57 12.82 24 5.18 15.13-34.25z"
            fill="url(#d)"
        />
        <path d="m22.5 22.5h60v60h-60z" />
        <g fill="#fff">
            <path d="m29.98 71.16h22.5v3.75h-22.5z" />
            <path d="m52.55 29.94h5v18.39h9.85v4.17h-14.85z" />
            <path d="m28.38 41.37v-.06a11.54 11.54 0 0 1 11.83-11.74 11.71 11.71 0 0 1 8.94 3.5l-3.15 3.67a8.38 8.38 0 0 0 -5.81-2.56c-3.82 0-6.57 3.17-6.57 7.06v.07c0 3.89 2.69 7.13 6.57 7.13 2.6 0 4.18-1 6-2.66l3.12 3.22a11.6 11.6 0 0 1 -9.31 4 11.45 11.45 0 0 1 -11.62-11.63" />
        </g>
    </svg>
);

export { ClionIcon };
