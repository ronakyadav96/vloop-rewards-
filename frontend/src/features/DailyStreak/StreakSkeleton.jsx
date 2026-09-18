import styles from './DailyStreak.module.css';

function StreakSkeleton() {
  return (
    <div className={styles.pageShell} aria-label="Loading daily streak" aria-busy="true">
      <div className={styles.skeletonHeader}><span className={styles.skeletonBlock} /><span className={styles.skeletonBlock} /><span className={styles.skeletonBlock} /></div>
      <main className={styles.pageContent}>
        <div className={`${styles.skeletonBlock} ${styles.skeletonHero}`} />
        <div className={styles.skeletonStats}>{[1, 2, 3].map((item) => <span className={styles.skeletonBlock} key={item} />)}</div>
        <div className={`${styles.skeletonBlock} ${styles.skeletonUltimate}`} />
        <div className={styles.skeletonCards}>{[1, 2, 3, 4, 5, 6, 7].map((item) => <span className={styles.skeletonBlock} key={item} />)}</div>
      </main>
    </div>
  );
}

export default StreakSkeleton;

