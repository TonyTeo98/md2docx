import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className || ''}`}
      style={style}
    />
  );
};

// Editor skeleton for loading state
export const EditorSkeleton: React.FC = () => {
  return (
    <div className={styles.editorSkeleton}>
      <div className={styles.header}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={60} height={16} />
      </div>
      <div className={styles.content}>
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="45%" height={16} />
        <Skeleton variant="rectangular" width="100%" height={80} />
        <Skeleton variant="text" width="70%" height={16} />
        <Skeleton variant="text" width="85%" height={16} />
      </div>
    </div>
  );
};

// Preview skeleton for loading state
export const PreviewSkeleton: React.FC = () => {
  return (
    <div className={styles.previewSkeleton}>
      <div className={styles.header}>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={100} height={16} />
      </div>
      <div className={styles.content}>
        <Skeleton variant="text" width="50%" height={28} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="75%" height={16} />
        <Skeleton variant="rectangular" width="100%" height={120} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="80%" height={16} />
      </div>
    </div>
  );
};

export default Skeleton;
