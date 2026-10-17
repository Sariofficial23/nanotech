interface PictureProps {
  /** File name without size/extension, e.g. "station-front" → /images/station-front-1600.avif */
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Above-the-fold image: loaded eagerly with high priority. */
  priority?: boolean;
  width?: number;
  height?: number;
}

const path = (name: string, width: number, ext: string) => `/images/${name}-${width}.${ext}`;
const srcSet = (name: string, ext: string) => `${path(name, 800, ext)} 800w, ${path(name, 1600, ext)} 1600w`;

/** Responsive image: AVIF → WebP, 800/1600 px. width/height reserve space so the layout never jumps. */
export default function Picture({ name, alt, sizes, className, priority = false, width = 1672, height = 941 }: PictureProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, 'webp')} sizes={sizes} />
      <img
        src={path(name, 1600, 'webp')}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  );
}
