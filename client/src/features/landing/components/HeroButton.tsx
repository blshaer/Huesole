"use client"

import { Button } from "@/shared/ui/button"
import { Link } from "react-router-dom"

export default function HeroButton() {
    return (
        <Button
            className="
        bg-[royalblue] text-white text-[20px]
        rounded-[16px]
        px-4 py-[0.7em]
        flex items-center overflow-hidden
        transition-all duration-200
        hover:bg-[royalblue]
        active:scale-95
        [&_.svg-wrapper]:transition-transform [&_.svg-wrapper]:duration-300
        [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:origin-center
        [&_span]:ml-[0.3em] [&_span]:transition-transform [&_span]:duration-300

        hover:[&_.svg-wrapper]:animate-[fly-1_0.6s_ease-in-out_infinite_alternate]
        hover:[&_svg]:translate-x-[1.2em] hover:[&_svg]:rotate-45 hover:[&_svg]:scale-110
        hover:[&_span]:translate-x-[5em]
      "
        >
            <Link to="/ai-genrateor" aria-label="Go to AI generator">
                <span className="svg-wrapper-1">
                    <span className="svg-wrapper inline-flex">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width={24}
                            height={24}
                        >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                                fill="currentColor"
                                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                            />
                        </svg>
                    </span>
                </span>
                <span>Send</span>
            </Link>
        </Button>
    )
}
