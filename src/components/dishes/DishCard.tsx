import styles from "./DishBoard.module.css";

export function DishCard({ dish, broughtBy }: { dish: string; broughtBy: string }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.dishName} dir="auto">
        {dish}
      </h3>
      <p className={styles.by}>
        Brought by <strong dir="auto">{broughtBy}</strong>
      </p>
    </article>
  );
}
