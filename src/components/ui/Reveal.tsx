import { motion, type HTMLMotionProps } from 'framer-motion';

const TAGS = { div: motion.div, li: motion.li, article: motion.article };

interface RevealProps extends HTMLMotionProps<'div'> {
  as?: keyof typeof TAGS;
  delay?: number;
  /** Vertical offset in px before the element appears. */
  y?: number;
}

/** Fades content in once it scrolls into view. Transforms are dropped automatically for reduced motion. */
export default function Reveal({ as = 'div', delay = 0, y = 18, children, ...rest }: RevealProps) {
  const Tag = TAGS[as] as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
