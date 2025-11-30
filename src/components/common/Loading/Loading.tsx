import styles from './Loading.module.css';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default Loading;
