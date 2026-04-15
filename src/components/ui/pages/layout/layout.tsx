import React from 'react';
import styles from './layout.module.css';

export const LayoutUi = ({ children }: React.PropsWithChildren) => (
  <>
    <main className={styles.containerMain}>{children}</main>
  </>
);
