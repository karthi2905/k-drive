import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg":
                            variant === "default",
                        "border-2 border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800":
                            variant === "outline",
                        "text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800": variant === "ghost",
                        "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
                    },
                    {
                        "h-10 px-4 py-2": size === "default",
                        "h-8 px-3 text-xs": size === "sm",
                        "h-12 px-6 text-base": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
