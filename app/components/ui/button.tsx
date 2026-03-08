import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const button = cva(
  'inline-flex items-center justify-center rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold/40',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-gold to-yellow-400 text-black shadow-glow hover:shadow-[0_0_30px_rgba(250,204,21,0.45)]',
        ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
        subtle: 'bg-white/5 text-white/80 hover:text-white'
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
